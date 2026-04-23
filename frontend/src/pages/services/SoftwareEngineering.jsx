import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ServicePages.css';
import heroImg from '../../assets/services/software_engineering.png';

const SoftwareEngineering = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="service-page-container" style={{ "--brand-color": "#2563eb" }}>
            <section className="service-hero">
                <div className="service-hero-bg">
                    <img src={heroImg} alt="Software Engineering" />
                </div>
                <div className="service-hero-content">
                    <h1>Software Engineering</h1>
                    <p>Creating scalable cloud-native apps and enterprise solutions with modern development stacks. We engineer robust architectures designed for performance and future growth.</p>
                    <Link to="/contact" className="service-cta-btn">Start Your Project</Link>
                </div>
            </section>

            <section className="service-features-section">
                <h2 className="service-section-title">Our Capabilities</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
                        </div>
                        <h3>Cloud-Native Apps</h3>
                        <p>Build applications specifically designed to leverage the scalability and resilience of cloud computing environments.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                        </div>
                        <h3>Enterprise Solutions</h3>
                        <p>Develop comprehensive software systems that streamline business operations and integrate seamlessly with your existing infrastructure.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                        </div>
                        <h3>Legacy Modernization</h3>
                        <p>Upgrade and migrate outdated systems to modern tech stacks without disrupting your day-to-day business operations.</p>
                    </div>
                </div>
            </section>

            <section className="service-process">
                <div className="process-container">
                    <h2 className="service-section-title">How We Work</h2>
                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <h4>Discovery</h4>
                            <p>We analyze your business requirements and technical constraints.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <h4>Architecture</h4>
                            <p>Designing a scalable and secure technical foundation.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <h4>Development</h4>
                            <p>Agile engineering with continuous integration and delivery.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">4</div>
                            <h4>Deployment</h4>
                            <p>Smooth rollout with ongoing support and maintenance.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SoftwareEngineering;
