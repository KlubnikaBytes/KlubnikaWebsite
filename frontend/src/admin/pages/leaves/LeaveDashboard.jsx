import React, { useState, useEffect } from 'react';
import ApplyLeaveModal from './ApplyLeaveModal';
import LeaveDetailsModal from './LeaveDetailsModal';

const LeaveDashboard = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isApplyModalOpen, setApplyModalOpen] = useState(false);
    
    // For Review Modal
    const [selectedLeaveId, setSelectedLeaveId] = useState(null);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState('All');

    const currentUser = JSON.parse(localStorage.getItem('adminUser'));
    const isAdminView = currentUser.role === 'CEO' || currentUser.role === 'HR';

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            // HR/CEO see 'all', Employees see 'mine'
            const endpoint = isAdminView ? '/api/admin/leaves/all' : '/api/admin/leaves/mine';
            
            const res = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Failed to fetch leaves');
            setLeaves(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveApplied = (newLeave) => {
        // Optimistic update
        setLeaves([newLeave, ...leaves]);
    };

    const openDetails = (id) => {
        setSelectedLeaveId(id);
        setDetailsModalOpen(true);
    };

    const getStatusBadge = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Approved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'Rejected': 'bg-rose-100 text-rose-800 border-rose-200',
            'Need More Info': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
    };

    const filteredLeaves = statusFilter === 'All' ? leaves : leaves.filter(l => l.status === statusFilter);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 w-full sm:w-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Leave <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Management</span></h1>
                    <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
                        {isAdminView ? 'Review and manage employee leave requests.' : 'Track and apply for your time off.'}
                    </p>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto relative z-10">
                    <button 
                        onClick={() => setApplyModalOpen(true)}
                        className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-indigo-500/30 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        Apply for Leave
                    </button>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-200/60 overflow-hidden">
                {/* Filters */}
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/50 gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest shrink-0">Filter:</span>
                        <div className="relative w-full sm:w-auto">
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full sm:w-auto appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block py-2 pl-4 pr-10 font-bold shadow-sm transition-all cursor-pointer"
                            >
                                <option value="All">All Requests</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Need More Info">Need More Info</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto custom-scrollbar">
                    {loading ? (
                        <div className="py-24 flex justify-center items-center flex-col gap-4">
                            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin shadow-sm"></div>
                            <span className="text-sm font-bold text-slate-500">Loading requests...</span>
                        </div>
                    ) : error ? (
                        <div className="py-16 text-center text-rose-500 font-bold bg-rose-50/50">{error}</div>
                    ) : filteredLeaves.length === 0 ? (
                        <div className="py-24 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-5 shadow-inner ring-4 ring-white">
                                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            </div>
                            <p className="text-slate-800 font-extrabold text-lg">No leave requests found.</p>
                            <p className="text-slate-500 text-sm mt-1 max-w-sm">No requests match your current filters or you haven't applied for any leaves yet.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-white border-b border-slate-100 text-[11px] uppercase tracking-widest text-slate-400 font-extrabold sticky top-0 z-10">
                                    {isAdminView && <th className="p-5 pl-6">Employee</th>}
                                    <th className="p-5">Leave Info</th>
                                    <th className="p-5">Duration</th>
                                    <th className="p-5">Applied On</th>
                                    <th className="p-5">Status</th>
                                    <th className="p-5 pr-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLeaves.map((leave) => (
                                    <tr key={leave._id} className="hover:bg-slate-50/80 transition-all group relative">
                                        {isAdminView && (
                                            <td className="p-5 pl-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-600 font-extrabold flex items-center justify-center text-sm shadow-sm border border-indigo-50/50 group-hover:scale-105 transition-transform shrink-0">
                                                        {leave.employee?.name ? leave.employee.name.charAt(0) : 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">{leave.employee?.name || 'Unknown'}</div>
                                                        <div className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded-md inline-block mt-1 uppercase tracking-wider">{leave.employee?.role || 'User'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-800">{leave.type}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-sm text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block shadow-sm">
                                                {new Date(leave.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})} <span className="text-slate-400 mx-1">→</span> {new Date(leave.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm text-slate-500 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                {new Date(leave.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            {getStatusBadge(leave.status)}
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <button 
                                                onClick={() => openDetails(leave._id)}
                                                className="text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-indigo-100 hover:border-transparent shadow-sm hover:shadow group-hover:-translate-y-0.5"
                                            >
                                                {isAdminView && leave.status === 'Pending' ? 'Review' : 'Details'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ApplyLeaveModal 
                isOpen={isApplyModalOpen} 
                onClose={() => setApplyModalOpen(false)} 
                onLeaveApplied={handleLeaveApplied} 
            />

            <LeaveDetailsModal 
                isOpen={isDetailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                leaveId={selectedLeaveId}
                currentUser={currentUser}
                onLeaveUpdated={fetchLeaves}
            />

        </div>
    );
};

export default LeaveDashboard;
