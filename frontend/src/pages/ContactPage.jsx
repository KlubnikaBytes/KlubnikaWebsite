import React, { useState } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import PresenceMap from '../components/common/PresenceMap';
import './ContactPage.css';

const countryCodes = [
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
  { code: '+64', country: 'NZ', flag: '🇳🇿' },
  { code: '+353', country: 'IE', flag: '🇮🇪' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+974', country: 'QA', flag: '🇶🇦' }
];

const subjectOptions = [
  'Enterprise Software & Application Development',
  'Cloud, Data & Enterprise Modernization',
  'AI, Automation & Agentic Solutions',
  'Workforce Solutions (2.5% Payroll Club) & GCC Advisory',
  '24/7 Managed IT & Infrastructure Operations',
  'SOW Solutions (T&M, Outcome, Milestone, Fixed Price, Hybrid)',
  'GCC BOT (Build, Operate, Transfer) & Dedicated Model',
  'Executive Search & Leadership Hiring',
  'Technical Partnership or Vendor Collaboration',
  'Other'
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+91',
    phoneNumber: '',
    subject: 'Enterprise Software & Application Development',
    customSubject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    // Strictly enforce digits only
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, phoneNumber: digitsOnly }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Dispatching official message to executive team...');
    setStatusType('sending');

    const effectiveSubject =
      formData.subject === 'Other' && formData.customSubject.trim()
        ? `[Custom: ${formData.customSubject.trim()}]`
        : formData.subject;

    const fullPhone = `${formData.countryCode} ${formData.phoneNumber}`.trim();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: fullPhone,
          subject: effectiveSubject,
          message: formData.message
        }),
      });

      if (response.ok) {
        setStatus('Thank you! Your official inquiry has been received. Our leadership and solutions architecture team will respond within 24 hours.');
        setStatusType('success');
        setFormData({
          fullName: '',
          email: '',
          countryCode: '+91',
          phoneNumber: '',
          subject: 'Enterprise Software & Application Development',
          customSubject: '',
          message: ''
        });

        // Trigger Google Ads conversion event
        if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
          window.gtag('event', 'conversion', {
            send_to: 'AW-18005464206/U0MdCP3qhZQcEI6p1olD'
          });
        }
      } else {
        setStatus('Failed to send message. Please reach out directly to info@klubnikabytes.com or +91 98310 41427.');
        setStatusType('error');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setStatus('Unable to connect to server. Please email info@klubnikabytes.com or call +91 98310 41427 directly.');
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kb-contact-page">
      {/* Parallel Split Section: Opens directly on navigation */}
      <section className="kb-contact-split-section">
        <div className="container">
          <div className="kb-contact-parallel-grid">
            
            {/* Left Column: Cleanly Separated Executive Boxes */}
            <div className="kb-contact-left-column">
              
              {/* Box 1: Corporate Headquarters (Photo, Address, 24/7 Support, Interactive Map & Sleek Action Buttons) */}
              <div className="kb-contact-exec-box kb-map-box-card">
                <div className="kb-exec-box-header">
                  <div className="kb-exec-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <span className="kb-exec-eyebrow">PRIMARY FACILITY &amp; HEADQUARTERS</span>
                    <h3 className="kb-exec-title">Corporate Headquarters</h3>
                  </div>
                </div>

                <div className="kb-location-split-body">
                  {/* Left Side: Exact Location with Mani Casadona Photo */}
                  <div className="kb-loc-photo-block">
                    <div className="kb-loc-image-wrap">
                      <img
                        src="/contact-banner-bg.jpg"
                        alt="Mani Casadona West Tower Corporate Headquarters"
                        className="kb-loc-building-img"
                      />
                      <span className="kb-loc-photo-badge">Mani Casadona • West Tower</span>
                    </div>
                    <div className="kb-loc-meta-details">
                      <strong className="kb-loc-name">11th Floor, West Tower, Mani Casadona</strong>
                      <p className="kb-loc-address-text">
                        International Financial Hub (CBD), New Town, Kolkata 700160, West Bengal, India
                      </p>
                      <div className="kb-exec-support-strip">
                        <span className="kb-pulse-green" />
                        <strong>24/7 Dedicated Support</strong> · Live enterprise coverage
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Google Map & the 2 Sleek Action Buttons below */}
                  <div className="kb-loc-map-block">
                    <div className="kb-iframe-frame">
                      <iframe
                        title="Klubnika Bytes Kolkata Corporate Headquarters on Google Maps"
                        src="https://www.google.com/maps?q=Mani%20Casadona,%20Newtown,%20Kolkata,%20West%20Bengal%20700160&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="180"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>

                    <div className="kb-exec-map-actions">
                      <a
                        href="https://www.google.com/maps?q=Mani+Casadona+New+Town+Kolkata+700160"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kb-btn-map-primary"
                      >
                        <span>Google Maps</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>
                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Mani+Casadona+New+Town+Kolkata"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kb-btn-map-secondary"
                      >
                        <span>Directions</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Direct Calling & Website */}
              <div className="kb-contact-exec-box">
                <div className="kb-exec-box-header">
                  <div className="kb-exec-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <span className="kb-exec-eyebrow">VOICE &amp; DIGITAL CHANNELS</span>
                    <h3 className="kb-exec-title">Phone &amp; Web</h3>
                  </div>
                </div>
                <div className="kb-exec-kv-list">
                  <div className="kb-exec-kv-item">
                    <span className="kb-kv-label">General Line:</span>
                    <a href="tel:+919831041427" className="kb-kv-link">+91 98310 41427</a>
                  </div>
                  <div className="kb-exec-kv-item">
                    <span className="kb-kv-label">Sales Direct:</span>
                    <a href="tel:+919073171757" className="kb-kv-link">+91 90731 71757</a>
                  </div>
                  <div className="kb-exec-kv-item">
                    <span className="kb-kv-label">Official Portal:</span>
                    <a href="https://www.klubnikabytes.com" target="_blank" rel="noopener noreferrer" className="kb-kv-link">
                      www.klubnikabytes.com
                    </a>
                  </div>
                  <div className="kb-exec-kv-item">
                    <span className="kb-kv-label">Social:</span>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                      <a href="https://www.linkedin.com/company/klubnika-bytes/home/" target="_blank" rel="noopener noreferrer" className="kb-kv-link" style={{ fontWeight: 600 }}>
                        LinkedIn ↗
                      </a>
                      <span style={{ color: 'var(--kb-coral)', opacity: 0.7 }}>•</span>
                      <a href="https://www.instagram.com/klubnika_bytes/" target="_blank" rel="noopener noreferrer" className="kb-kv-link" style={{ fontWeight: 600 }}>
                        Instagram ↗
                      </a>
                      <span style={{ color: 'var(--kb-coral)', opacity: 0.7 }}>•</span>
                      <a href="https://x.com/KlubnikaBytes" target="_blank" rel="noopener noreferrer" className="kb-kv-link" style={{ fontWeight: 600 }}>
                        X / Twitter ↗
                      </a>
                      <span style={{ color: 'var(--kb-coral)', opacity: 0.7 }}>•</span>
                      <a href="https://www.facebook.com/klubnikabytes" target="_blank" rel="noopener noreferrer" className="kb-kv-link" style={{ fontWeight: 600 }}>
                        Facebook ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: Email Inquiries & Careers */}
              <div className="kb-contact-exec-box">
                <div className="kb-exec-box-header">
                  <div className="kb-exec-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <span className="kb-exec-eyebrow">COMMERCIAL &amp; TALENT INQUIRIES</span>
                    <h3 className="kb-exec-title">Official Inquiries</h3>
                  </div>
                </div>
                <div className="kb-exec-kv-list">
                  <div className="kb-exec-kv-item">
                    <span className="kb-kv-label">General:</span>
                    <a href="mailto:info@klubnikabytes.com" className="kb-kv-link">info@klubnikabytes.com</a>
                  </div>
                  <div className="kb-exec-kv-item">
                    <span className="kb-kv-label">Enterprise Sales:</span>
                    <a href="mailto:sales@klubnikabytes.com" className="kb-kv-link">sales@klubnikabytes.com</a>
                  </div>
                  <div className="kb-exec-kv-item kb-exec-kv-careers">
                    <span className="kb-kv-label">Careers &amp; HR:</span>
                    <div>
                      <a href="mailto:hr@klubnikabytes.com" className="kb-kv-link">hr@klubnikabytes.com</a>
                      <span className="kb-kv-subtext">For HR and recruitment-related queries, please contact this email.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: High-End Contact Inquiry Form */}
            <div className="kb-contact-right-column">
              <div className="kb-form-panel">
                <div className="kb-form-panel-header">
                  <span className="kb-panel-eyebrow">EXECUTIVE INQUIRY</span>
                  <h2 className="kb-form-panel-title">Let's Start a Conversation</h2>
                  <p className="kb-form-panel-desc">
                    Tell us about your organization's roadmap, immediate engineering scope, or workforce advisory needs. Our leadership team responds within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="kb-enterprise-form">
                  <div className="kb-form-field-row">
                    <div className="kb-field-group">
                      <label htmlFor="fullName" className="kb-field-label">
                        Full Name <span className="kb-req-star">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="kb-field-input"
                        placeholder="e.g. Sarah Jenkins"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="kb-field-group">
                      <label htmlFor="email" className="kb-field-label">
                        Corporate Email <span className="kb-req-star">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="kb-field-input"
                        placeholder="sarah@enterprise.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="kb-form-field-row">
                    {/* Country Code + Numeric-Only Phone Number */}
                    <div className="kb-field-group">
                      <label htmlFor="phoneNumber" className="kb-field-label">
                        Phone Number <span className="kb-req-star">*</span>
                      </label>
                      <div className="kb-phone-composite-wrap">
                        <select
                          name="countryCode"
                          id="countryCode"
                          className="kb-country-code-select"
                          value={formData.countryCode}
                          onChange={handleChange}
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
                          id="phoneNumber"
                          name="phoneNumber"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={15}
                          className="kb-phone-number-input"
                          placeholder="9831041427 (digits only)"
                          value={formData.phoneNumber}
                          onChange={handlePhoneChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Subject / Area of Interest Dropdown */}
                    <div className="kb-field-group">
                      <label htmlFor="subject" className="kb-field-label">
                        Subject / Area of Interest <span className="kb-req-star">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="kb-field-select"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        {subjectOptions.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Conditionally rendered Custom Subject when "Other" is picked */}
                  {formData.subject === 'Other' && (
                    <div className="kb-field-group kb-custom-subject-group animate-slide-down">
                      <label htmlFor="customSubject" className="kb-field-label">
                        Specify Your Area of Interest <span className="kb-req-star">*</span>
                      </label>
                      <input
                        type="text"
                        id="customSubject"
                        name="customSubject"
                        className="kb-field-input"
                        placeholder="Please describe the nature of your interest or inquiry..."
                        value={formData.customSubject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}

                  <div className="kb-field-group">
                    <label htmlFor="message" className="kb-field-label">
                      Project Details or Inquiry <span className="kb-req-star">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      className="kb-field-textarea"
                      placeholder="Please outline your objectives, project timeline, technological requirements or specific services required..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="kb-form-consent-box">
                    <label className="kb-consent-checkbox-label">
                      <input type="checkbox" required className="kb-consent-check" />
                      <span>
                        I confirm that I am a human representative and consent to Klubnika Bytes contacting me regarding this official inquiry.
                      </span>
                    </label>
                  </div>

                  <div className="kb-form-cta-row">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="kb-btn-submit-inquiry"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="kb-spinner-mini" />
                          <span>Dispatching Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Official Inquiry</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>

                  {status && (
                    <div className={`kb-inquiry-status-alert kb-status-${statusType}`}>
                      {status}
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Global Footprint Section */}
      <PresenceMap isTeaser={false} hideMap={true} />

      {/* Workspace Gallery Section */}
      <section className="kb-office-gallery-section">
        <div className="container">
          <SectionHeader
            eyebrow="OUR WORKSPACE"
            title="Inside Klubnika Bytes"
            lead="A high-performance workspace designed for collaboration, deep engineering, and executive engagement at Mani Casadona, Kolkata."
            center={true}
          />

          <div className="kb-gallery-grid">
            <div className="kb-gallery-card">
              <div className="kb-gallery-photo-frame">
                <img src="/office-door.jpg" alt="Klubnika Bytes Office Entrance, Suite 30" />
              </div>
              <div className="kb-gallery-caption">
                <span className="kb-caption-badge">SUITE 30</span>
                <strong>Main Corporate Entrance</strong>
                <span>Mani Casadona West Tower</span>
              </div>
            </div>

            <div className="kb-gallery-card">
              <div className="kb-gallery-photo-frame">
                <img src="/office-desk.jpg" alt="Klubnika Bytes Engineering Floor" />
              </div>
              <div className="kb-gallery-caption">
                <span className="kb-caption-badge">COLLABORATION</span>
                <strong>Engineering &amp; Development Floor</strong>
                <span>High-throughput agile workstations</span>
              </div>
            </div>

            <div className="kb-gallery-card">
              <div className="kb-gallery-photo-frame">
                <img src="/office-reception.jpg" alt="Klubnika Bytes Reception Lounge" />
              </div>
              <div className="kb-gallery-caption">
                <span className="kb-caption-badge">WELCOME</span>
                <strong>Client Reception &amp; Briefing Lounge</strong>
                <span>Executive conference suite</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;