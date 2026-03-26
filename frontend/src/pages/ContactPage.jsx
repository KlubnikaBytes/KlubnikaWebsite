import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            // Use existing API endpoint built previously
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.fullName, // mapping fullName to name for backend
                    email: formData.email,
                    message: formData.message
                }),
            });

            if (response.ok) {
                setStatus('Message sent successfully!');
                setFormData({ fullName: '', email: '', phoneNumber: '', subject: '', message: '' });
            } else {
                setStatus('Failed to send message.');
            }
        } catch (error) {
            setStatus('Error connecting to server.');
            console.error(error);
        }
    };

    return (
        <div className="contact-page">
            {/* Banner & Info Cards Section */}
            <section className="contact-banner">
                <div className="contact-banner-overlay"></div>
                <div className="container contact-banner-content">
                    <div className="banner-text">
                        <h1>Contact Us</h1>
                        <p>Get in touch with us to discuss your project or learn more about our services.</p>
                    </div>

                    <div className="info-cards-container">
                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <h3>Visit Us</h3>
                            <p>Klubnika Bytes, 11th Floor<br />West Tower, Mani Casadona<br />Kolkata, West Bengal 700160</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <h3>Call Us</h3>
                            <p>
                                <span className="contact-label">CEO:</span> <a href="tel:+919832171757">+91 98321 71757</a><br />
                                <span className="contact-label">HR:</span> <a href="tel:+919831041427">+91 98310 41427</a>
                            </p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <h3>Email Us</h3>
                            <p><a href="mailto:info@klubnikabytes.com">info@klubnikabytes.com</a></p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            </div>
                            <h3>Working Hours</h3>
                            <p>Monday - Friday<br />10:00 AM - 6:00 PM</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="contact-form-section">
                <div className="container">
                    <div className="form-wrapper">
                        <h2>Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="contact-form-extended">
                            <div className="form-row">
                                <div className="form-group half-width">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                                </div>
                                <div className="form-group half-width">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                            </div>

                            <div className="recaptcha-placeholder">
                                <input type="checkbox" id="robot" required />
                                <label htmlFor="robot">I am not a robot</label>
                            </div>

                            <div className="submit-container">
                                <button type="submit" className="btn btn-primary submit-btn">Send Message</button>
                            </div>
                            {status && <p className="form-status">{status}</p>}
                        </form>
                    </div>
                </div>
            </section>

            {/* Office Gallery Section */}
            <section className="office-gallery-section">
                <div className="container">
                    <div className="gallery-header">
                        <h2>Our Office</h2>
                        <p>Take a peek inside Klubnika Bytes — where ideas come to life.</p>
                    </div>
                    <div className="office-gallery-grid">
                        <div className="gallery-item gallery-item--tall">
                            <img src="/office-door.jpg" alt="Klubnika Bytes Office Entrance" />
                            <div className="gallery-caption">Office Entrance – Suite 30</div>
                        </div>
                        <div className="gallery-item">
                            <img src="/office-desk.jpg" alt="Klubnika Bytes Workspace" />
                            <div className="gallery-caption">Our Workspace</div>
                        </div>
                        <div className="gallery-item">
                            <img src="/office-reception.jpg" alt="Klubnika Bytes Reception" />
                            <div className="gallery-caption">Reception Area</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="map-section">
                <iframe
                    title="Klubnika Bytes Location"
                    src="https://maps.google.com/maps?q=Mani%20Casadona,%20Newtown,%20Kolkata,%20West%20Bengal%20700160&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy">
                </iframe>
            </section>
        </div>
    );
};

export default ContactPage;