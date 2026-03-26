import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const SignupPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', otp: '' });
    const [error, setError] = useState(null);
    const [timer, setTimer] = useState(60);
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setStep(2);
                setTimer(60);
            } else {
                setError(data.message);
            }
        } catch {
            setError('Something went wrong. Please try again.');
        }
    };

    const handleOtpSubmit = async (e) => {
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

    return (
        <div className="auth-container">

            {/* ── Left Brand Panel ── */}
            <div className="auth-left">

                <div className="auth-hero">
                    <div className="auth-hero-tag">
                        <span>●</span> Join Us
                    </div>
                    <h1>Start Your<br /><span>Journey</span> Today.</h1>
                    <p>
                        Create a free Klubnika Bytes account and get access to
                        our full suite of digital tools, team collaboration, and more.
                    </p>
                    <div className="auth-features">
                        <div className="auth-feature-item">
                            <span className="auth-feature-dot" />
                            Free to get started — no credit card needed
                        </div>
                        <div className="auth-feature-item">
                            <span className="auth-feature-dot" />
                            Email-verified secure accounts
                        </div>
                        <div className="auth-feature-item">
                            <span className="auth-feature-dot" />
                            Access projects and team tools instantly
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
                        <span className={`auth-step-dot ${step >= 1 ? 'active' : ''}`} />
                        <span className={`auth-step-dot ${step >= 2 ? 'active' : ''}`} />
                    </div>

                    <h2>{step === 1 ? 'Create Account' : 'Verify Email'}</h2>
                    <p className="auth-subtitle">
                        {step === 1
                            ? 'Fill in the details below to get started'
                            : `We've sent a 6-digit code to ${formData.email}`}
                    </p>

                    {error && <div className="auth-error">⚠ {error}</div>}

                    {/* Step 1 — Registration */}
                    {step === 1 && (
                        <form onSubmit={handleSignupSubmit} className="auth-form">
                            <div className="input-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Min 8 characters"
                                />
                            </div>
                            <div className="input-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                            <button type="submit" className="auth-btn">Create Account →</button>
                        </form>
                    )}

                    {/* Step 2 — OTP */}
                    {step === 2 && (
                        <form onSubmit={handleOtpSubmit} className="auth-form">
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
                            <button type="submit" className="auth-btn">Verify &amp; Continue →</button>
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

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Sign in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
