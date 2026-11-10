import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../../config/api';

const JobPostingsManager = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState('');

    const defaultForm = {
        title: '',
        type: 'Full-time',
        workplaceType: 'On-site',
        location: '',
        description: '',
        requirements: '',
        benefits: '',
        status: 'Active'
    };

    const [formData, setFormData] = useState(defaultForm);
    const token = localStorage.getItem('adminToken');

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await fetch(apiUrl('/api/admin/jobs'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch jobs');
            const data = await res.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching jobs', error);
            setActionError('Failed to load job postings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchJobs();
    }, [token]);

    const handleOpenCreate = () => {
        setEditingJob(null);
        setFormData(defaultForm);
        setActionError('');
        setShowModal(true);
    };

    const handleOpenEdit = (job) => {
        setEditingJob(job);
        setActionError('');

        // Backward compatibility: If job was saved before workplaceType existed,
        // job.location might hold "On-site", "Remote", or "Hybrid"
        const isLegacyWorkplace = ['On-site', 'Remote', 'Hybrid'].includes(job.location);
        const resolvedWorkplaceType = job.workplaceType || (isLegacyWorkplace ? job.location : 'On-site');
        const resolvedLocation = job.workplaceType ? (job.location || '') : (isLegacyWorkplace ? '' : (job.location || ''));

        setFormData({
            title: job.title || '',
            type: job.type || 'Full-time',
            workplaceType: resolvedWorkplaceType,
            location: resolvedLocation,
            description: job.description || '',
            requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''),
            benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : (job.benefits || ''),
            status: job.status || 'Active'
        });
        setShowModal(true);
    };

    const handleSubmitJob = async (e) => {
        e.preventDefault();
        setActionError('');

        if (!formData.title.trim()) {
            setActionError('Please enter a job title');
            return;
        }

        if (!formData.description.trim()) {
            setActionError('Please provide a job description');
            return;
        }

        try {
            setSubmitting(true);
            const reqArray = formData.requirements
                .split('\n')
                .map(r => r.trim())
                .filter(Boolean);

            const benArray = formData.benefits
                .split('\n')
                .map(b => b.trim())
                .filter(Boolean);

            const payload = {
                title: formData.title.trim(),
                type: formData.type,
                workplaceType: formData.workplaceType,
                location: formData.location.trim(),
                description: formData.description.trim(),
                requirements: reqArray,
                benefits: benArray,
                status: formData.status
            };

            const url = editingJob 
                ? apiUrl(`/api/admin/jobs/${editingJob._id}`) 
                : apiUrl('/api/admin/jobs');

            const method = editingJob ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || 'Failed to save job posting');
            }

            setShowModal(false);
            setEditingJob(null);
            setFormData(defaultForm);
            await fetchJobs();
        } catch (error) {
            console.error('Error saving job', error);
            setActionError(error.message || 'Failed to save job posting');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) return;
        try {
            const res = await fetch(apiUrl(`/api/admin/jobs/${id}`), {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete job');
            fetchJobs();
        } catch (error) {
            console.error('Error deleting job', error);
            alert('Failed to delete job posting');
        }
    };

    const getWorkplaceBadge = (job) => {
        if (job.workplaceType) return job.workplaceType;
        if (['On-site', 'Remote', 'Hybrid'].includes(job.location)) return job.location;
        return 'On-site';
    };

    const getLocationDisplay = (job) => {
        if (job.workplaceType && job.location) return job.location;
        if (!['On-site', 'Remote', 'Hybrid'].includes(job.location) && job.location) return job.location;
        return '';
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="p-6 md:p-8 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Job Postings</h1>
                    <p className="text-slate-500 mt-1">Manage open career positions and job descriptions displayed on the website.</p>
                </div>
                <button 
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    Post New Job
                </button>
            </div>
            
            <div className="p-6">
                {actionError && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center justify-between">
                        <span>{actionError}</span>
                        <button onClick={() => setActionError('')} className="text-rose-500 hover:text-rose-800">✕</button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-16">
                        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-slate-500 font-medium">Loading job postings...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">No Job Postings Yet</h3>
                        <p className="text-slate-500 text-sm max-w-md mx-auto mt-1 mb-5">Create your first job posting to start receiving candidate applications through the Careers page.</p>
                        <button 
                            onClick={handleOpenCreate}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all">
                            + Post New Job
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => {
                            const workplace = getWorkplaceBadge(job);
                            const cityLoc = getLocationDisplay(job);

                            return (
                                <div key={job._id} className="border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-all relative flex flex-col justify-between bg-white hover:border-slate-300">
                                    <div>
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <span className="text-[11px] font-mono font-bold text-slate-400 tracking-wider">
                                                #{job._id ? job._id.substring(0, 8).toUpperCase() : 'JOB'}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${job.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                                {job.status || 'Active'}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-lg text-slate-900 leading-snug line-clamp-1">{job.title}</h3>

                                        {/* Metadata tags */}
                                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                                                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                </svg>
                                                {job.type}
                                            </span>

                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                                                <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                                </svg>
                                                {workplace}
                                            </span>

                                            {cityLoc && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold">
                                                    <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                    </svg>
                                                    {cityLoc}
                                                </span>
                                            )}
                                        </div>

                                        {/* Description excerpt */}
                                        <p className="mt-3 text-slate-500 text-xs line-clamp-2 leading-relaxed">
                                            {job.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => handleOpenEdit(job)} 
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95">
                                            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                            Edit
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleDelete(job._id)} 
                                            className="inline-flex items-center justify-center gap-1 px-3 bg-rose-50 text-rose-600 hover:bg-rose-100 py-2 rounded-xl text-xs font-bold transition-all active:scale-95">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create / Edit Job Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingJob ? 'Edit Job Posting' : 'Post a New Job'}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {editingJob ? 'Update position information, requirements, and location.' : 'Fill in the job details to publish it immediately on the careers portal.'}
                                </p>
                            </div>
                            <button 
                                onClick={() => { setShowModal(false); setEditingJob(null); }} 
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmitJob} className="p-6 space-y-4 overflow-y-auto flex-1">
                            {actionError && (
                                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                                    {actionError}
                                </div>
                            )}

                            {/* Job Title */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Job Title <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    required 
                                    type="text" 
                                    value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})} 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium text-slate-800 transition-all" 
                                    placeholder="e.g. Senior Frontend Developer, GCC Sales Manager" 
                                />
                            </div>

                            {/* Type, Workplace Mode, Location & Status */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Employment Type
                                    </label>
                                    <select 
                                        value={formData.type} 
                                        onChange={e => setFormData({...formData, type: e.target.value})} 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium text-slate-800 transition-all">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Workplace Mode
                                    </label>
                                    <select 
                                        value={formData.workplaceType} 
                                        onChange={e => setFormData({...formData, workplaceType: e.target.value})} 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium text-slate-800 transition-all">
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Location (City, Country / Office)
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={formData.location} 
                                            onChange={e => setFormData({...formData, location: e.target.value})} 
                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium text-slate-800 transition-all" 
                                            placeholder="e.g. Kolkata, India or Dubai, UAE" 
                                        />
                                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Listing Status
                                    </label>
                                    <select 
                                        value={formData.status} 
                                        onChange={e => setFormData({...formData, status: e.target.value})} 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium text-slate-800 transition-all">
                                        <option value="Active">Active (Visible on Careers page)</option>
                                        <option value="Inactive">Inactive (Hidden from public)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Job Overview / Description <span className="text-rose-500">*</span>
                                </label>
                                <textarea 
                                    required 
                                    rows="4" 
                                    value={formData.description} 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-normal text-slate-800 transition-all leading-relaxed" 
                                    placeholder="Write a clear, comprehensive overview of this position, its goals, and key responsibilities..."
                                />
                            </div>

                            {/* Requirements */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex justify-between">
                                    <span>Requirements & Qualifications</span>
                                    <span className="text-[11px] font-normal text-slate-400 lowercase">One point per line</span>
                                </label>
                                <textarea 
                                    rows="3" 
                                    value={formData.requirements} 
                                    onChange={e => setFormData({...formData, requirements: e.target.value})} 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-normal text-slate-800 transition-all font-mono" 
                                    placeholder="Minimum 2-3 years of relevant professional experience&#10;Bachelor's degree in Computer Science or equivalent&#10;Proficiency in React 18+ and Node.js"
                                />
                            </div>

                            {/* Benefits / What We Offer */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex justify-between">
                                    <span>What We Offer / Benefits</span>
                                    <span className="text-[11px] font-normal text-slate-400 lowercase">One point per line</span>
                                </label>
                                <textarea 
                                    rows="3" 
                                    value={formData.benefits} 
                                    onChange={e => setFormData({...formData, benefits: e.target.value})} 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-normal text-slate-800 transition-all font-mono" 
                                    placeholder="Opportunity to lead high-impact international initiatives&#10;Competitive compensation and growth-based incentives&#10;Flexible work culture and professional mentorship"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => { setShowModal(false); setEditingJob(null); }} 
                                    className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl text-sm transition-colors">
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 inline-flex items-center gap-2">
                                    {submitting && (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    {editingJob ? 'Save Changes' : 'Post Job'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobPostingsManager;
