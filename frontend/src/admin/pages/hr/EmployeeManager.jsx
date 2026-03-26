import React, { useState, useEffect } from 'react';

const EmployeeManager = () => {
    // Tab State
    const [activeTab, setActiveTab] = useState('personnel'); // 'personnel', 'leaves', 'referrals'
    
    // Data State
    const [employees, setEmployees] = useState([]);
    const [referrals, setReferrals] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('adminUser'));
    
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Add Personnel State
    const [showAddModal, setShowAddModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        email: '',
        role: 'Employee',
        designation: '',
        department: ''
    });

    // Token Modal State
    const [tokenData, setTokenData] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [empRes, refRes] = await Promise.all([
                fetch('/api/admin/hr/employees', { headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } }),
                fetch('/api/admin/referrals', { headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } })
            ]);
            
            if (empRes.ok) setEmployees(await empRes.json());
            if (refRes.ok) setReferrals(await refRes.json());
        } catch (err) {
            console.error("Failed to fetch HR data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...formData };
            if (!payload.department) {
                delete payload.department;
            }

            const res = await fetch('/api/admin/hr/employees', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(payload)
            });
            
            const data = await res.json();
            if (res.ok) {
                setEmployees([...employees, data.employee]);
                setShowAddModal(false);
                setFormData({ employeeId: '', name: '', email: '', role: 'Employee', designation: '', department: '' });
                alert('Personnel added successfully!');
            } else {
                alert(data.message || 'Failed to add personnel');
            }
        } catch (err) {
            alert('Server error while adding personnel');
        } finally {
            setSaving(false);
        }
    };

    const handleIssueToken = async (targetEmployeeId) => {
        try {
            const res = await fetch('/api/admin/auth/generate-token', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ targetEmployeeId })
            });
            const data = await res.json();
            if (res.ok) {
                // Find employee name for better UX
                const emp = employees.find(e => e._id === targetEmployeeId);
                setTokenData({
                    token: data.token,
                    employeeName: emp ? emp.name : 'Employee'
                });
            } else {
                alert(data.message || 'Failed to generate token');
            }
        } catch (err) {
            alert('Server error generating token');
        }
    };

    const copyTokenToClipboard = () => {
        if (tokenData && tokenData.token) {
            navigator.clipboard.writeText(tokenData.token).then(() => {
                alert('Token copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy token. Please select and copy it manually.');
            });
        }
    };

    const handleUpdateReferral = async (id, status) => {
        try {
            const res = await fetch(`/api/admin/referrals/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setReferrals(referrals.map(r => r._id === id ? { ...r, status } : r));
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteEmployee = async (emp) => {
        if (!window.confirm(`Are you sure you want to permanently remove ${emp.name} (${emp.employeeId}) from the system? This action cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/admin/hr/employees/${emp._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await res.json();
            if (res.ok) {
                setEmployees(employees.filter(e => e._id !== emp._id));
            } else {
                alert(data.message || 'Failed to remove employee.');
            }
        } catch (err) {
            alert('Server error while removing employee.');
        }
    };

    const filteredEmployees = employees.filter(emp => 
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 w-full sm:w-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Directory</span></h1>
                    <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">Manage personnel, access roles, and onboarding logistics</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm flex justify-center items-center gap-2 focus:ring-4 focus:ring-indigo-500/30 relative z-10"
                >
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                    Add Personnel
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto custom-scrollbar border-b border-slate-200 mb-6 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex space-x-2 sm:space-x-4 min-w-max pb-px">
                {[
                    { id: 'personnel', label: 'Personnel Directory' },
                    { id: 'referrals', label: 'Referral Pipeline', count: referrals.filter(r => r.status === 'Submitted').length }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-bold border-b-2 transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'}`}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
                </div>
            </div>

            {activeTab === 'personnel' && (
            <div className="bg-white shadow-lg shadow-slate-200/40 rounded-3xl border border-slate-200/60 overflow-hidden flex flex-col animate-in fade-in duration-300">
                {/* Toolbar */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50/50">
                    <div className="relative w-full lg:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search by name, email, or ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium shadow-sm hover:border-slate-300"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
                        <select className="w-full sm:w-auto px-4 py-3 border border-slate-200 rounded-2xl text-sm bg-white font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm hover:border-slate-300 cursor-pointer appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat">
                            <option>All Departments</option>
                            <option>Human Resources</option>
                            <option>Digital Marketing</option>
                            <option>Engineering</option>
                            <option>Executive</option>
                        </select>
                        <select className="w-full sm:w-auto px-4 py-3 border border-slate-200 rounded-2xl text-sm bg-white font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm hover:border-slate-300 cursor-pointer appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat">
                            <option>All Statuses</option>
                            <option>Active</option>
                            <option>Onboarding</option>
                            <option>Suspended</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-[#f8fafc]">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200">Personnel</th>
                                <th scope="col" className="hidden sm:table-cell px-6 py-4 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200">Role & Dept</th>
                                <th scope="col" className="hidden lg:table-cell px-6 py-4 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200">Auth Status</th>
                                <th scope="col" className="hidden xl:table-cell px-6 py-4 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200">Enrollment</th>
                                <th scope="col" className="relative px-6 py-4 bg-slate-50 border-b border-slate-200"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex justify-center flex-col items-center">
                                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3 shadow-sm"></div>
                                            <span className="text-sm font-bold text-slate-500">Syncing directory...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="bg-slate-50 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                                           <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                        </div>
                                        <p className="text-slate-900 font-extrabold">No personnel found</p>
                                        <p className="text-slate-500 text-sm mt-1 font-medium">Try tweaking your search or filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((emp) => (
                                    <tr key={emp._id} className="hover:bg-indigo-50/50 transition-colors group cursor-default">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md ring-2 ring-white group-hover:shadow-lg transition-all group-hover:scale-105">
                                                    {emp.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-extrabold text-slate-900">{emp.name}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5 tracking-wide font-medium">{emp.employeeId} &bull; {emp.email}</div>
                                                    <div className="sm:hidden text-xs font-bold text-slate-700 mt-1">{emp.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-extrabold text-slate-800">{emp.role}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 font-medium">{emp.designation || 'General Staff'}</div>
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex text-[10px] leading-4 font-extrabold rounded-md uppercase tracking-widest border shadow-sm
                                                ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                  emp.status === 'Onboarding' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' : 
                                                  'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-bold">
                                            {new Date(emp.joinedAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 lg:gap-3 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                {emp.status === 'Onboarding' && (
                                                    <button 
                                                        onClick={() => handleIssueToken(emp._id)}
                                                        className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200 shadow-sm hover:shadow"
                                                    >
                                                        Issue Token
                                                    </button>
                                                )}
                                                {(currentUser?.role === 'CEO' || currentUser?.role === 'HR') && (
                                                    <button 
                                                        onClick={() => handleDeleteEmployee(emp)}
                                                        className="text-[11px] font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg transition-all border border-rose-200 shadow-sm hover:shadow"
                                                        title="Remove Employee"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100" title="Edit Staff">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (Mockup) */}
                <div className="bg-[#f8fafc] px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500 font-medium text-center sm:text-left w-full sm:w-auto">
                        Showing <span className="font-extrabold text-slate-900">1</span> to <span className="font-extrabold text-slate-900">{filteredEmployees.length}</span> of <span className="font-extrabold text-slate-900">{employees.length}</span> personnel
                    </p>
                    <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px w-full sm:w-auto justify-center" aria-label="Pagination">
                        <button className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-slate-200 bg-indigo-50 text-indigo-700 text-sm font-extrabold z-10 transition-colors">1</button>
                        <button className="relative hidden sm:inline-flex items-center px-4 py-2 border border-slate-200 bg-white text-slate-500 text-sm font-bold hover:bg-slate-50 hover:text-slate-800 transition-colors">2</button>
                        <button className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4-4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        </button>
                    </nav>
                </div>
            </div>
            )}

            {/* REFERRALS TAB */}
            {activeTab === 'referrals' && (
                <div className="bg-white shadow-lg shadow-slate-200/40 rounded-3xl border border-slate-200/60 overflow-hidden flex flex-col animate-in fade-in duration-300 p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-extrabold mb-6 text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        </div>
                        Referral Pipeline
                    </h2>
                    <div className="space-y-4">
                        {referrals.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                <p className="text-slate-500 font-bold">No candidate referrals.</p>
                            </div>
                        ) : referrals.map(ref => (
                            <div key={ref._id} className="border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-300 hover:shadow-md transition-all bg-gradient-to-r hover:from-blue-50/50 block relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-blue-400 transition-colors"></div>
                                <div className="pl-2 w-full sm:w-auto">
                                    <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 mb-2 border-b border-slate-100 pb-2 sm:border-0 sm:pb-0">
                                        <h4 className="font-extrabold text-slate-900 text-lg">{ref.candidateName}</h4>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">{ref.jobRole}</span>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mt-2 sm:mt-3 mb-3 inline-block w-full sm:w-auto">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Referred By</p>
                                        <p className="text-sm font-extrabold text-indigo-700">{ref.referredBy?.name}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 text-sm text-slate-600 font-medium">
                                        <span className="flex items-center gap-2"><svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>{ref.candidateEmail}</span>
                                        <span className="hidden sm:inline text-slate-300">&bull;</span>
                                        <span className="flex items-center gap-2 mt-1 sm:mt-0"><svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>{ref.candidatePhone}</span>
                                        {ref.candidateResumeUrl && (
                                            <>
                                                <span className="hidden sm:inline text-slate-300">&bull;</span>
                                                <a href={ref.candidateResumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 mt-1 sm:mt-0 text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                                                    View Resume
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t border-slate-100 sm:border-0 pt-4 sm:pt-0">
                                    <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md uppercase tracking-widest border shadow-sm ${
                                        ref.status === 'Hired' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                        ref.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                                        ref.status === 'Interviewing' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                        {ref.status}
                                    </span>
                                    {ref.status === 'Submitted' && (
                                        <div className="mt-0 sm:mt-3 flex gap-2">
                                            <button onClick={() => handleUpdateReferral(ref._id, 'Interviewing')} className="text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 px-4 py-2 rounded-lg transition-all shadow-sm">Interview</button>
                                            <button onClick={() => handleUpdateReferral(ref._id, 'Rejected')} className="text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-500 hover:text-white border border-rose-200 px-4 py-2 rounded-lg transition-all shadow-sm">Reject</button>
                                        </div>
                                    )}
                                    {ref.status === 'Interviewing' && (
                                        <div className="mt-0 sm:mt-3 flex gap-2">
                                            <button onClick={() => handleUpdateReferral(ref._id, 'Hired')} className="text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border border-emerald-200 px-4 py-2 rounded-lg transition-all shadow-sm">Hire</button>
                                            <button onClick={() => handleUpdateReferral(ref._id, 'Rejected')} className="text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-500 hover:text-white border border-rose-200 px-4 py-2 rounded-lg transition-all shadow-sm">Reject</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Personnel Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl outline outline-4 outline-indigo-50 flex items-center justify-center shadow-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                                </div>
                                Add New Personnel
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-2 rounded-xl transition-all shadow-sm border border-slate-200">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar flex-1 p-6">
                            <form id="add-personnel-form" onSubmit={handleAddSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name <span className="text-rose-500">*</span></label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="block w-full border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm border px-4 py-3.5 transition-all text-slate-900 font-medium bg-slate-50 hover:bg-white focus:bg-white" placeholder="e.g. Jane Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Employee ID <span className="text-rose-500">*</span></label>
                                        <input required type="text" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="block w-full border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm border px-4 py-3.5 transition-all text-slate-900 font-medium bg-slate-50 hover:bg-white focus:bg-white uppercase" placeholder="e.g. KB012" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address <span className="text-rose-500">*</span></label>
                                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="block w-full border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm border px-4 py-3.5 transition-all text-slate-900 font-medium bg-slate-50 hover:bg-white focus:bg-white" placeholder="jane@klubnikabytes.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">System Role <span className="text-rose-500">*</span></label>
                                        <div className="relative">
                                            <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="block w-full appearance-none border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm border px-4 py-3.5 transition-all text-slate-900 font-bold bg-slate-50 hover:bg-white focus:bg-white cursor-pointer">
                                                <option value="Employee">Employee (Standard)</option>
                                                <option value="HR">Human Resources</option>
                                                <option value="Digital Marketing Manager">Digital Marketing Manager</option>
                                                <option value="CEO">CEO (Executive)</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Official Designation</label>
                                        <input type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="block w-full border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm border px-4 py-3.5 transition-all text-slate-900 font-medium bg-slate-50 hover:bg-white focus:bg-white" placeholder="e.g. Senior Developer" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 shrink-0">
                            <button type="button" onClick={() => setShowAddModal(false)} className="w-full sm:w-auto px-6 py-3.5 border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors">Cancel</button>
                            <button type="submit" form="add-personnel-form" disabled={saving} className="w-full sm:w-auto px-6 py-3.5 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                                {saving ? (
                                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> Provisioning...</>
                                ) : 'Provision Personnel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Token Display Modal */}
            {tokenData && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200/60 relative">
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm ring-4 ring-emerald-50">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Token Generated</h3>
                            <p className="text-sm text-slate-500 mb-6 font-medium">
                                Secure onboarding token for <span className="font-bold text-slate-800">{tokenData.employeeName}</span> has been created.
                            </p>
                            
                            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 shadow-inner relative group">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border border-slate-200 rounded-md">Passkey</div>
                                <code className="block text-lg font-mono font-bold text-indigo-700 break-all select-all">{tokenData.token}</code>
                            </div>
                            
                            <div className="flex flex-col w-full gap-3">
                                <button 
                                    onClick={copyTokenToClipboard}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 focus:ring-4 focus:ring-slate-900/20"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                                    Copy to Clipboard
                                </button>
                                <button 
                                    onClick={() => setTokenData(null)}
                                    className="w-full bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 px-6 rounded-xl transition-all border border-slate-200"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManager;
