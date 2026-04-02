import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  BarChart2, 
  Users, 
  CalendarDays, 
  Briefcase, 
  TrendingUp, 
  FileText, 
  Calendar, 
  Folder, 
  CheckCircle, 
  UserCircle, 
  Home 
} from 'lucide-react';
import logo from '../../assets/logo.png';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('adminUser'));
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Global 401 interceptor — auto-logout on expired token
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        // Clone to allow the caller to also read the body
        const clone = response.clone();
        try {
          const data = await clone.json();
          if (data?.message === 'Invalid or expired token') {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            navigate('/login');
          }
        } catch { /* ignore parse errors */ }
      }
      return response;
    };
    return () => { window.fetch = originalFetch; };
  }, [navigate]);

  if (!user) {
      navigate('/login');
      return null;
  }


  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Overview', path: '/admin/dashboard', roles: ['CEO'], icon: 'grid-outline' },
    { label: 'Team Directory', path: '/admin/hr/dashboard', roles: ['CEO', 'HR'], icon: 'people-outline' },
    { label: 'Attendance Log', path: '/admin/hr/attendance', roles: ['CEO', 'HR'], icon: 'calendar-outline' },
    { label: 'Job Postings', path: '/admin/hr/jobs', roles: ['CEO', 'HR'], icon: 'briefcase-outline' },
    { label: 'Performance', path: '/admin/hr/performance', roles: ['CEO', 'HR'], icon: 'analytics-outline' },
    { label: 'Website Content', path: '/admin/marketing/dashboard', roles: ['CEO', 'Digital Marketing Manager'], icon: 'document-text-outline' },
    { label: 'My Portal', path: '/admin/employee/dashboard', roles: ['Employee'], icon: 'person-outline' },
    { label: 'Leave Management', path: '/admin/leaves', roles: ['CEO', 'HR', 'Employee'], icon: 'calendar-outline' },
    { label: 'My Documents', path: '/admin/documents', roles: ['CEO', 'HR', 'Employee'], icon: 'document-outline' },
    { label: 'Document Verification', path: '/admin/hr/documents', roles: ['CEO', 'HR'], icon: 'checkmark-circle-outline' },
    { label: 'Job Applications', path: '/admin/hr/applications', roles: ['CEO', 'HR'], icon: 'briefcase-outline' },
    { label: 'My Profile', path: '/admin/profile', roles: ['CEO', 'HR', 'Employee'], icon: 'person-circle-outline' },
  ];

  const ICONS = {
    'Overview': <BarChart2 size={20} className="w-5 h-5 text-current" />,
    'Team Directory': <Users size={20} className="w-5 h-5 text-current" />,
    'Attendance Log': <Calendar size={20} className="w-5 h-5 text-current" />,
    'Job Postings': <Briefcase size={20} className="w-5 h-5 text-current" />,
    'Performance': <TrendingUp size={20} className="w-5 h-5 text-current" />,
    'Website Content': <FileText size={20} className="w-5 h-5 text-current" />,
    'Leave Management': <CalendarDays size={20} className="w-5 h-5 text-current" />,
    'My Documents': <Folder size={20} className="w-5 h-5 text-current" />,
    'Document Verification': <CheckCircle size={20} className="w-5 h-5 text-current" />,
    'Job Applications': <Briefcase size={20} className="w-5 h-5 text-current" />,
    'My Profile': <UserCircle size={20} className="w-5 h-5 text-current" />,
    'My Portal': <Home size={20} className="w-5 h-5 text-current" />,
  };

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`bg-gradient-to-b from-[#991b1b] to-[#b21b1b] text-white w-72 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-72'} md:translate-x-0 fixed md:relative h-full z-40 shadow-2xl md:shadow-none border-r border-[#b00602]`}>
        
        {/* Brand Header */}
        <div className="h-20 shrink-0 flex items-center justify-between px-6 border-b border-[#b00602]/60 bg-transparent">
          <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logo} alt="KB" className="w-full h-full object-contain" />
            </div>
            Klubnika Bytes
          </span>
          <button className="md:hidden text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20" onClick={() => setSidebarOpen(false)}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        {/* User Card in Sidebar */}
        <div className="p-5 border-b border-[#b00602]/60 shrink-0">
            <div className="flex items-center gap-4 bg-[#b21b1b] p-3.5 rounded-2xl border border-[#b00602]/50 hover:bg-[#b00602] hover:border-[#b00602] transition-colors group shadow-md">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#b21b1b] font-black text-xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-white leading-tight truncate">{user.name}</span>
                    <span className="text-xs text-white/90 mt-0.5 font-semibold tracking-wide uppercase truncate">{user.role}</span>
                    <span className="text-[10px] text-white/70 mt-1 uppercase font-medium">ID: {user.employeeId}</span>
                </div>
            </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-1 py-6 overflow-y-auto px-4 custom-scrollbar">
            <p className="text-[10px] text-white/60 tracking-widest font-bold uppercase mb-4 px-2">Main Menu</p>
            <nav className="flex-1 space-y-1.5">
                {visibleMenuItems.map((item, index) => {
                    const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                    return (
                        <Link key={index} to={item.path} onClick={() => window.innerWidth < 768 && setSidebarOpen(false)} className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                            ${isActive ? 'bg-white/20 text-white font-bold border border-white/20 shadow-inner' : 'hover:bg-white/10 hover:text-white text-white/80 font-medium border border-transparent'}`}>
                            
                            {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-md shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>}
                            
                            <span className={`shrink-0 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'} transition-colors`}>
                                {ICONS[item.label] || <Home size={20} className="w-5 h-5 text-current" />}
                            </span>
                            <span className={`tracking-wide text-[14px] ${isActive ? 'font-bold text-white' : ''}`}>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
        
        {/* Footer in Sidebar */}
        <div className="p-6 border-t border-[#b00602]/60 text-center shrink-0">
             <div className="flex items-center justify-center gap-2 text-xs text-white/60 font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                KB OS <span className="text-white/40">v2.1</span>
             </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full h-screen overflow-hidden">
        
        {/* Glassmorphism Top Navbar */}
        <header className="h-20 shrink-0 absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 bg-gradient-to-r from-indigo-700 to-indigo-600 backdrop-blur-xl border-b border-indigo-800 shadow-md transition-all text-white">
            <div className="flex items-center gap-4 sm:gap-6">
                <button className="md:hidden text-indigo-100 hover:text-white focus:outline-none transition-colors p-2 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/20" onClick={() => setSidebarOpen(true)}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                

            </div>
            
            <div className="flex items-center gap-3 sm:gap-5">


                {/* Profile Dropdown trigger */}
                <div className="relative">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-2.5 focus:outline-none group rounded-full p-1 pr-3 hover:bg-white/10 border border-transparent hover:border-white/20 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#b21b1b] font-bold text-xs shadow-sm ring-2 ring-white">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <svg className={`w-4 h-4 text-indigo-100 group-hover:text-white transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {showProfileMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                                </div>
                                <div className="py-2.5 px-3">
                                    <Link to="/admin/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                                        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                        My Profile
                                    </Link>
                                    <Link to="/admin/documents" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                                        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                        My Documents
                                    </Link>
                                </div>
                                <div className="border-t border-slate-100 py-2.5 px-3">
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                        Secure Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>

        {/* Scrollable Page Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-6 md:px-8 pb-12 pt-28 h-full">
           <div className="animate-in fade-in duration-700 max-w-[1600px] mx-auto">
             <Outlet />
           </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          ></div>
      )}
    </div>
  );
};

export default AdminLayout;
