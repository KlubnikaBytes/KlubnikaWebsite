import React, { useEffect, useState } from 'react';

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/applications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setApplications(data.applications);
            } else {
                setError(data.message || 'Failed to fetch applications');
            }
        } catch (err) {
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this application as ${newStatus}?`)) return;
        
        setProcessingId(id);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/applications/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            if (response.ok) {
                // Update local state
                setApplications(prev => prev.map(app => app._id === id ? { ...app, status: newStatus } : app));
                setSelectedApp(prev => prev && prev._id === id ? { ...prev, status: newStatus } : prev);
                alert(data.message);
            } else {
                alert(data.message || 'Error updating status');
            }
        } catch (error) {
            alert('Server error while updating status');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="p-6">Loading applications...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Job Applications</h1>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Job ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Referred By</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No applications found.</td></tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app._id} className={app.referredBy ? "bg-emerald-50/50 hover:bg-emerald-50" : "hover:bg-slate-50 transition-colors"}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900">{app.fullName || app.candidate?.name || 'Unknown'}</div>
                                        <div className="text-sm text-slate-500">{app.email || app.candidate?.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                                        #{app.jobId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {app.referredBy ? (
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                ★ {app.referredBy}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border 
                                            ${app.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                              app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                              'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => setSelectedApp(app)}
                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors font-semibold"
                                        >
                                            View Full Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Application Details */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
                        
                        <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between z-10 shadow-sm">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
                                    Application Details
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full border 
                                            ${selectedApp.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                              selectedApp.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                              'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                        {selectedApp.status}
                                    </span>
                                </h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">Job ID: #{selectedApp.jobId} • Submitted on {new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {selectedApp.status === 'Pending' && (
                                    <div className="flex gap-2 mr-4">
                                        <button 
                                            onClick={() => handleStatusUpdate(selectedApp._id, 'Rejected')}
                                            disabled={processingId === selectedApp._id}
                                            className="px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                           Reject
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(selectedApp._id, 'Accepted')}
                                            disabled={processingId === selectedApp._id}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1"
                                        >
                                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                           Accept
                                        </button>
                                    </div>
                                )}
                                <button 
                                    onClick={() => setSelectedApp(null)}
                                    className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-8 pb-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* Personal Information */}
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                            Personal Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</p><p className="text-slate-900 font-medium">{selectedApp.fullName || selectedApp.candidate?.name}</p></div>
                                            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p><p className="text-slate-900 font-medium">{selectedApp.email || selectedApp.candidate?.email}</p></div>
                                            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</p><p className="text-slate-900 font-medium">{selectedApp.phone || 'Not provided'}</p></div>
                                            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</p><p className="text-slate-900 font-medium">{selectedApp.address || 'Not provided'}</p></div>
                                        </div>
                                    </div>

                                    {/* Action Links */}
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                         <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                                            Documents & Referrals
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Resume</p>
                                                <a href={selectedApp.resumeLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1">
                                                    View Resume / Portfolio
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                                </a>
                                            </div>
                                            {selectedApp.referredBy && (
                                                <div className="bg-emerald-100 border border-emerald-200 p-3 rounded-lg">
                                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Referred By</p>
                                                    <p className="text-emerald-900 font-bold">★ {selectedApp.referredBy}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Background */}
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 h-full">
                                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                            Background Details
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Work Experience</p>
                                                <div className="text-slate-700 text-sm bg-white p-4 rounded-lg border border-slate-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                                    {selectedApp.workExperience || 'No work experience detailed.'}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Education</p>
                                                <div className="text-slate-700 text-sm bg-white p-4 rounded-lg border border-slate-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                                    {selectedApp.education || 'No education detailed.'}
                                                </div>
                                            </div>
                                            {selectedApp.coverLetter && (
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cover Letter</p>
                                                    <div className="text-slate-700 text-sm bg-indigo-50/50 p-4 rounded-lg border border-indigo-100 whitespace-pre-wrap italic max-h-40 overflow-y-auto">
                                                        "{selectedApp.coverLetter}"
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="pt-4 border-t border-slate-200">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Legal & Agreements</p>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <svg className={`w-5 h-5 ${selectedApp.legalTermsAccepted ? 'text-emerald-500' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                                        Accepted Legal Terms & Privacy Policy
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <svg className={`w-5 h-5 ${selectedApp.acknowledgementAccepted ? 'text-emerald-500' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                                        Acknowledged Truthfulness of Application
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationsList;
