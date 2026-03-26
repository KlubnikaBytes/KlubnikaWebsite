import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ApplyPage.css';

const ApplyPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        resumeLink: '',
        workExperience: '',
        education: '',
        coverLetter: '',
        referredBy: '',
        legalTermsAccepted: false,
        acknowledgementAccepted: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to apply.');
            setLoading(false);
            return;
        }

        if (!formData.legalTermsAccepted || !formData.acknowledgementAccepted) {
            setError('You must accept the legal terms and acknowledge the declaration.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobId,
                    ...formData
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Application submitted successfully! Our HR team will review it shortly.');
                setFormData({
                    fullName: '', email: '', phone: '', address: '', resumeLink: '', 
                    workExperience: '', education: '', coverLetter: '', referredBy: '', 
                    legalTermsAccepted: false, acknowledgementAccepted: false
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setError(data.message || 'Error submitting application. Please try again.');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            setError('Server error. Please try again later.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="apply-page-wrapper">
            <div className="apply-header">
                <h1>Application for Job #{jobId}</h1>
                <p>Join the Klubnika Bytes team. Please fill out the comprehensive application form below with your accurate professional details.</p>
            </div>

            <div className="apply-form-container">
                {error && <div className="alert alert-error" style={{ margin: '20px 40px 0' }}>{error}</div>}
                {success && <div className="alert alert-success" style={{ margin: '20px 40px 0' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    
                    {/* Section 1: Personal Info */}
                    <div className="apply-form-section">
                        <h3 className="section-title">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            Personal Information
                        </h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Legal Name *</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 (555) 000-0000" />
                            </div>
                            <div className="form-group">
                                <label>Residential Address *</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="123 Tech Street, City, Country" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Professional Details */}
                    <div className="apply-form-section">
                        <h3 className="section-title">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            Professional Background
                        </h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Resume / CV Link *</label>
                                <input type="url" name="resumeLink" value={formData.resumeLink} onChange={handleChange} required placeholder="Google Drive, Dropbox, or Portfolio URL" />
                                <span className="helper-text">Ensure the link is publicly accessible.</span>
                            </div>
                            <div className="form-group full-width">
                                <label>Work Experience *</label>
                                <textarea name="workExperience" value={formData.workExperience} onChange={handleChange} required placeholder="Briefly detail your most recent roles, responsibilities, and key achievements..."></textarea>
                            </div>
                            <div className="form-group full-width">
                                <label>Education History *</label>
                                <textarea name="education" value={formData.education} onChange={handleChange} required placeholder="List your degrees, institutions, and graduation years..."></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Additional Info */}
                    <div className="apply-form-section">
                        <h3 className="section-title">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            Additional Documents
                        </h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Cover Letter (Optional)</label>
                                <textarea name="coverLetter" value={formData.coverLetter} onChange={handleChange} placeholder="Tell us why you're specifically interested in this role and Klubnika Bytes..."></textarea>
                            </div>
                            <div className="form-group full-width">
                                <label>Referred By (Optional)</label>
                                <input type="text" name="referredBy" value={formData.referredBy} onChange={handleChange} placeholder="If an employee referred you, enter their Name or Employee ID" />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Validation & Submit */}
                    <div className="apply-form-section">
                        <h3 className="section-title">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            Declarations
                        </h3>
                        
                        <div className="checkbox-group">
                            <input type="checkbox" id="legalTerms" name="legalTermsAccepted" checked={formData.legalTermsAccepted} onChange={handleChange} required />
                            <label htmlFor="legalTerms">
                                <strong>Legal Terms & Privacy Policy:</strong> I agree to the <a href="/privacy-policy" target="_blank" style={{color: '#6366f1'}}>Privacy Policy</a> and consent to the processing of my personal data for recruitment purposes by Klubnika Bytes.
                            </label>
                        </div>
                        
                        <div className="checkbox-group">
                            <input type="checkbox" id="acknowledgement" name="acknowledgementAccepted" checked={formData.acknowledgementAccepted} onChange={handleChange} required />
                            <label htmlFor="acknowledgement">
                                <strong>Acknowledgement:</strong> I certify that all information provided in this application is true, complete, and accurate to the best of my knowledge. I understand that any false statements may lead to disqualification or termination of employment.
                            </label>
                        </div>

                        <div className="submit-container">
                            <button type="button" className="btn-cancel" onClick={() => navigate('/careers')}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? 'Submitting Application...' : 'Submit Professional Application'}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ApplyPage;
