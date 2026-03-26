import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
    const [referrals, setReferrals] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [showReferralForm, setShowReferralForm] = useState(false);
    const [formData, setFormData] = useState({ candidateName: '', candidateEmail: '', candidatePhone: '', jobRole: '', candidateResumeUrl: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, refsRes] = await Promise.all([
                    fetch('/api/admin/dashboard/stats', { headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } }),
                    fetch('/api/admin/referrals', { headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } })
                ]);

                setStats(await statsRes.json());
                setReferrals(await refsRes.json());
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleReferralSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/referrals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(formData)                        
            });

            if (res.ok) {
                const data = await res.json();
                setReferrals([data.referral, ...referrals]);
                setShowReferralForm(false);
                setFormData({ candidateName: '', candidateEmail: '', candidatePhone: '', jobRole: '', candidateResumeUrl: '' });
                alert("Referral submitted successfully!");
            }
        } catch (err) {
            alert("Error submitting referral.");
        }
    };

    if (loading) return <div className="p-6">Loading dashboard...</div>;

    const user = JSON.parse(localStorage.getItem('adminUser'));

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none opacity-60"></div>
                <div className="flex items-center space-x-6 relative z-10 w-full md:w-auto">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shadow-lg ring-4 ring-blue-50 rotate-3">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, {user.name}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded border border-indigo-100 uppercase tracking-wide">{user.role}</span>
                            <span className="text-gray-500 text-sm font-medium flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                                {user.employeeId}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex w-full md:w-auto gap-3 relative z-10">
                    <button
                        onClick={() => navigate('/admin/leaves')}
                        className="flex-1 md:flex-none justify-center bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-gray-50 hover:text-indigo-600 transition-all text-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Request Leave
                    </button>
                    <button
                        onClick={() => setShowReferralForm(true)}
                        className="flex-1 md:flex-none justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2 focus:ring-4 focus:ring-indigo-100"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Submit Referral
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Referrals Section */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">My Referrals</h3>
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{referrals.length} Total</span>
                    </div>
                    <div className="p-6">
                        {referrals.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                    <svg className="w-8 h-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                </div>
                                <p className="text-gray-900 font-bold mb-1">No referrals yet</p>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto">Help us grow the team! Earn bonuses for successful hires through your referrals.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {referrals.map(ref => (
                                    <div key={ref._id} className="flex justify-between items-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold shadow-inner group-hover:scale-105 transition-transform">
                                                {ref.candidateName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{ref.candidateName}</p>
                                                <p className="text-xs text-gray-500 font-medium mt-0.5"><span className="text-gray-400">Role:</span> {ref.jobRole}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border 
                                                ${ref.status === 'Hired' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' :
                                                    ref.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                        'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                {ref.status}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium">{new Date(ref.createdAt || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Leave Balances
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="font-medium text-gray-700">Casual Leave (CL)</span>
                                    <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">5 / 10 remaining</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 shadow-inner overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full" style={{ width: '50%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="font-medium text-gray-700">Earned Leave (EL)</span>
                                    <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">12 / 15 remaining</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 shadow-inner overflow-hidden">
                                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Announcement Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg shadow-indigo-500/30 text-white relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10 flex flex-col gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-1 backdrop-blur-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            </div>
                            <h4 className="font-bold text-lg leading-tight">Townhall Meeting</h4>
                            <p className="text-sm opacity-90 leading-relaxed">Join us this Friday at 4 PM for the Q3 Company update and roadmap presentation.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Overlay for Referral Form */}
            {showReferralForm && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">Submit a Referral</h3>
                            <button onClick={() => setShowReferralForm(false)} className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleReferralSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Candidate Name <span className="text-red-500">*</span></label>
                                <input required type="text" value={formData.candidateName} onChange={e => setFormData({ ...formData, candidateName: e.target.value })} className="block w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm border px-4 py-2.5 transition-all text-gray-900 placeholder-gray-400" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Candidate Email <span className="text-red-500">*</span></label>
                                <input required type="email" value={formData.candidateEmail} onChange={e => setFormData({ ...formData, candidateEmail: e.target.value })} className="block w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm border px-4 py-2.5 transition-all text-gray-900 placeholder-gray-400" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Candidate Phone <span className="text-red-500">*</span></label>
                                <input required type="text" value={formData.candidatePhone} onChange={e => setFormData({ ...formData, candidatePhone: e.target.value })} className="block w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm border px-4 py-2.5 transition-all text-gray-900 placeholder-gray-400" placeholder="+1 (555) 000-0000" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job Role <span className="text-red-500">*</span></label>
                                <input required type="text" value={formData.jobRole} onChange={e => setFormData({ ...formData, jobRole: e.target.value })} className="block w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm border px-4 py-2.5 transition-all text-gray-900 placeholder-gray-400" placeholder="e.g. Full-Stack Developer" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resume URL <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <input type="url" value={formData.candidateResumeUrl} onChange={e => setFormData({ ...formData, candidateResumeUrl: e.target.value })} className="block w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm border px-4 py-2.5 transition-all text-gray-900 placeholder-gray-400" placeholder="https://linkedin.com/in/johndoe or Google Drive link" />
                            </div>
                            <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6 pt-6 -mx-6 px-6 bg-gray-50/50">
                                <button type="button" onClick={() => setShowReferralForm(false)} className="px-5 py-2.5 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all">Submit Referral</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;
