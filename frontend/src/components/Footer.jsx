import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="kb-footer">
            {/* Top Newsletter / CTA Section */}
            <div className="kb-footer-top">
                <div className="container kb-footer-top-container">
                    <div className="kb-footer-cta-text">
                        <h3>Ready to transform your digital presence?</h3>
                        <p>Join our newsletter to get the latest tech insights and updates.</p>
                    </div>
                    <div className="kb-footer-cta-form">
                        <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
                            <input type="email" placeholder="Enter your email address" required />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container kb-footer-main">
                {/* Brand & About */}
                <div className="kb-footer-col brand-col">
                    <Link to="/" className="kb-footer-logo">
                        <img src={logo} alt="Klubnika Bytes" className="kb-logo-icon" style={{ width: '40px', height: 'auto', objectFit: 'contain' }} />
                        Klubnika Bytes
                    </Link>
                    <p className="kb-footer-desc">
                        Empowering forward-thinking businesses with cutting-edge digital solutions, robust web platforms, and intelligent mobile applications.
                    </p>
                    <div className="kb-social-links">
                        <a href="https://www.facebook.com/klubnikabytes" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                        <a href="https://x.com/KlubnikaBytes" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
                        <a href="https://www.linkedin.com/company/klubnika-bytes/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                        <a href="https://www.instagram.com/klubnika_bytes/" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                        <a href="https://www.youtube.com/@KlubnikaBytes" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="kb-footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/#about">About Us</a></li>
                        <li><Link to="/careers">Careers</Link></li>
                        <li><a href="/#blog">Our Blog</a></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div className="kb-footer-col">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="/#services">Web Development</a></li>
                        <li><a href="/#services">Mobile Apps</a></li>
                        <li><a href="/#services">UI/UX Design</a></li>
                        <li><a href="/#services">Cloud Solutions</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="kb-footer-col contact-col">
                    <h4>Reach Us</h4>
                    <ul className="kb-contact-list">
                        <li>
                            <div className="kb-contact-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <span>11th Floor, West Tower, Mani Casadona<br />Kolkata, WB 700160</span>
                        </li>
                        <li>
                            <div className="kb-contact-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <a href="mailto:klubnikabytes@gmail.com">klubnikabytes@gmail.com</a>
                        </li>
                        <li>
                            <div className="kb-contact-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <a href="tel:+919831041427">+91 98310 41427</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="kb-footer-bottom">
                <div className="container kb-footer-bottom-inner">
                    <p>&copy; {new Date().getFullYear()} Klubnika Bytes. All rights reserved.</p>
                    <div className="kb-footer-legal">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <span className="kb-separator">•</span>
                        <Link to="/terms-and-conditions">Terms of Service</Link>
                        <span className="kb-separator">•</span>
                        <Link to="/cancellation-refund-policy">Refund Policy</Link>
                        <span className="kb-separator">•</span>
                        <Link to="/shipping-delivery-policy">Delivery Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
