import React, { useState, useEffect } from 'react';

const PageManager = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ title: '', slug: '' });

    // Editing State
    const [editingPage, setEditingPage] = useState(null);
    const [editFormData, setEditFormData] = useState({ content: '', seoMetaTitle: '', seoMetaDesc: '' });

    // Quick Action State
    const [activeQuickAction, setActiveQuickAction] = useState(null); // 'homepage', 'media', 'banners'
    const [sectionData, setSectionData] = useState({ content: '' });
    const [mediaList, setMediaList] = useState([]);
    const [mediaForm, setMediaForm] = useState({ name: '', url: '', type: 'Image' });

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const res = await fetch('/api/admin/cms/pages', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                });
                const data = await res.json();
                setPages(data);
            } catch (err) {
                console.error("Failed to load CMS pages", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPages();
    }, []);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/cms/pages', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setPages([data.page, ...pages]);
                setShowAddModal(false);
                setFormData({ title: '', slug: '' });
                alert('Page draft created successfully!');
            } else {
                alert(data.message || 'Failed to create page');
            }
        } catch (err) {
            alert('Server error while creating page');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (pageId, currentStatus) => {
        const newStatus = currentStatus === 'Draft' ? 'Published' : 'Draft';
        if (!confirm(`Are you sure you want to change this page status to ${newStatus}?`)) return;

        try {
            const res = await fetch(`/api/admin/cms/pages/${pageId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                const data = await res.json();
                setPages(pages.map(p => p._id === pageId ? data.page : p));
            } else {
                alert('Failed to update page status');
            }
        } catch (err) {
            alert('Server error while updating page');
        }
    };

    const openEditModal = (page) => {
        setEditingPage(page);
        setEditFormData({
            content: typeof page.content === 'object' ? JSON.stringify(page.content, null, 2) : (page.content || ''),
            seoMetaTitle: page.seoMeta?.title || '',
            seoMetaDesc: page.seoMeta?.description || ''
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Ensure content is parsed if they typed JSON, or just saved as string
            let parsedContent = editFormData.content;
            try { parsedContent = JSON.parse(editFormData.content); } catch (e) {}

            const payload = {
                content: parsedContent,
                seoMeta: {
                    title: editFormData.seoMetaTitle,
                    description: editFormData.seoMetaDesc
                }
            };

            const res = await fetch(`/api/admin/cms/pages/${editingPage._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                setPages(pages.map(p => p._id === editingPage._id ? data.page : p));
                setEditingPage(null);
                alert('Page content updated!');
            } else {
                alert('Failed to update page');
            }
        } catch (err) {
            alert('Server error while updating page');
        } finally {
            setSaving(false);
        }
    };

    const openQuickAction = async (action) => {
        setActiveQuickAction(action);
        setSaving(false);
        if (action === 'homepage' || action === 'banners') {
            setSectionData({ content: 'Loading...' });
            try {
                const res = await fetch(`/api/admin/cms/sections/${action}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSectionData({ content: typeof data.content === 'object' ? JSON.stringify(data.content, null, 2) : (data.content || '') });
                } else {
                    setSectionData({ content: '{}' });
                }
            } catch (err) {
                setSectionData({ content: '{}' });
            }
        } else if (action === 'media') {
            try {
                const res = await fetch('/api/admin/cms/media', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                });
                if (res.ok) {
                    setMediaList(await res.json());
                }
            } catch (err) {}
        }
    };

    const handleSectionSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let parsedContent = sectionData.content;
            try { parsedContent = JSON.parse(sectionData.content); } catch (e) {}

            const res = await fetch(`/api/admin/cms/sections/${activeQuickAction}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ content: parsedContent })
            });
            if (res.ok) {
                alert('Saved successfully!');
                setActiveQuickAction(null);
            }
        } catch (err) {
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleMediaSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/cms/media', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(mediaForm)
            });
            if (res.ok) {
                const data = await res.json();
                setMediaList([data.media, ...mediaList]);
                setMediaForm({ name: '', url: '', type: 'Image' });
            }
        } catch (err) {
            alert('Failed to upload media');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Header Area */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 w-full sm:w-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Content <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600">Management</span></h1>
                    <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">Draft, preview, and publish public website pages</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white px-5 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm flex justify-center items-center gap-2 focus:ring-4 focus:ring-fuchsia-500/30 relative z-10">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Create New Page
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pages List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            </span>
                            Live & Draft Pages
                        </h3>
                        <div className="flex gap-2">
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-md shadow-sm border border-slate-200">Total: {pages.length}</span>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center flex-col items-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3 shadow-sm"></div>
                            <span className="text-sm font-bold text-slate-500">Loading content library...</span>
                        </div>
                    ) : pages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 shadow-sm relative overflow-hidden">
                            <div className="w-16 h-16 bg-gradient-to-tr from-fuchsia-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner ring-4 ring-white relative z-10">
                                <svg className="w-8 h-8 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                            </div>
                            <h3 className="text-slate-900 font-extrabold text-lg relative z-10">No pages found</h3>
                            <p className="text-slate-500 mt-1 max-w-sm text-sm font-medium relative z-10">You haven't created any website pages yet. Click 'Create New Page' to map out your digital footprint.</p>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                        </div>
                    ) : (
                        <div className="bg-white shadow-lg shadow-slate-200/40 rounded-3xl border border-slate-200/60 overflow-hidden divide-y divide-slate-100">
                            {pages.map(page => (
                                <div key={page._id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/80 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-fuchsia-400 transition-colors"></div>
                                    <div className="flex items-start gap-4 pl-2">
                                        <div className="w-12 h-12 bg-gradient-to-tr from-fuchsia-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-md ring-2 ring-white shrink-0 group-hover:scale-105 transition-transform">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-fuchsia-600 transition-colors">{page.title}</h4>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs text-slate-500 font-medium">
                                                <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-bold font-mono"><svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg> /{page.slug}</span>
                                                <span className="hidden sm:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span className="flex items-center gap-1"><svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> {new Date(page.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pl-14 sm:pl-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 relative z-10">
                                        <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-md border shadow-sm 
                                            ${page.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                            {page.status}
                                        </span>
                                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal(page)} className="text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-100 p-2 rounded-xl transition-all shadow-sm border border-slate-200 hover:border-indigo-200" title="Edit Content">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                            </button>
                                            <button onClick={() => handleToggleStatus(page._id, page.status)} className="text-slate-400 hover:text-fuchsia-600 bg-slate-50 hover:bg-fuchsia-100 p-2 rounded-xl transition-all shadow-sm border border-slate-200 hover:border-fuchsia-200" title={page.status === 'Draft' ? 'Publish' : 'Unpublish'}>
                                                {page.status === 'Draft' ? (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Quick Actions */}
                <div className="space-y-6">
                     <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/40 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                         <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2 relative z-10">
                            <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 shadow-sm border border-slate-200">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            </span>
                            Quick Actions
                         </h3>
                         <div className="space-y-3 relative z-10">
                             <button onClick={() => openQuickAction('homepage')} className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all group shadow-sm hover:shadow">
                                 <span className="flex items-center gap-3"><span className="text-lg opacity-80 group-hover:scale-110 transition-transform">🏠</span> Manage Homepage</span>
                                 <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                             </button>
                             <button onClick={() => openQuickAction('media')} className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all group shadow-sm hover:shadow">
                                 <span className="flex items-center gap-3"><span className="text-lg opacity-80 group-hover:scale-110 transition-transform">🖼️</span> Media Library</span>
                                 <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                             </button>
                             <button onClick={() => openQuickAction('banners')} className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all group shadow-sm hover:shadow">
                                 <span className="flex items-center gap-3"><span className="text-lg opacity-80 group-hover:scale-110 transition-transform">📢</span> Global Banners</span>
                                 <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                             </button>
                         </div>
                     </div>
                     
                     <div className="bg-gradient-to-br from-fuchsia-600 to-indigo-600 p-6 rounded-3xl shadow-lg shadow-fuchsia-500/30 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-700"></div>
                        <h4 className="font-extrabold text-lg relative z-10 flex items-center gap-2">
                            <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                            Website Health
                        </h4>
                        <div className="mt-5 space-y-3 relative z-10">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="opacity-80">SEO Score</span>
                                <span>94/100</span>
                            </div>
                            <div className="w-full bg-black/20 rounded-full h-2 shadow-inner overflow-hidden">
                                <div className="bg-emerald-400 h-2 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] relative">
                                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>

            {/* Add Page Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-fuchsia-100 text-fuchsia-600 rounded-xl outline outline-4 outline-fuchsia-50 flex items-center justify-center shadow-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                </div>
                                Create New Page
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-2 rounded-xl transition-all shadow-sm border border-slate-200">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Page Title <span className="text-rose-500">*</span></label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="block w-full border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 sm:text-sm border px-4 py-3.5 transition-all text-slate-900 font-medium bg-slate-50 hover:bg-white focus:bg-white" placeholder="e.g. About Us" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">URL Slug <span className="text-rose-500">*</span></label>
                                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="block w-full border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 sm:text-sm border px-4 py-3.5 transition-all text-slate-900 font-medium bg-slate-50 hover:bg-white focus:bg-white" placeholder="e.g. about-us" />
                                <p className="text-xs text-slate-500 mt-2 font-medium">Path will be: <span className="text-slate-700 font-mono bg-slate-100 px-1 py-0.5 rounded">/{formData.slug || 'slug'}</span></p>
                            </div>
                            
                            <div className="pt-2 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 border-t border-slate-100 mt-6 pt-6 -mx-6 px-6 bg-slate-50/50">
                                <button type="button" onClick={() => setShowAddModal(false)} className="w-full sm:w-auto px-6 py-3.5 border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-3.5 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 focus:ring-4 focus:ring-fuchsia-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                                    {saving && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>}
                                    {saving ? 'Creating...' : 'Create Page'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Page Content Modal */}
            {editingPage && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl outline outline-4 outline-indigo-50 flex items-center justify-center shadow-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                </div>
                                <span className="truncate max-w-[200px] sm:max-w-md">Edit: {editingPage.title}</span>
                            </h3>
                            <button onClick={() => setEditingPage(null)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-2 rounded-xl transition-all shadow-sm border border-slate-200 shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                                        <span>Page Content</span>
                                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px]">HTML/JSON</span>
                                    </label>
                                    <textarea required value={editFormData.content} onChange={e => setEditFormData({...editFormData, content: e.target.value})} className="block w-full border-slate-200 rounded-2xl shadow-inner focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm border p-4 transition-all text-slate-800 bg-slate-50 hover:bg-white focus:bg-white h-64 sm:h-80 font-mono text-xs custom-scrollbar leading-relaxed" placeholder="<div class='container'>...</div>"></textarea>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="md:col-span-2 text-sm font-extrabold text-slate-700 mb-1">Search Engine Optimization</h4>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">SEO Title</label>
                                        <input type="text" value={editFormData.seoMetaTitle} onChange={e => setEditFormData({...editFormData, seoMetaTitle: e.target.value})} className="block w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm border px-4 py-3 transition-all text-slate-900 bg-white" placeholder="e.g. About Klubnika Bytes" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">SEO Description</label>
                                        <input type="text" value={editFormData.seoMetaDesc} onChange={e => setEditFormData({...editFormData, seoMetaDesc: e.target.value})} className="block w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm border px-4 py-3 transition-all text-slate-900 bg-white" placeholder="Meta description for search engines" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 shrink-0">
                                <button type="button" onClick={() => setEditingPage(null)} className="w-full sm:w-auto px-6 py-3.5 border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-3.5 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                                     {saving && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>}
                                    {saving ? 'Saving Changes...' : 'Save Content'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Quick Actions Functional Modals */}
            {activeQuickAction === 'homepage' || activeQuickAction === 'banners' ? (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl outline outline-4 outline-purple-50 flex items-center justify-center shadow-sm text-xl">
                                    {activeQuickAction === 'homepage' ? '🏠' : '📢'}
                                </div>
                                {activeQuickAction === 'homepage' ? 'Manage Homepage Content' : 'Global Banners'}
                            </h3>
                            <button onClick={() => setActiveQuickAction(null)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-2 rounded-xl transition-all shadow-sm border border-slate-200">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSectionSubmit} className="flex flex-col">
                            <div className="p-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                                    <span>Section Configuration</span>
                                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px]">JSON/HTML</span>
                                </label>
                                <textarea required value={sectionData.content} onChange={e => setSectionData({content: e.target.value})} className="block w-full border-slate-200 rounded-2xl shadow-inner focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 sm:text-sm border p-4 transition-all text-slate-800 bg-slate-50 hover:bg-white focus:bg-white h-64 font-mono text-xs custom-scrollbar leading-relaxed" placeholder="Configuration data"></textarea>
                            </div>
                            
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                                <button type="button" onClick={() => setActiveQuickAction(null)} className="w-full sm:w-auto px-6 py-3.5 border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-3.5 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:ring-4 focus:ring-purple-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                                    {saving && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>}
                                    {saving ? 'Saving...' : 'Save Configuration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : activeQuickAction === 'media' ? (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl outline outline-4 outline-blue-50 flex items-center justify-center shadow-sm text-xl lg:text-2xl">
                                    🖼️
                                </div>
                                Media Library
                            </h3>
                            <button onClick={() => setActiveQuickAction(null)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-2 rounded-xl transition-all shadow-sm border border-slate-200">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                            <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/30 p-6 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                                <h4 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2">
                                     <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                                    Add New Media Asset
                                </h4>
                                <form onSubmit={handleMediaSubmit} className="space-y-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Asset Name</label>
                                        <input required type="text" value={mediaForm.name} onChange={e => setMediaForm({...mediaForm, name: e.target.value})} className="block w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm border px-3 py-2.5 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Hero Image" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Asset URL (hosted)</label>
                                        <input required type="url" value={mediaForm.url} onChange={e => setMediaForm({...mediaForm, url: e.target.value})} className="block w-full border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm border px-3 py-2.5 bg-slate-50 focus:bg-white transition-colors" placeholder="https://..." />
                                    </div>
                                    <button type="submit" disabled={saving} className="w-full px-4 py-3 mt-2 border border-transparent rounded-xl shadow-md bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-sm font-bold text-white transition-all focus:ring-4 focus:ring-indigo-500/30 flex items-center justify-center gap-2">
                                        {saving && <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>}
                                        {saving ? 'Adding...' : 'Add Asset'}
                                    </button>
                                </form>
                            </div>
                            <div className="w-full flex-1 overflow-y-auto p-6 bg-slate-50/10 custom-scrollbar">
                                {mediaList.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <h3 className="text-slate-900 font-extrabold mb-1">Library is empty</h3>
                                        <p className="text-slate-500 text-sm max-w-xs font-medium">Add media URLs from the sidebar to populate your asset library.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                        {mediaList.map(media => (
                                            <div key={media._id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col">
                                                <div className="h-32 sm:h-40 bg-slate-100 relative group-hover:opacity-90 transition-opacity flex items-center justify-center overflow-hidden shrink-0">
                                                    {media.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                                        <img src={media.url} alt={media.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                                    ) : (
                                                        <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                                                         <button className="text-xs font-bold text-white bg-white/20 hover:bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 transition-colors">Copy URL</button>
                                                    </div>
                                                </div>
                                                <div className="p-4 flex-1 flex flex-col justify-end border-t border-slate-100">
                                                    <h5 className="font-extrabold text-slate-900 text-sm truncate" title={media.name}>{media.name}</h5>
                                                    <p className="text-[10px] text-slate-500 truncate mt-1 bg-slate-50 px-2 py-1 rounded inline-block font-mono" title={media.url}>{media.url}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default PageManager;
