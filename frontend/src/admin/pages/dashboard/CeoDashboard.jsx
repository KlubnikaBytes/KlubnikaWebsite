import React, { useEffect, useState } from 'react';

const CeoDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Token Manager State
    const [showTokenManager, setShowTokenManager] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [generatedToken, setGeneratedToken] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/dashboard/stats', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                });
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const openTokenManager = async () => {
        setShowTokenManager(true);
        setGeneratedToken('');
        setSelectedEmployee('');
        try {
            const res = await fetch('/api/admin/hr/employees', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await res.json();
            // Filter out CEOs
            setEmployees(data.filter(e => e.role !== 'CEO'));
        } catch (err) {
            console.error("Failed to load employees", err);
        }
    };

    const handleGenerateToken = async () => {
        if (!selectedEmployee) return;
        setGenerating(true);
        try {
            const res = await fetch('/api/admin/auth/generate-token', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ targetEmployeeId: selectedEmployee })
            });
            const data = await res.json();
            if (res.ok) {
                setGeneratedToken(data.token);
            } else {
                alert(data.message || 'Failed to generate token');
            }
        } catch (err) {
            alert('Server error generating token');
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedToken);
        alert("Token copied to clipboard!");
    };

    if (loading) return <div className="p-6 text-gray-500">Loading enterprise data...</div>;

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-700">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 w-full sm:w-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Executive <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Overview</span></h1>
                    <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">Real-time enterprise metrics and system activity</p>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto relative z-10">
                    <span className="flex items-center gap-2 bg-indigo-50/80 backdrop-blur-sm text-indigo-700 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl border border-indigo-100 shadow-sm shrink-0">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        CEO ACCESS
                    </span>
                    <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md flex justify-center items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        Export Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: 'Total Team Size', value: stats?.totalEmployees || 0, color: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-500/20', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                    { label: 'Active Personnel', value: stats?.activeEmployees || 0, color: 'from-emerald-500 to-teal-400', shadow: 'shadow-emerald-500/20', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Pending Referrals', value: stats?.totalReferrals || 0, color: 'from-indigo-600 to-purple-500', shadow: 'shadow-indigo-500/20', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
                    { label: 'Published Pages', value: stats?.publishedPages || 0, color: 'from-rose-500 to-pink-500', shadow: 'shadow-rose-500/20', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
                ].map((stat, i) => (
                    <div key={i} className={`relative overflow-hidden p-6 sm:p-7 rounded-3xl shadow-lg border border-white/10 bg-gradient-to-br ${stat.color} ${stat.shadow} text-white group hover:-translate-y-1.5 transition-all duration-300`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
                        <div className="absolute bottom-0 right-0 p-4 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                             <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}/></svg>
                        </div>
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-90 mb-3 relative z-10">{stat.label}</p>
                        <p className="text-4xl sm:text-5xl font-extrabold tracking-tight relative z-10">{stat.value}</p>
                        <div className="mt-5 flex items-center text-xs sm:text-sm bg-white/10 inline-flex px-3 py-1.5 rounded-full font-bold relative z-10 backdrop-blur-md">
                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                            Up from last month
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-4 sm:mt-8">
                {/* Recent Activity Stream */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
                    <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            Recent Activity
                        </h3>
                        <button className="text-sm text-indigo-600 font-bold hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-lg transition-colors">View All</button>
                    </div>
                    <div className="p-6 sm:p-8 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            {stats?.recentActivity?.length > 0 ? stats.recentActivity.map((log) => (
                                <div key={log._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 group-hover:bg-indigo-100 text-slate-500 group-hover:text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                                            <p className="text-slate-900 font-bold text-sm">
                                                {log.employee?.name}
                                            </p>
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-widest border border-slate-200 shrink-0 self-start sm:self-auto">{log.module}</span>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">{log.details}</p>
                                        <p className="text-xs text-slate-400 mt-3 font-semibold">{new Date(log.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                                        <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4Zm0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0Z"/></svg>
                                    </div>
                                    <p className="text-slate-600 font-bold text-lg">Silence in the system</p>
                                    <p className="text-slate-400 text-sm mt-1">No recent activity found right now.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Token Generator */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
                     <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                            Quick Actions
                        </h3>
                     </div>
                     <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                         <div className="mb-6">
                             <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600 shadow-sm border border-indigo-100">
                                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                             </div>
                             <h4 className="font-extrabold text-slate-900 text-lg mb-2">Access Control Engine</h4>
                             <p className="text-sm text-slate-500 leading-relaxed font-medium">Create secure, temporary onboarding tokens to invite new Staff, HR, or Marketing personnel to the enterprise portal securely.</p>
                         </div>
                         
                         <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl mt-auto">
                             <div className="flex items-center justify-between mb-5">
                                <span className="font-bold text-sm text-slate-700">Token Engine Status</span>
                                <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 uppercase tracking-widest shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                    ONLINE
                                </span>
                             </div>
                             <button 
                                 onClick={openTokenManager}
                                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-indigo-500/30 text-sm flex justify-center items-center gap-2"
                             >
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                 Launch Token Manager
                             </button>
                         </div>
                     </div>
                </div>
            </div>

            {/* Token Manager Modal */}
            {showTokenManager && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl outline outline-4 outline-indigo-50 flex items-center justify-center shadow-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                                </div>
                                Token Manager
                            </h3>
                            <button onClick={() => setShowTokenManager(false)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-2 rounded-xl transition-all shadow-sm border border-slate-200">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 sm:p-8">
                            {!generatedToken ? (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Personnel</label>
                                        <div className="relative">
                                            <select 
                                                value={selectedEmployee} 
                                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                                className="block w-full appearance-none border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm border px-4 py-3.5 transition-all text-slate-900 font-medium bg-slate-50 hover:bg-white"
                                            >
                                                <option value="" disabled>Select an employee...</option>
                                                {employees.map(emp => (
                                                    <option key={emp._id} value={emp._id}>
                                                        {emp.name} ({emp.employeeId}) - {emp.role}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-indigo-700 bg-indigo-50/80 backdrop-blur-sm p-4 rounded-2xl border border-indigo-100 flex gap-3 shadow-sm">
                                        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        <p className="font-medium leading-relaxed">Generated tokens enforce a 7-day TTL (Time-To-Live). Personnel must authenticate and set a permanent password within this window.</p>
                                    </div>
                                    <button 
                                        onClick={handleGenerateToken} 
                                        disabled={!selectedEmployee || generating}
                                        className="w-full py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex justify-center items-center gap-2"
                                    >
                                        {generating ? (
                                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Generating...</>
                                        ) : 'Generate Access Token'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mb-4 shadow-inner outline outline-4 outline-emerald-50 text-emerald-600">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                        </div>
                                        <h4 className="text-xl font-extrabold text-slate-900">Token Deployed</h4>
                                        <p className="text-sm text-slate-500 mt-1 font-medium">Transmit this payload securely to the employee.</p>
                                    </div>
                                    
                                    <div className="relative group mx-2">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-xl">
                                            <code className="text-[1.1rem] font-mono text-slate-800 break-all select-all font-extrabold tracking-tight w-full">{generatedToken}</code>
                                            <button 
                                                onClick={copyToClipboard}
                                                className="ml-5 p-3 text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-xl transition-all border border-indigo-100 flex-shrink-0 shadow-sm hover:shadow"
                                                title="Copy to clipboard"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setGeneratedToken('')} 
                                        className="w-full mt-4 py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
                                    >
                                        Reset & Generate Another
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CeoDashboard;

