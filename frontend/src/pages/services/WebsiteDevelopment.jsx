import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ServicePages.css';
import heroImg from '../../assets/services/website_development.png';

const WebsiteDevelopment = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="service-page-container" style={{ "--brand-color": "#ec4899" }}>
            <section className="service-hero">
                <div className="service-hero-bg">
                    <img src={heroImg} alt="Website Development" />
                </div>
                <div className="service-hero-content">
                    <h1>Website Development</h1>
                    <p>We provide high-performance, scalable web development solutions built to grow with your business and ensure long-term reliability.</p>
                    <Link to="/contact" className="service-cta-btn">Start Your Project</Link>
                </div>
            </section>

            <section className="service-features-section">
                <h2 className="service-section-title">Our Capabilities</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line></svg>
                        </div>
                        <h3>Custom Web Apps</h3>
                        <p>Tailored web applications built with React, Node.js, and modern frameworks to solve complex business problems.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                        </div>
                        <h3>E-Commerce</h3>
                        <p>Scalable online stores with secure payment gateways, inventory management, and an optimized checkout experience.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        </div>
                        <h3>Corporate Websites</h3>
                        <p>Professional, fast-loading, and SEO-optimized corporate websites that establish your digital presence and drive leads.</p>
                    </div>
                </div>
            </section>

            <section className="service-process">
                <div className="process-container">
                    <h2 className="service-section-title">How We Work</h2>
                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <h4>Planning</h4>
                            <p>Site architecture, technical stack selection, and SEO strategy.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <h4>Design</h4>
                            <p>Visual design, responsive layouts, and user experience planning.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <h4>Development</h4>
                            <p>Frontend and backend coding with performance optimization.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">4</div>
                            <h4>Go-Live</h4>
                            <p>Testing, server deployment, and final quality assurance.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WebsiteDevelopment;
