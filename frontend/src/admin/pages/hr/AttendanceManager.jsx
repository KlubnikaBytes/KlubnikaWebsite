import React, { useState, useEffect } from 'react';

const AttendanceManager = () => {
    const [attendances, setAttendances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({
        employee: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        lates: 0,
        leaves: 0,
        halfDays: 0
    });
    
    const token = localStorage.getItem('adminToken');

    const fetchData = async () => {
        try {
            const [attRes, empRes] = await Promise.all([
                fetch('/api/admin/attendance/monthly', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/admin/hr/employees', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            
            if (attRes.ok) setAttendances(await attRes.json());
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

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/attendance/monthly', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to update record');
            
            setShowModal(false);
            setFormData({ ...formData, employee: '', lates: 0, leaves: 0, halfDays: 0 });
            fetchData();
        } catch (error) {
            alert('Error updating monthly attendance summary.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            const res = await fetch(`/api/admin/attendance/monthly/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error('Error deleting', error);
        }
    };

    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="p-6 md:p-8 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Monthly Attendance Summaries</h1>
                    <p className="text-slate-500 mt-1">Manage monthly lates, leaves, and grouped metrics per employee.</p>
                </div>
                <button 
                    onClick={() => {
                        setFormData({
                            employee: '',
                            month: new Date().getMonth() + 1,
                            year: new Date().getFullYear(),
                            lates: 0,
                            leaves: 0,
                            halfDays: 0
                        });
                        setShowModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-colors">
                    + Update Record
                </button>
            </div>
            
            <div className="p-6">
                {loading ? (
                    <p className="text-center text-slate-500 py-8">Loading attendance summaries...</p>
                ) : attendances.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No monthly summaries found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-200">
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Month/Year</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Lates</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Leaves</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Half Days</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.map((record) => (
                                    <tr key={record._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                        <td className="py-4 px-4">
                                            <div className="font-bold text-slate-800">{record.employee?.name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{record.employee?.employeeId}</div>
                                        </td>
                                        <td className="py-4 px-4 font-bold text-slate-700 text-center">
                                            {monthNames[record.month]} {record.year}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold">{record.lates}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-bold">{record.leaves}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">{record.halfDays}</span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button 
                                                onClick={() => {
                                                    setFormData({
                                                        employee: record.employee._id,
                                                        month: record.month,
                                                        year: record.year,
                                                        lates: record.lates,
                                                        leaves: record.leaves,
                                                        halfDays: record.halfDays
                                                    });
                                                    setShowModal(true);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-800 text-sm font-bold mr-3">Edit</button>
                                            <button 
                                                onClick={() => handleDelete(record._id)}
                                                className="text-rose-600 hover:text-rose-800 text-sm font-bold">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">Attendance Metrics</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Employee</label>
                                <select required value={formData.employee} onChange={e => setFormData({...formData, employee: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="" disabled>Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.name} ({emp.employeeId})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Month</label>
                                    <select value={formData.month} onChange={e => setFormData({...formData, month: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                                            <option key={m} value={m}>{monthNames[m]}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Year</label>
                                    <input type="number" required value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Lates</label>
                                    <input type="number" min="0" required value={formData.lates} onChange={e => setFormData({...formData, lates: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Leaves</label>
                                    <input type="number" step="0.5" min="0" required value={formData.leaves} onChange={e => setFormData({...formData, leaves: parseFloat(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Half Days</label>
                                    <input type="number" min="0" required value={formData.halfDays} onChange={e => setFormData({...formData, halfDays: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceManager;
