import React, { useState, useEffect } from 'react';

const EmployeeProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [skillInput, setSkillInput] = useState('');

    const [form, setForm] = useState({
        phone: '',
        bio: '',
        skills: [],
        linkedIn: '',
        github: '',
        portfolio: '',
        location: '',
        emergencyContact: ''
    });

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/admin/hr/profile/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setProfile(data);
                    setForm({
                        phone: data.phone || '',
                        bio: data.bio || '',
                        skills: data.skills || [],
                        linkedIn: data.linkedIn || '',
                        github: data.github || '',
                        portfolio: data.portfolio || '',
                        location: data.location || '',
                        emergencyContact: data.emergencyContact || ''
                    });
                }
            } catch (err) {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSuccess('');
        setError('');
        try {
            const res = await fetch('/api/admin/hr/profile/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(data.employee);
                setSuccess('Profile saved successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Failed to save profile.');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !form.skills.includes(trimmed)) {
            setForm({ ...form, skills: [...form.skills, trimmed] });
        }
        setSkillInput('');
    };

    const removeSkill = (skill) => {
        setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-sm font-bold text-slate-500">Loading profile...</span>
            </div>
        </div>
    );

    const user = JSON.parse(localStorage.getItem('adminUser'));
    const initials = profile?.name?.charAt(0).toUpperCase() || '?';

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="relative bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none"></div>
                <div className="relative p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-24 h-24 shrink-0 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-4xl shadow-xl ring-4 ring-white">
                        {initials}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{profile?.name}</h1>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                            <span className="text-xs font-bold uppercase tracking-widest bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
                                {profile?.role}
                            </span>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                {profile?.employeeId}
                            </span>
                            {profile?.designation && (
                                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                    {profile.designation}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-400 font-medium mt-2">{profile?.email}</p>
                    </div>
                    <span className={`shrink-0 px-3 py-1 text-[11px] font-extrabold rounded-full uppercase tracking-widest border shadow-sm ${
                        profile?.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        profile?.status === 'Onboarding' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                        {profile?.status}
                    </span>
                </div>
            </div>

            {/* Success/Error Banners */}
            {success && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-700 font-bold text-sm animate-in slide-in-from-top-2 duration-300">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {success}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 font-bold text-sm">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {error}
                </div>
            )}

            {/* Profile Form */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/40 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        Edit Profile Details
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">All fields are optional. This information is visible to HR and CEO.</p>
                </div>

                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            </span>
                            <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 9876543210" className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all" />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Location</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            </span>
                            <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="City, Country (e.g. Mumbai, India)" className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all" />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Bio / About Me</label>
                        <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Write a short intro about yourself..." rows={3} className="block w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all resize-none" />
                    </div>

                    {/* Skills */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Skills</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                                placeholder="Type a skill and press Enter or Add..."
                                className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all"
                            />
                            <button onClick={addSkill} type="button" className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm transition-all shadow-sm">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.skills.map(skill => (
                                <span key={skill} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full text-xs font-bold">
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="text-indigo-400 hover:text-indigo-600 transition-colors ml-0.5">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                    </button>
                                </span>
                            ))}
                            {form.skills.length === 0 && <p className="text-slate-400 text-sm font-medium italic">No skills added yet.</p>}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="md:col-span-2 border-t border-slate-100 pt-4">
                        <h3 className="text-sm font-extrabold text-slate-700 mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                            Online Presence
                        </h3>
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">LinkedIn URL</label>
                        <input type="url" value={form.linkedIn} onChange={e => setForm({...form, linkedIn: e.target.value})} placeholder="https://linkedin.com/in/yourname" className="block w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all" />
                    </div>

                    {/* GitHub */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">GitHub URL</label>
                        <input type="url" value={form.github} onChange={e => setForm({...form, github: e.target.value})} placeholder="https://github.com/yourname" className="block w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all" />
                    </div>

                    {/* Portfolio */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Portfolio / Website</label>
                        <input type="url" value={form.portfolio} onChange={e => setForm({...form, portfolio: e.target.value})} placeholder="https://yoursite.dev" className="block w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all" />
                    </div>

                    {/* Emergency Contact */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Emergency Contact</label>
                        <input type="text" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} placeholder="Name & phone, e.g. Jane Doe +91 9000000000" className="block w-full px-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all" />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 sm:px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-indigo-500/30 flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? (
                            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> Saving...</>
                        ) : (
                            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Save Profile</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;
