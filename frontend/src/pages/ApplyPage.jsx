import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiUrl } from '../config/api';
import './ApplyPage.css';

const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' }
];

const ApplyPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);

  const [countryCode, setCountryCode] = useState('+91');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    workExperience: '',
    resumeLink: '',
    coverLetter: '',
    referredBy: '',
    legalTermsAccepted: false,
    acknowledgementAccepted: false
  });

  const [educations, setEducations] = useState([
    { degree: '', institution: '', passingYear: '', score: '' }
  ]);

  const [workExperiences, setWorkExperiences] = useState([
    {
      company: '',
      role: '',
      employmentType: 'Full-time',
      startDate: '',
      endDate: '',
      isCurrent: false,
      yearsExp: '',
      summary: ''
    }
  ]);

  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch Job details by ID and prefill user info if logged in
  useEffect(() => {
    // 1. Fetch Job information
    const fetchJob = async () => {
      try {
        if (!jobId) {
          setJobLoading(false);
          return;
        }
        const res = await fetch(apiUrl(`/api/jobs/${jobId}`));
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        }
      } catch (err) {
        console.warn('Could not fetch specific job details:', err);
      } finally {
        setJobLoading(false);
      }
    };
    fetchJob();

    // 2. Pre-fill user if logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        const u = JSON.parse(storedUser);
        setFormData(prev => ({
          ...prev,
          fullName: u.name || prev.fullName,
          email: u.email || prev.email,
          phone: u.phone || prev.phone
        }));
      } catch {
        // Ignore parse error
      }
    }
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setEducations(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addEducation = () => {
    setEducations(prev => [
      ...prev,
      { degree: '', institution: '', passingYear: '', score: '' }
    ]);
  };

  const removeEducation = (index) => {
    if (educations.length <= 1) return;
    setEducations(prev => prev.filter((_, i) => i !== index));
  };

  const handleWorkExpChange = (index, field, value) => {
    setWorkExperiences(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addWorkExperience = () => {
    setWorkExperiences(prev => [
      ...prev,
      {
        company: '',
        role: '',
        employmentType: 'Full-time',
        startDate: '',
        endDate: '',
        isCurrent: false,
        yearsExp: '',
        summary: ''
      }
    ]);
  };

  const removeWorkExperience = (index) => {
    if (workExperiences.length <= 1) return;
    setWorkExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setFileError('');
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Check size limit: 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    // Check file extension
    const allowed = /\.(pdf|doc|docx|txt)$/i;
    if (!allowed.test(file.name)) {
      setFileError('Invalid file type. Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    setResumeFile(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Must provide either a file or a link
    if (!resumeFile && (!formData.resumeLink || !formData.resumeLink.trim())) {
      setError('Please upload your resume document or provide an active portfolio/resume link.');
      setLoading(false);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    if (!formData.legalTermsAccepted || !formData.acknowledgementAccepted) {
      setError('You must accept the legal terms and acknowledge the professional declaration.');
      setLoading(false);
      return;
    }

    try {
      const formattedEducations = educations
        .filter(ed => ed.degree.trim() || ed.institution.trim())
        .map(ed => `${ed.degree.trim()} - ${ed.institution.trim()} (${ed.passingYear.trim() || 'N/A'})${ed.score ? ` [GPA/Score: ${ed.score.trim()}]` : ''}`)
        .join(' | ');

      const formattedWorkExperiences = workExperiences
        .filter(w => w.company.trim() || w.role.trim() || w.summary.trim())
        .map(w => `${w.role.trim()} at ${w.company.trim()} (${w.employmentType}, ${w.startDate || 'N/A'} to ${w.isCurrent ? 'Present' : (w.endDate || 'N/A')})${w.yearsExp ? ` [Exp: ${w.yearsExp.trim()}]` : ''} - Summary: ${w.summary.trim()}`)
        .join(' \n---\n ');

      const fullPhone = `${countryCode} ${formData.phone}`.trim();

      const submitData = new FormData();
      submitData.append('jobId', jobId || 'GENERAL');
      submitData.append('jobTitle', job?.title || 'Open Position');
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('phone', fullPhone);
      submitData.append('address', formData.address);
      submitData.append('workExperience', formattedWorkExperiences || formData.workExperience || 'Not specified');
      submitData.append('education', formattedEducations || 'Not specified');
      submitData.append('coverLetter', formData.coverLetter || '');
      submitData.append('resumeLink', formData.resumeLink || '');
      submitData.append('referredBy', formData.referredBy || '');
      submitData.append('legalTermsAccepted', formData.legalTermsAccepted);
      submitData.append('acknowledgementAccepted', formData.acknowledgementAccepted);

      if (resumeFile) {
        submitData.append('resumeFile', resumeFile);
      }

      const headers = {};
      const token = localStorage.getItem('token');
      if (token && token !== 'null' && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let response = await fetch(apiUrl('/api/applications'), {
        method: 'POST',
        headers,
        body: submitData
      });

      let data = await response.json();

      // If backend rejects due to a stale/invalid token in localStorage, auto-retry cleanly without headers
      if (!response.ok && (response.status === 401 || data.message?.toLowerCase().includes('token'))) {
        localStorage.removeItem('token');
        response = await fetch(apiUrl('/api/applications'), {
          method: 'POST',
          body: submitData
        });
        data = await response.json();
      }

      if (response.ok) {
        setSuccess('Application submitted successfully! Your resume and qualifications have been dispatched to our talent acquisition team. A confirmation email has also been sent to your email address.');
        setFormData({
          fullName: '', email: '', phone: '', address: '', resumeLink: '',
          workExperience: '', education: '', coverLetter: '', referredBy: '',
          legalTermsAccepted: false, acknowledgementAccepted: false
        });
        setResumeFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(data.message || 'Error submitting application. Please check your entries and try again.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Connection error submitting application. Please verify your internet connection or try again later.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const displayJobTitle = job?.title || 'Open Position';
  const displayReqId = jobId ? jobId.substring(0, 8).toUpperCase() : 'GENERAL';

  return (
    <div className="kb-apply-page">
      {/* Cover Hero Banner */}
      <section className="kb-apply-hero">
        <div className="container kb-apply-hero-content">
          <span className="kb-eyebrow-dark">TALENT ACQUISITION</span>
          <h1 className="kb-apply-hero-title">Official Job Application</h1>
          <div className="kb-hero-rule" />
          <p className="kb-apply-hero-lead">
            Submit your resume and credentials for <strong>{displayJobTitle}</strong> (Requisition #{displayReqId}).
          </p>
        </div>
      </section>

      {/* Main Content Form Section */}
      <section className="kb-apply-content-section">
        <div className="container kb-apply-container">
          
          {/* Target Position Info Banner */}
          <div className="kb-apply-job-badge-card">
            <div className="kb-apply-badge-left">
              <span className="kb-job-id-tag">REQUISITION #{displayReqId}</span>
              <h2 className="kb-apply-target-title">{displayJobTitle}</h2>
              {job?.description && (
                <p className="kb-apply-target-desc">{job.description}</p>
              )}
            </div>
            {job && (
              <div className="kb-apply-badge-right">
                {job.type && (
                  <span className="kb-job-meta-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {job.type}
                  </span>
                )}
                {job.location && (
                  <span className="kb-job-meta-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {job.location}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="kb-apply-form-card">
            {error && (
              <div className="kb-alert kb-alert-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="kb-alert kb-alert-success">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <div>
                  <strong>Application Submitted Successfully!</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.92rem' }}>{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Section 1: Candidate Personal Details */}
              <div className="kb-form-block">
                <h3 className="kb-block-title">
                  <span className="kb-block-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  1. Personal & Contact Information
                </h3>
                <div className="kb-form-grid">
                  <div className="kb-input-group">
                    <label>Full Legal Name <span className="kb-req">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="kb-input-group">
                    <label>Email Address <span className="kb-req">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="kb-input-group">
                    <label>Phone Number <span className="kb-req">*</span></label>
                    <div className="kb-apply-phone-composite">
                      <select
                        className="kb-apply-code-select"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        aria-label="Country Calling Code"
                      >
                        {countryCodes.map((item, idx) => (
                          <option key={idx} value={item.code}>
                            {item.flag} {item.code} ({item.country})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={15}
                        value={formData.phone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
                          setFormData(prev => ({ ...prev, phone: digitsOnly }));
                        }}
                        required
                        placeholder="9800000000 (digits only)"
                        className="kb-apply-phone-input"
                      />
                    </div>
                  </div>
                  <div className="kb-input-group">
                    <label>Current City / Location <span className="kb-req">*</span></label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Kolkata, West Bengal"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Professional Background & Education */}
              <div className="kb-form-block">
                <h3 className="kb-block-title">
                  <span className="kb-block-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </span>
                  2. Qualifications &amp; Experience
                </h3>

                {/* Multiple Academic Qualifications List */}
                <div className="kb-education-list-wrapper">
                  <label className="kb-sub-section-label">
                    Education &amp; Academic Degree(s) <span className="kb-req">*</span>
                  </label>
                  <p className="kb-education-hint">
                    Add your educational degrees in reverse-chronological order (highest degree first). You can add multiple qualifications.
                  </p>

                  {educations.map((ed, idx) => (
                    <div key={idx} className="kb-education-card-row">
                      <div className="kb-ed-card-header">
                        <span className="kb-ed-card-badge">Qualification #{idx + 1}</span>
                        {educations.length > 1 && (
                          <button
                            type="button"
                            className="kb-btn-remove-ed"
                            onClick={() => removeEducation(idx)}
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      <div className="kb-ed-grid">
                        <div className="kb-input-group">
                          <label>Degree / Qualification Title <span className="kb-req">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g. B.Tech in Computer Science, M.Sc, Diploma"
                            value={ed.degree}
                            onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                            required
                          />
                        </div>

                        <div className="kb-input-group">
                          <label>University / College / School <span className="kb-req">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g. MAKAUT, IIT Kharagpur, Calcutta University"
                            value={ed.institution}
                            onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                            required
                          />
                        </div>

                        <div className="kb-input-group">
                          <label>Year of Graduation <span className="kb-req">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g. 2024 or Pursuing (Final Year)"
                            value={ed.passingYear}
                            onChange={(e) => handleEducationChange(idx, 'passingYear', e.target.value)}
                            required
                          />
                        </div>

                        <div className="kb-input-group">
                          <label>GPA / Percentage / Division</label>
                          <input
                            type="text"
                            placeholder="e.g. 8.6 CGPA or 82%"
                            value={ed.score}
                            onChange={(e) => handleEducationChange(idx, 'score', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="kb-add-education-action">
                    <button
                      type="button"
                      className="kb-btn-add-education"
                      onClick={addEducation}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span>+ Add Another Academic Qualification</span>
                    </button>
                  </div>
                </div>

                {/* Multiple Work Experience Records */}
                <div className="kb-work-exp-list-wrapper" style={{ marginTop: '2rem' }}>
                  <label className="kb-sub-section-label">
                    Professional Work Experience <span className="kb-req">*</span>
                  </label>
                  <p className="kb-education-hint">
                    Add your past or current roles, companies, dates of employment, and responsibility summaries. You can add multiple organizations.
                  </p>

                  {workExperiences.map((w, idx) => (
                    <div key={idx} className="kb-work-exp-card-row">
                      <div className="kb-ed-card-header">
                        <span className="kb-ed-card-badge">Experience #{idx + 1}</span>
                        {workExperiences.length > 1 && (
                          <button
                            type="button"
                            className="kb-btn-remove-ed"
                            onClick={() => removeWorkExperience(idx)}
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      <div className="kb-ed-grid">
                        <div className="kb-input-group">
                          <label>Company / Organization Name <span className="kb-req">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g. Infosys, TCS, Klubinika Bytes, Startup"
                            value={w.company}
                            onChange={(e) => handleWorkExpChange(idx, 'company', e.target.value)}
                            required
                          />
                        </div>

                        <div className="kb-input-group">
                          <label>Job Title / Designation <span className="kb-req">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g. Senior Frontend Engineer, DevOps Specialist"
                            value={w.role}
                            onChange={(e) => handleWorkExpChange(idx, 'role', e.target.value)}
                            required
                          />
                        </div>

                        <div className="kb-input-group">
                          <label>Employment Type <span className="kb-req">*</span></label>
                          <select
                            value={w.employmentType}
                            onChange={(e) => handleWorkExpChange(idx, 'employmentType', e.target.value)}
                            className="kb-apply-select"
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract / Freelance">Contract / Freelance</option>
                            <option value="Internship">Internship</option>
                          </select>
                        </div>

                        <div className="kb-input-group">
                          <label>Total Duration / Years of Experience</label>
                          <input
                            type="text"
                            placeholder="e.g. 2 Years 4 Months (or 6 Months)"
                            value={w.yearsExp}
                            onChange={(e) => handleWorkExpChange(idx, 'yearsExp', e.target.value)}
                          />
                        </div>

                        <div className="kb-input-group">
                          <label>Start Date (From) <span className="kb-req">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g. June 2022"
                            value={w.startDate}
                            onChange={(e) => handleWorkExpChange(idx, 'startDate', e.target.value)}
                            required
                          />
                        </div>

                        <div className="kb-input-group">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>End Date (To) {!w.isCurrent && <span className="kb-req">*</span>}</label>
                            <label style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', margin: 0 }}>
                              <input
                                type="checkbox"
                                checked={w.isCurrent}
                                onChange={(e) => handleWorkExpChange(idx, 'isCurrent', e.target.checked)}
                              />
                              Present
                            </label>
                          </div>
                          <input
                            type="text"
                            placeholder={w.isCurrent ? 'Present (Currently working here)' : 'e.g. August 2024'}
                            value={w.isCurrent ? 'Present' : w.endDate}
                            disabled={w.isCurrent}
                            onChange={(e) => handleWorkExpChange(idx, 'endDate', e.target.value)}
                            required={!w.isCurrent}
                          />
                        </div>

                        <div className="kb-input-group kb-full-span">
                          <label>Role Summary &amp; Key Technical Contributions <span className="kb-req">*</span></label>
                          <textarea
                            rows="3"
                            placeholder="Describe your tech stack, system architectures handled, key deliverables and metrics achieved..."
                            value={w.summary}
                            onChange={(e) => handleWorkExpChange(idx, 'summary', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="kb-add-education-action">
                    <button
                      type="button"
                      className="kb-btn-add-education"
                      onClick={addWorkExperience}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span>+ Add Another Work Experience</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Resume Document & Portfolio */}
              <div className="kb-form-block">
                <h3 className="kb-block-title">
                  <span className="kb-block-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </span>
                  3. Resume Document <span className="kb-req">*</span>
                </h3>

                {/* File Upload Zone */}
                <div className="kb-resume-upload-wrapper">
                  {!resumeFile ? (
                    <label className="kb-file-dropzone" htmlFor="resumeFileInput">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="kb-upload-icon">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <div className="kb-dropzone-text">
                        <strong>Click to browse or upload your Resume file</strong>
                        <span>Accepted formats: PDF, DOC, DOCX (Max size: 10MB)</span>
                      </div>
                      <input
                        type="file"
                        id="resumeFileInput"
                        ref={fileInputRef}
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  ) : (
                    <div className="kb-file-selected-card">
                      <div className="kb-file-selected-left">
                        <div className="kb-file-icon-box">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div className="kb-file-info">
                          <span className="kb-file-name">{resumeFile.name}</span>
                          <span className="kb-file-size">{(resumeFile.size / 1024).toFixed(1)} KB • Ready for submission</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="kb-file-remove-btn"
                        onClick={handleRemoveFile}
                        title="Remove file"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  )}

                  {fileError && <div className="kb-field-error">{fileError}</div>}
                </div>

                {/* Alternative / Supplemental Link */}
                <div className="kb-input-group kb-full-span" style={{ marginTop: '1.25rem' }}>
                  <label>Portfolio, LinkedIn, or Google Drive Link (Optional)</label>
                  <input
                    type="url"
                    name="resumeLink"
                    value={formData.resumeLink}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/... or GitHub / Drive link"
                  />
                  <span className="kb-input-hint">If providing a Drive link, ensure viewing permissions are enabled for reviewers.</span>
                </div>
              </div>

              {/* Section 4: Supplementary Information */}
              <div className="kb-form-block">
                <h3 className="kb-block-title">
                  <span className="kb-block-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                  4. Note to Hiring Manager (Optional)
                </h3>
                <div className="kb-form-grid">
                  <div className="kb-input-group kb-full-span">
                    <label>Cover Letter / Additional Notes</label>
                    <textarea
                      name="coverLetter"
                      rows="3"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      placeholder="Introduce yourself, highlight notable projects, or share any context relevant to your application..."
                    />
                  </div>
                  <div className="kb-input-group kb-full-span">
                    <label>Internal Referral (Optional)</label>
                    <input
                      type="text"
                      name="referredBy"
                      value={formData.referredBy}
                      onChange={handleChange}
                      placeholder="Name or Employee ID of referring team member"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Professional Declaration & Submit */}
              <div className="kb-form-block kb-form-declarations">
                <h3 className="kb-block-title">
                  <span className="kb-block-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </span>
                  5. Professional Declaration & Consent
                </h3>

                <div className="kb-checkbox-card">
                  <label className="kb-check-label">
                    <input
                      type="checkbox"
                      id="legalTerms"
                      name="legalTermsAccepted"
                      checked={formData.legalTermsAccepted}
                      onChange={handleChange}
                      required
                      className="kb-checkbox"
                    />
                    <span>
                      <strong>Legal Terms & Privacy Policy:</strong> I consent to the collection and processing of my application data under the Klubnika Bytes <Link to="/privacy-policy" target="_blank" className="kb-inline-link">Privacy Policy</Link> for recruitment and verification purposes.
                    </span>
                  </label>
                </div>

                <div className="kb-checkbox-card">
                  <label className="kb-check-label">
                    <input
                      type="checkbox"
                      id="acknowledgement"
                      name="acknowledgementAccepted"
                      checked={formData.acknowledgementAccepted}
                      onChange={handleChange}
                      required
                      className="kb-checkbox"
                    />
                    <span>
                      <strong>Accuracy Declaration:</strong> I certify that all information submitted in this application and resume is accurate and verifiable. I understand that misrepresentation constitutes grounds for disqualification.
                    </span>
                  </label>
                </div>

                <div className="kb-form-actions-bar">
                  <button
                    type="button"
                    className="kb-btn-secondary-light"
                    onClick={() => navigate('/careers')}
                  >
                    ← Back to Careers
                  </button>
                  <button
                    type="submit"
                    className="kb-btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Submitting Application...' : 'Submit Application →'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplyPage;
