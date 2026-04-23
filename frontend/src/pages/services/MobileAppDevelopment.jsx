import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ServicePages.css';
import heroImg from '../../assets/services/mobile_app.png';

const MobileAppDevelopment = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="service-page-container" style={{ "--brand-color": "#6366f1" }}>
            <section className="service-hero">
                <div className="service-hero-bg">
                    <img src={heroImg} alt="Mobile App Development" />
                </div>
                <div className="service-hero-content">
                    <h1>Mobile App Development</h1>
                    <p>High-performance mobile app development for iOS and Android built to scale. We turn your ideas into seamless, engaging mobile experiences.</p>
                    <Link to="/contact" className="service-cta-btn">Start Your Project</Link>
                </div>
            </section>

            <section className="service-features-section">
                <h2 className="service-section-title">Our Capabilities</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
                        </div>
                        <h3>iOS Development</h3>
                        <p>Native Swift and Objective-C development ensuring top-tier performance and flawless integration with the Apple ecosystem.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path></svg>
                        </div>
                        <h3>Android Development</h3>
                        <p>Robust native Android applications built with Kotlin, optimized for a vast array of devices and screen sizes.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <h3>Cross-Platform</h3>
                        <p>React Native and Flutter solutions that reduce time-to-market while delivering near-native performance on both platforms.</p>
                    </div>
                </div>
            </section>

            <section className="service-process">
                <div className="process-container">
                    <h2 className="service-section-title">How We Work</h2>
                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <h4>Strategy</h4>
                            <p>Defining app goals, target audience, and feature roadmap.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <h4>Prototyping</h4>
                            <p>Creating interactive wireframes and UI designs.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <h4>Engineering</h4>
                            <p>Writing clean, efficient code with robust backends.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">4</div>
                            <h4>Launch</h4>
                            <p>App store submission and post-launch analytics.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MobileAppDevelopment;
