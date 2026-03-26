import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('INITIAL'); // INITIAL, OTP_REQUIRED, SETUP_PASSWORD
    
    // Form fields
    const [employeeId, setEmployeeId] = useState('');
    const [passwordOrToken, setPasswordOrToken] = useState(''); // Used for standard password OR initial token
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    // Auth context (set during transitions)
    const [resetToken, setResetToken] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [ceoEmail, setCeoEmail] = useState('');

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Determine if input is a 32-char token (hex) or standard password roughly
            // For better UX, we could have a checkbox, but let's assume if it looks like a long hex, or we just try token login first
            const isTokenLogin = passwordOrToken.length > 20 && !passwordOrToken.includes(' ');

            const response = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    employeeId, 
                    password: passwordOrToken,
                    isTokenLogin,
                    token: isTokenLogin ? passwordOrToken : undefined
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.step === 'OTP_REQUIRED') {
                setCeoEmail(data.email);
                setStep('OTP_REQUIRED');
                setSuccessMsg('OTP sent to your email.');
            } else if (data.step === 'SETUP_PASSWORD') {
                setResetToken(data.resetToken);
                setTokenId(data.tokenId);
                setStep('SETUP_PASSWORD');
                setSuccessMsg('Token verified. Please set your new password.');
            } else if (data.step === 'LOGIN_SUCCESS') {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                navigate('/admin/dashboard'); // Layout handles role redirect
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId, otpCode })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'OTP verification failed');

            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            navigate('/admin/dashboard');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSetup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/auth/setup-password', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resetToken}`
                },
                body: JSON.stringify({ newPassword, tokenId })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Password setup failed');

            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            navigate('/admin/dashboard');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex font-sans overflow-hidden">
            {/* Split Screen Design - Left Side (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-slate-800 relative flex-col justify-center items-center overflow-hidden">
                {/* Abstract animated background shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-slate-900/40 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 mix-blend-overlay"></div>
                
                <div className="relative z-10 text-center px-12 max-w-2xl">
                    <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl mx-auto mb-8 shadow-2xl flex items-center justify-center rotate-[10deg] hover:rotate-0 transition-all duration-500">
                        <span className="text-5xl font-extrabold text-white">K</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-white tracking-tight mb-6">
                        Klubnika <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Bytes</span>
                    </h1>
                    <p className="text-lg text-slate-400 font-medium leading-relaxed">
                        Enterprise operating system orchestrating human resources, high-level analytics, and content dynamics.
                    </p>
                </div>
                
                {/* Glassmorphic decorative card */}
                <div className="absolute right-12 bottom-12 w-64 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl skew-x-[-5deg] rotate-[-5deg] hover:rotate-0 hover:skew-x-0 transition-transform duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Systems Online</p>
                            <p className="text-xs text-slate-400">All services operational</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side (Full width on mobile) - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 backdrop-blur-2xl bg-white/5 lg:bg-transparent">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    
                    {/* Mobile Branding Header */}
                    <div className="lg:hidden text-center mb-10 mt-6">
                        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 shadow-lg flex items-center justify-center">
                            <span className="text-3xl font-extrabold text-white">K</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Klubnika Bytes</h2>
                        <p className="text-sm text-slate-400">Admin Portal Log In</p>
                    </div>

                    {/* Desktop Headers */}
                    <div className="hidden lg:block mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-slate-400">Please sign in to access your dashboard.</p>
                    </div>

                    <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700/50">
                        
                        {error && (
                            <div className="mb-6 bg-rose-500/10 border border-rose-500/50 text-rose-300 px-4 py-3 rounded-xl flex items-start gap-3 animate-in fade-in">
                                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <div>
                                    <h4 className="text-sm font-bold">Authentication Error</h4>
                                    <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{error}</p>
                                </div>
                            </div>
                        )}

                        {successMsg && (
                            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl flex items-start gap-3 animate-in fade-in">
                                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <div>
                                    <h4 className="text-sm font-bold">Success</h4>
                                    <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{successMsg}</p>
                                </div>
                            </div>
                        )}

                        {step === 'INITIAL' && (
                            <form className="space-y-5" onSubmit={handleInitialSubmit}>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Employee ID</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            required 
                                            value={employeeId}
                                            onChange={(e) => setEmployeeId(e.target.value)}
                                            placeholder="e.g. KB001"
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-700/60 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Access Key</label>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                        </div>
                                        <input 
                                            type="password" 
                                            required 
                                            value={passwordOrToken}
                                            onChange={(e) => setPasswordOrToken(e.target.value)}
                                            placeholder="Password or Token (Leave blank if CEO)"
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-700/60 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium" 
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium">CEOs bypass local password entry and use OTP.</p>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full relative mt-8 flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 transition-all shadow-lg hover:shadow-indigo-500/25 group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Sign In to Portal
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {step === 'OTP_REQUIRED' && (
                            <form className="space-y-6 animate-in fade-in" onSubmit={handleOtpSubmit}>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    </div>
                                    <h3 className="text-white font-bold text-lg">2-Step Verification</h3>
                                    <p className="text-sm text-slate-400 mt-1">Check <span className="text-indigo-400 font-medium">{ceoEmail}</span> for your securely dispatched code.</p>
                                </div>
                                <div className="space-y-1.5">
                                    <input 
                                        type="text" 
                                        required 
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        placeholder="000000"
                                        className="block w-full text-center tracking-[1em] text-2xl py-4 bg-slate-900 border border-slate-700/60 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono font-bold" 
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => { setStep('INITIAL'); setError(''); setSuccessMsg(''); setPasswordOrToken('');}}
                                        className="w-1/3 py-3.5 px-4 rounded-xl text-sm font-bold text-slate-300 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-2/3 flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                                    >
                                        {loading ? 'Verifying...' : 'Authorize Login'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 'SETUP_PASSWORD' && (
                            <form className="space-y-5 animate-in fade-in" onSubmit={handlePasswordSetup}>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                                        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                    </div>
                                    <h3 className="text-white font-bold text-lg">Set Administrator Password</h3>
                                    <p className="text-sm text-slate-400 mt-1">Secure your account to replace your onboarding token.</p>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full px-4 py-3.5 bg-slate-900 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full px-4 py-3.5 bg-slate-900 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all" 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full mt-6 py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Complete Setup & Enter Portal'}
                                </button>
                            </form>
                        )}
                    </div>
                    
                    <div className="text-center">
                        <p className="text-xs font-medium text-slate-500">&copy; {new Date().getFullYear()} Klubnika Bytes Inc. Internal System.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
