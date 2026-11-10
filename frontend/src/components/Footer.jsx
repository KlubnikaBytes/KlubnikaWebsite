import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { apiUrl } from '../config/api';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setStatusMsg('');

    try {
      const response = await fetch(apiUrl('/api/newsletter'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setStatusMsg(data.message || 'Thank you for subscribing to our newsletter!');
        setEmail('');
      } else {
        setStatus('error');
        setStatusMsg(data.message || 'Subscription failed. Please check your email.');
      }
    } catch (err) {
      console.error('Newsletter error:', err);
      setStatus('error');
      setStatusMsg('Unable to subscribe at this moment. Please try again later.');
    }
  };

  return (
    <footer className="kb-footer">
      {/* Top Newsletter / CTA Strip */}
      <div className="kb-footer-top">
        <div className="container kb-footer-top-container">
          <div className="kb-footer-cta-text">
            <h3>Ready to transform your operations?</h3>
            <p>Join our newsletter to receive the latest technology insights, AI trends and industry updates.</p>
          </div>
          <div className="kb-footer-cta-form">
            <form onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Business email address"
                disabled={status === 'loading'}
              />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {status === 'success' && (
              <p style={{ color: '#FF7B88', fontSize: '0.88rem', margin: '8px 0 0', fontWeight: '600' }}>
                ✓ {statusMsg}
              </p>
            )}
            {status === 'error' && (
              <p style={{ color: '#FFA4AE', fontSize: '0.88rem', margin: '8px 0 0', fontWeight: '500' }}>
                ⚠ {statusMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container kb-footer-main">
        {/* Brand & Positioning */}
        <div className="kb-footer-col brand-col">
          <Link to="/" className="kb-footer-logo">
            <img src={logo} alt="Klubnika Bytes" className="kb-footer-logo-img" />
            <span className="kb-footer-brand-name">Klubnika Bytes</span>
          </Link>
          <p className="kb-footer-desc">
            Enabling Businesses Through Technology, Intelligence &amp; Operational Excellence.
          </p>
          <span className="kb-footer-tagline">DIGITIZING HORIZONS...</span>

          {/* Social Links */}
          <div className="kb-social-links">
            <a href="https://www.facebook.com/klubnikabytes" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="https://x.com/KlubnikaBytes" aria-label="Twitter / X" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
            </a>
            <a href="https://www.linkedin.com/company/klubnika-bytes/home/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a href="https://www.instagram.com/klubnika_bytes/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
          </div>
        </div>

        {/* Column 2: 3 Core Verticals */}
        <div className="kb-footer-col">
          <h4 className="kb-footer-title">Core Verticals</h4>
          <ul className="kb-footer-links">
            <li>
              <Link to="/expertise/it-solutions-digital-transformation">
                IT Solutions &amp; Digital Transformation
              </Link>
            </li>
            <li>
              <Link to="/expertise/hr-consulting-workforce-solutions">
                HR Consulting &amp; Workforce Solutions
              </Link>
            </li>
            <li>
              <Link to="/expertise/outsourcing-managed-services">
                Outsourcing &amp; Managed Services
              </Link>
            </li>
            <li>
              <a href="/#presence">Global Delivery Centers</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div className="kb-footer-col">
          <h4 className="kb-footer-title">Company</h4>
          <ul className="kb-footer-links">
            <li><a href="/#about">About Us</a></li>
            <li><a href="/#expertise">Capabilities</a></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><a href="/#blog">Insights &amp; Articles</a></li>
            <li><Link to="/contact">Contact Leadership</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact & Locations */}
        <div className="kb-footer-col">
          <h4 className="kb-footer-title">Corporate Headquarters</h4>
          <p className="kb-footer-address">
            11th Floor, West Tower, Mani Casadona,<br />
            International Financial Hub (CBD), New Town,<br />
            Kolkata, West Bengal 700160, India
          </p>
          <div className="kb-footer-contacts">
            <div className="kb-footer-contact-item">
              <span className="kb-footer-sublabel">PHONE</span>
              <a href="tel:+919831041427">+91 98310 41427</a>
            </div>
            <div className="kb-footer-contact-item">
              <span className="kb-footer-sublabel">SALES</span>
              <a href="tel:+919073171757">+91 90731 71757</a>
            </div>
            <div className="kb-footer-contact-item">
              <span className="kb-footer-sublabel">WEB</span>
              <a href="https://www.klubnikabytes.com" target="_blank" rel="noopener noreferrer">www.klubnikabytes.com</a>
            </div>
            <div className="kb-footer-contact-item">
              <span className="kb-footer-sublabel">GENERAL</span>
              <a href="mailto:info@klubnikabytes.com">info@klubnikabytes.com</a>
            </div>
            <div className="kb-footer-contact-item">
              <span className="kb-footer-sublabel">SALES</span>
              <a href="mailto:sales@klubnikabytes.com">sales@klubnikabytes.com</a>
            </div>
            <div className="kb-footer-contact-item">
              <span className="kb-footer-sublabel">CAREERS</span>
              <div className="kb-footer-careers-wrap">
                <a href="mailto:hr@klubnikabytes.com">hr@klubnikabytes.com</a>
                <span className="kb-footer-hr-note">For HR and recruitment inquiries</span>
              </div>
            </div>
            <div className="kb-footer-support-status">
              <span className="kb-support-badge-pulse" />
              <span>24/7 Dedicated Enterprise Support &amp; Operations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Banner Strip */}
      <div className="kb-footer-locations-strip">
        <div className="container kb-footer-locations-wrap">
          <span className="kb-loc-item">Kolkata (Corporate HQ)</span>
          <span className="kb-loc-dot" aria-hidden="true">•</span>
          <span className="kb-loc-item">Hinjewadi, Pune (Regional Sales)</span>
          <span className="kb-loc-dot" aria-hidden="true">•</span>
          <span className="kb-loc-item">Sector 63, Noida (Regional Sales)</span>
          <span className="kb-loc-dot" aria-hidden="true">•</span>
          <span className="kb-loc-item">London, ON (Canada)</span>
          <span className="kb-loc-dot" aria-hidden="true">•</span>
          <span className="kb-loc-item">Dubai (UAE)</span>
          <span className="kb-loc-dot" aria-hidden="true">•</span>
          <span className="kb-loc-item">Jersey City, NJ (USA)</span>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Policies */}
      <div className="kb-footer-bottom">
        <div className="container kb-footer-bottom-container">
          <div className="kb-footer-copy">
            © {new Date().getFullYear()} Klubnika Bytes. All rights reserved. ISO 9001 Certified Quality Management System.
          </div>

          <div className="kb-footer-policies">
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <span className="kb-policy-dot">•</span>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="kb-policy-dot">•</span>
            <Link to="/cancellation-refund-policy">Cancellation &amp; Refund</Link>
            <span className="kb-policy-dot">•</span>
            <Link to="/shipping-delivery-policy">Service Delivery Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
