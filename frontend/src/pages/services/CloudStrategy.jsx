import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ServicePages.css';
import heroImg from '../../assets/services/cloud_strategy.png';

const CloudStrategy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="service-page-container" style={{ "--brand-color": "#3b82f6" }}>
            <section className="service-hero">
                <div className="service-hero-bg">
                    <img src={heroImg} alt="Cloud Strategy" />
                </div>
                <div className="service-hero-content">
                    <h1>Cloud Strategy</h1>
                    <p>Upgrading legacy systems with smart digital transformation and DevOps services. Leverage the cloud to increase agility, reduce costs, and scale infinitely.</p>
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
                        <h3>Cloud Migration</h3>
                        <p>Seamlessly move your existing infrastructure and applications to AWS, Azure, or Google Cloud with zero downtime.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
                        </div>
                        <h3>DevOps & CI/CD</h3>
                        <p>Automate your software delivery pipeline, improve deployment frequency, and achieve faster time to market.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                        <h3>Cloud Security</h3>
                        <p>Implement robust security protocols, identity management, and compliance checks to keep your cloud data safe.</p>
                    </div>
                </div>
            </section>

            <section className="service-process">
                <div className="process-container">
                    <h2 className="service-section-title">How We Work</h2>
                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <h4>Assessment</h4>
                            <p>Evaluating your current infrastructure and readiness for the cloud.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <h4>Roadmap</h4>
                            <p>Designing the target architecture and migration plan.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <h4>Execution</h4>
                            <p>Migrating assets, setting up DevOps, and testing the environment.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">4</div>
                            <h4>Optimization</h4>
                            <p>Continuous monitoring, cost optimization, and performance tuning.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CloudStrategy;
