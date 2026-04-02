import React, { useState, useEffect } from 'react';

const PerformanceReview = () => {
    const [appraisals, setAppraisals] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    
    const [formData, setFormData] = useState({
        employee: '',
        period: '',
        rating: 3,
        feedback: '',
        goalsAssigned: '',
        status: 'Draft'
    });
    
    const token = localStorage.getItem('adminToken');

    const fetchData = async () => {
        try {
            const [appRes, empRes] = await Promise.all([
                fetch('/api/admin/performance', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/admin/hr/employees', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            
            if (appRes.ok) setAppraisals(await appRes.json());
            if (empRes.ok) setEmployees(await empRes.json());
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleCreateReview = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/performance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to create review');
            
            setShowModal(false);
            setFormData({ employee: '', period: '', rating: 3, feedback: '', goalsAssigned: '', status: 'Draft' });
            fetchData();
        } catch (error) {
            alert('Error creating performance review.');
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="p-6 md:p-8 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Performance & Appraisals</h1>
                    <p className="text-slate-500 mt-1">Manage employee performance reviews and feedback.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-colors">
                    + New Review
                </button>
            </div>
            
            <div className="p-6">
                {loading ? (
                    <p className="text-center text-slate-500 py-8">Loading appraisals...</p>
                ) : appraisals.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No performance reviews found. Create one to get started.</p>
                ) : (
                    <div className="grid gap-4">
                        {appraisals.map((item) => (
                            <div key={item._id} className="border border-slate-200 p-4 rounded-xl flex justify-between items-center hover:shadow-md transition-shadow relative">
                                <div>
                                    <h3 className="font-bold text-slate-800">{item.employee?.name} <span className="text-sm font-normal text-slate-500">({item.period})</span></h3>
                                    <p className="text-sm text-slate-600 mt-1">Rating: <strong>{item.rating}</strong>/5 | <span className={`font-semibold ${item.status==='Finalized'?'text-emerald-600':'text-amber-600'}`}>Status: {item.status}</span></p>
                                </div>
                                <button onClick={() => setSelectedReview(item)} className="text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors">View Details</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Review Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-xl font-bold text-slate-800">New Performance Review</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateReview} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Employee</label>
                                <select required value={formData.employee} onChange={e => setFormData({...formData, employee: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="" disabled>Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Period (e.g. Q1 2026)</label>
                                    <input type="text" required value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Q1 2026" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Rating (1-5)</label>
                                        <input type="number" min="1" max="5" required value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option>Draft</option>
                                            <option>Finalized</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Feedback/Review Content</label>
                                <textarea required rows="4" value={formData.feedback} onChange={e => setFormData({...formData, feedback: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Excellent work this quarter..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Goals Assigned for Next Period</label>
                                <textarea rows="2" value={formData.goalsAssigned} onChange={e => setFormData({...formData, goalsAssigned: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="1. Complete AWS certification\n2. Rewrite legacy core..."></textarea>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm">Save Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {selectedReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-xl font-bold text-slate-800">Performance Review Details</h2>
                            <button onClick={() => setSelectedReview(null)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Employee</p>
                                    <p className="font-semibold text-slate-800 mt-1">{selectedReview.employee?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Review Period</p>
                                    <p className="font-semibold text-slate-800 mt-1">{selectedReview.period}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Rating</p>
                                    <p className="font-bold text-indigo-600 mt-1">{selectedReview.rating} out of 5</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                                    <p className={`font-bold mt-1 ${selectedReview.status === 'Finalized' ? 'text-emerald-600' : 'text-amber-600'}`}>{selectedReview.status}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">Feedback / Notes</h3>
                                <p className="text-slate-600 whitespace-pre-wrap">{selectedReview.feedback}</p>
                            </div>

                            {selectedReview.goalsAssigned && (
                                <div>
                                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">Assigned Goals</h3>
                                    <p className="text-slate-600 whitespace-pre-wrap">{selectedReview.goalsAssigned}</p>
                                </div>
                            )}

                            <div className="text-xs text-slate-400 text-right pt-4 border-t border-slate-100">
                                Record created: {new Date(selectedReview.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerformanceReview;
