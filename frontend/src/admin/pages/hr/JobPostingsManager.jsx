import React, { useState, useEffect } from 'react';


const JobPostingsManager = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Full-time',
        location: 'On-site',
        description: '',
        requirements: '',
        benefits: '',
        status: 'Active'
    });
    const token = localStorage.getItem('adminToken');

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/admin/jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch jobs');
            const data = await res.json();
            setJobs(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching jobs', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchJobs();
    }, [token]);

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            const reqArray = formData.requirements.split('\n').filter(r => r.trim() !== '');
            const benArray = formData.benefits.split('\n').filter(b => b.trim() !== '');
            
            const payload = {
                ...formData,
                requirements: reqArray,
                benefits: benArray
            };

            const res = await fetch('/api/admin/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed to create job');
            setShowModal(false);
            setFormData({ title: '', type: 'Full-time', location: 'On-site', description: '', requirements: '', benefits: '', status: 'Active' });
            fetchJobs(); // refresh list
        } catch (error) {
            console.error('Error creating job', error);
            alert('Failed to post job');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return;
        try {
            const res = await fetch(`/api/admin/jobs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete job');
            fetchJobs();
        } catch (error) {
            console.error('Error deleting job', error);
            alert('Failed to delete job');
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="p-6 md:p-8 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Job Postings</h1>
                    <p className="text-slate-500 mt-1">Manage open positions displayed on the Careers portal.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-colors">
                    + Post Job
                </button>
            </div>
            
            <div className="p-6">
                {loading ? (
                    <p className="text-center text-slate-500 py-8">Loading job postings...</p>
                ) : jobs.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No jobs posted yet. Click + Post Job to create one.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <div key={job._id} className="border border-slate-200 p-5 rounded-2xl hover:shadow-lg transition-all relative group bg-slate-50/30">
                                <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${job.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {job.status}
                                </span>
                                <h3 className="font-bold text-lg text-slate-800 pr-16">{job.title}</h3>
                                <div className="mt-2 text-sm text-slate-500 font-medium flex gap-3">
                                    <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> {job.type}</span>
                                    <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> {job.location}</span>
                                </div>
                                <div className="mt-6 flex gap-2">
                                    <button className="flex-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-1.5 rounded-lg text-sm font-bold transition-colors">Edit</button>
                                    <button onClick={() => handleDelete(job._id)} className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 py-1.5 rounded-lg text-sm font-bold transition-colors">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Job Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-xl font-bold text-slate-800">Post a New Job</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateJob} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Senior Frontend Developer" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                                    <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option>On-site</option>
                                        <option>Remote</option>
                                        <option>Hybrid</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Brief overview of the role..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Requirements (one per line)</label>
                                <textarea rows="3" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="React 18+\nNode.js\n..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Benefits (one per line)</label>
                                <textarea rows="3" value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Health Insurance\nFlexible hours\n..."></textarea>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm">Post Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobPostingsManager;
