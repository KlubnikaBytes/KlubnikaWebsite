import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ email: '', password: '', otp: '', newPassword: '', confirmPassword: '' });
    const [error, setError] = useState(null);
    const [timer, setTimer] = useState(60);
    const [adminContext, setAdminContext] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if ((step === 2 || step === 3) && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const isToken = formData.password.length === 32 && !formData.password.includes(' ');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password, isTokenLogin: isToken })
            });
            const data = await res.json();
            if (data.status === 'success') {
                if (data.step === 'PUBLIC_OTP_REQUIRED') {
                    setStep(2); setTimer(60);
                } else if (data.step === 'OTP_REQUIRED') {
                    setStep(3); setTimer(60);
                    setAdminContext({ email: data.email, employeeId: data.employeeId });
                } else if (data.step === 'SETUP_PASSWORD') {
                    setStep(4);
                    setAdminContext({ resetToken: data.resetToken, tokenId: data.tokenId });
                } else if (data.step === 'REQUIRE_PASSWORD_CHANGE') {
                    setStep(5);
                    setAdminContext({ resetToken: data.resetToken, email: data.user?.email });
                } else if (data.step === 'LOGIN_SUCCESS') {
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminUser', JSON.stringify(data.user));
                    navigate('/admin');
                    window.location.reload();
                }
            } else {
                setError(data.message);
            }
        } catch {
            setError('Something went wrong. Please try again.');
        }
    };

    const handlePublicOtpSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: formData.otp })
            });
            const data = await res.json();
            if (data.status === 'success') {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
                window.location.reload();
            } else {
                setError(data.message);
            }
        } catch {
            setError('Something went wrong verifying the OTP.');
        }
    };

    const handleAdminCeoOtpSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: adminContext.employeeId, otpCode: formData.otp })
            });
            const data = await res.json();
            if (data.step === 'LOGIN_SUCCESS') {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                navigate('/admin');
                window.location.reload();
            } else {
                setError(data.message);
            }
        } catch {
            setError('Something went wrong verifying the CEO OTP.');
        }
    };

    const handleAdminSetupPassword = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/auth/setup-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminContext.resetToken}`
                },
                body: JSON.stringify({ newPassword: formData.newPassword, tokenId: adminContext.tokenId })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                navigate('/admin');
                window.location.reload();
            } else {
                setError(data.message);
            }
        } catch {
            setError('Something went wrong setting up your password.');
        }
    };

    const handleChangeInitialPassword = async (e) => {
        e.preventDefault();
        setError(null);
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/auth/change-initial-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminContext.resetToken}`
                },
                body: JSON.stringify({ newPassword: formData.newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                navigate('/admin');
                window.location.reload();
            } else {
                setError(data.message);
            }
        } catch {
            setError('Something went wrong changing your password.');
        }
    };

    const handleForgotPasswordReq = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: formData.email }) // formData.email is being used for employeeId/email input
            });
            const data = await res.json();
            if (res.ok) {
                setAdminContext({ email: data.email, employeeId: data.employeeId });
                setStep(7); // FORGOT_PASSWORD_OTP
            } else {
                setError(data.message);
            }
        } catch {
            setError('Something went wrong requesting a password reset.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: adminContext.employeeId, otpCode: formData.otp, newPassword: formData.newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setStep(1);
                setFormData({ ...formData, password: '', otp: '', newPassword: '', confirmPassword: '' });
                setError('Password has been reset successfully. You can now log in.'); // using error state to temporarily show success, but ideally should use a success state
            } else {
                setError(data.message);
            }
        } catch {
            setError('Something went wrong resetting your password.');
        }
    };

    const handleResendOtp = async () => {
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setTimer(60);
            } else {
                setError(data.message);
            }
        } catch {
            setError('Something went wrong resending the OTP.');
        }
    };

    const stepTitles = {
        1: 'Sign In',
        2: 'Verify Identity',
        3: 'CEO Verification',
        4: 'Secure Account',
        5: 'Update Required',
        6: 'Password Recovery',
        7: 'Reset Password'
    };

    const stepSubtitles = {
        1: 'Welcome back to Klubnika Bytes',
        2: 'Enter the one-time code sent to your email',
        3: 'Enter the executive OTP sent to your email',
        4: 'Set a new password to protect your account',
        5: 'Please change your temporary initial password',
        6: 'Enter your Employee ID or Email to receive an OTP',
        7: 'Enter the OTP and your new password'
    };

    return (
        <div className="auth-container">

            {/* ── Left Brand Panel ── */}
            <div className="auth-left">

                <div className="auth-hero">
                    <div className="auth-hero-tag">
                        <span>●</span> Member Portal
                    </div>
                    <h1>Build the<br /><span>Future</span> with Us.</h1>
                    <p>
                        Access your Klubnika Bytes account to manage projects,
                        collaborate with teams, and stay on top of everything that matters.
                    </p>
                    <div className="auth-features">
                        <div className="auth-feature-item">
                            <span className="auth-feature-dot" />
                            Secure, role-based access control
                        </div>
                        <div className="auth-feature-item">
                            <span className="auth-feature-dot" />
                            Two-factor OTP authentication
                        </div>
                        <div className="auth-feature-item">
                            <span className="auth-feature-dot" />
                            Real-time employee dashboard
                        </div>
                    </div>
                </div>

                <div className="auth-left-footer">
                    © {new Date().getFullYear()} Klubnika Bytes. All rights reserved.
                </div>
            </div>

            {/* ── Right Form Panel ── */}
            <div className="auth-right">
                <div className="auth-form-wrapper">

                    {/* Step progress bar */}
                    <div className="auth-steps">
                        {[1, 2, 3, 4].map((s) => (
                            <span key={s} className={`auth-step-dot ${step >= s ? 'active' : ''}`} />
                        ))}
                    </div>

                    <h2>{stepTitles[step]}</h2>
                    <p className="auth-subtitle">{stepSubtitles[step]}</p>

                    {error && <div className="auth-error">⚠ {error}</div>}

                    {/* Step 1 — Login */}
                    {step === 1 && (
                        <form onSubmit={handleLoginSubmit} className="auth-form">
                            <div className="input-group">
                                <label>Email or Employee ID</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com or KB_XXX"
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Password or Onboarding Token</span>
                                    <span style={{ cursor: 'pointer', color: '#4f46e5', fontSize: '12px' }} onClick={() => { setStep(6); setError(null); }}>Forgot Password?</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="•••••••• or your token"
                                />
                            </div>
                            <button type="submit" className="auth-btn">Sign In →</button>
                        </form>
                    )}

                    {/* Step 2 — Public OTP */}
                    {step === 2 && (
                        <form onSubmit={handlePublicOtpSubmit} className="auth-form">
                            <div className="input-group">
                                <label>6-digit OTP Code</label>
                                <input
                                    type="text"
                                    name="otp"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter code"
                                    maxLength="6"
                                />
                            </div>
                            <button type="submit" className="auth-btn">Verify &amp; Log In →</button>
                            <div className="otp-timer">
                                {timer > 0 ? (
                                    <span>Resend code in <strong>{timer}s</strong></span>
                                ) : (
                                    <button type="button" className="otp-resend-btn" onClick={handleResendOtp}>
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* Step 3 — CEO OTP */}
                    {step === 3 && (
                        <form onSubmit={handleAdminCeoOtpSubmit} className="auth-form">
                            <div className="input-group">
                                <label>Executive OTP Code</label>
                                <input
                                    type="text"
                                    name="otp"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter code"
                                    maxLength="6"
                                />
                            </div>
                            <button type="submit" className="auth-btn">Verify Executive Identity →</button>
                        </form>
                    )}

                    {/* Step 4 — Setup password */}
                    {step === 4 && (
                        <form onSubmit={handleAdminSetupPassword} className="auth-form">
                            <div className="input-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Min 8 characters"
                                    minLength="8"
                                />
                            </div>
                            <button type="submit" className="auth-btn">Save &amp; Access Portal →</button>
                        </form>
                    )}

                    {/* Step 5 — Require Password Change */}
                    {step === 5 && (
                        <form onSubmit={handleChangeInitialPassword} className="auth-form">
                            <div className="input-group">
                                <label>New Password</label>
                                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required placeholder="Min 8 characters" minLength="8" />
                            </div>
                            <div className="input-group">
                                <label>Confirm New Password</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Re-enter password" />
                            </div>
                            <button type="submit" className="auth-btn">Update Password &amp; Enter Portal →</button>
                        </form>
                    )}

                    {/* Step 6 — Forgot Password Email */}
                    {step === 6 && (
                        <form onSubmit={handleForgotPasswordReq} className="auth-form">
                            <div className="input-group">
                                <label>Email or Employee ID</label>
                                <input type="text" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com or KB_XXX" />
                            </div>
                            <button type="submit" className="auth-btn">Send Recovery OTP →</button>
                            <button type="button" onClick={() => { setStep(1); setError(null); }} className="auth-btn" style={{ marginTop: '10px', background: '#334155' }}>Cancel</button>
                        </form>
                    )}

                    {/* Step 7 — Reset Password OTP */}
                    {step === 7 && (
                        <form onSubmit={handleResetPassword} className="auth-form">
                            <div className="input-group">
                                <label>6-digit OTP Code (sent to {adminContext?.email})</label>
                                <input type="text" name="otp" value={formData.otp} onChange={handleChange} required placeholder="Enter code" maxLength="6" />
                            </div>
                            <div className="input-group">
                                <label>New Password</label>
                                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required placeholder="Min 8 characters" minLength="8" />
                            </div>
                            <div className="input-group">
                                <label>Confirm New Password</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Re-enter password" />
                            </div>
                            <button type="submit" className="auth-btn">Reset Password →</button>
                            <button type="button" onClick={() => { setStep(6); setError(null); }} className="auth-btn" style={{ marginTop: '10px', background: '#334155' }}>Back</button>
                        </form>
                    )}

                    {step === 1 && (
                        <div className="auth-footer">
                            <p>Don't have an account? <Link to="/signup">Create one</Link></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
