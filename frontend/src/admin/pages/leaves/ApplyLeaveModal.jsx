import React, { useState } from 'react';

const ApplyLeaveModal = ({ isOpen, onClose, onLeaveApplied }) => {
    const [formData, setFormData] = useState({
        type: 'Casual',
        startDate: '',
        endDate: '',
        reason: '',
        attachmentUrl: '' // Simple string for now, could be file upload handler
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch('/api/admin/leaves/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to apply for leave');

            onLeaveApplied(data.leave);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-3 w-full relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-2xl outline outline-4 outline-indigo-50 flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        </div>
                        Apply for Leave
                        
                        <button onClick={onClose} className="absolute right-0 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-2.5 rounded-xl transition-all shadow-sm border border-slate-200">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </h3>
                </div>

                <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                    {error && <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl text-sm font-bold border border-rose-100 flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        {error}
                    </div>}
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Leave Details</label>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Leave Type <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <select 
                                            name="type" 
                                            value={formData.type} 
                                            onChange={handleChange}
                                            className="w-full appearance-none rounded-xl border-slate-200 border px-4 py-3 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white shadow-sm transition-all focus:bg-white hover:bg-white"
                                        >
                                            <option value="Casual">Casual Leave</option>
                                            <option value="Sick">Sick Leave</option>
                                            <option value="Earned">Earned Leave</option>
                                            <option value="Emergency">Emergency</option>
                                            <option value="Paid">Paid Leave</option>
                                            <option value="Unpaid">Unpaid Leave</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Start Date <span className="text-rose-500">*</span></label>
                                        <input 
                                            type="date" 
                                            name="startDate" 
                                            required 
                                            value={formData.startDate} 
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-slate-200 border px-4 py-3 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white shadow-sm transition-all focus:bg-white hover:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">End Date <span className="text-rose-500">*</span></label>
                                        <input 
                                            type="date" 
                                            name="endDate" 
                                            required 
                                            value={formData.endDate} 
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-slate-200 border px-4 py-3 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white shadow-sm transition-all focus:bg-white hover:bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Reason <span className="text-rose-500">*</span></label>
                            <textarea 
                                name="reason" 
                                required 
                                rows="3"
                                value={formData.reason} 
                                onChange={handleChange}
                                placeholder="Please provide specific details..."
                                className="w-full rounded-2xl border-slate-200 border p-4 text-sm font-medium text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none bg-slate-50 focus:bg-white hover:bg-white transition-all shadow-inner"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Attachment URL <span className="text-slate-400 font-medium text-xs">(Optional)</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                                </div>
                                <input 
                                    type="url" 
                                    name="attachmentUrl" 
                                    value={formData.attachmentUrl} 
                                    onChange={handleChange}
                                    placeholder="https://"
                                    className="w-full rounded-xl border-slate-200 border pl-11 pr-4 py-3 text-sm font-medium text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-slate-50 focus:bg-white hover:bg-white transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
                            <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2">
                                {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>}
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyLeaveModal;
