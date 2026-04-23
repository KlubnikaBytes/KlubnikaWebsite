import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ServicePages.css';
import heroImg from '../../assets/services/digital_marketing.png';

const DigitalMarketing = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="service-page-container" style={{ "--brand-color": "#10b981" }}>
            <section className="service-hero">
                <div className="service-hero-bg">
                    <img src={heroImg} alt="Digital Marketing" />
                </div>
                <div className="service-hero-content">
                    <h1>Digital Marketing</h1>
                    <p>We help your business stand out online and bring in the right audience through smart, results-driven digital marketing strategies.</p>
                    <Link to="/contact" className="service-cta-btn">Start Your Project</Link>
                </div>
            </section>

            <section className="service-features-section">
                <h2 className="service-section-title">Our Capabilities</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <h3>Search Engine Optimization</h3>
                        <p>Improve your organic visibility on Google and drive high-quality traffic to your website through advanced SEO techniques.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <h3>Social Media Management</h3>
                        <p>Engage your audience, build brand loyalty, and run targeted ad campaigns across platforms like Facebook, Instagram, and LinkedIn.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        </div>
                        <h3>Performance Marketing</h3>
                        <p>Data-driven paid ad campaigns (PPC) designed to maximize ROI, minimize cost per acquisition, and accelerate growth.</p>
                    </div>
                </div>
            </section>

            <section className="service-process">
                <div className="process-container">
                    <h2 className="service-section-title">How We Work</h2>
                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <h4>Audit</h4>
                            <p>Analyzing your current digital footprint and competitors.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <h4>Strategy</h4>
                            <p>Developing a customized marketing plan aligned with your goals.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <h4>Execution</h4>
                            <p>Launching campaigns, optimizing content, and managing ads.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">4</div>
                            <h4>Analytics</h4>
                            <p>Tracking performance, reporting ROI, and scaling what works.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DigitalMarketing;
