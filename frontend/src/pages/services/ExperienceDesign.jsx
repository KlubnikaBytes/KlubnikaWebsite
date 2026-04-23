import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ServicePages.css';
import heroImg from '../../assets/services/experience_design.png';

const ExperienceDesign = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="service-page-container" style={{ "--brand-color": "#0ea5e9" }}>
            <section className="service-hero">
                <div className="service-hero-bg">
                    <img src={heroImg} alt="Experience Design" />
                </div>
                <div className="service-hero-content">
                    <h1>Experience Design</h1>
                    <p>Creating user-focused designs that reduce friction and boost conversions. We design intuitive interfaces that your users will love.</p>
                    <Link to="/contact" className="service-cta-btn">Start Your Project</Link>
                </div>
            </section>

            <section className="service-features-section">
                <h2 className="service-section-title">Our Capabilities</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <h3>UX Research</h3>
                        <p>Understanding your users through deep research, persona creation, and journey mapping to design solutions that truly resonate.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        </div>
                        <h3>UI Design</h3>
                        <p>Crafting stunning visual interfaces, comprehensive design systems, and pixel-perfect layouts that align with your brand identity.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        </div>
                        <h3>Prototyping</h3>
                        <p>Building interactive, high-fidelity prototypes to test assumptions, gather feedback, and validate ideas before development begins.</p>
                    </div>
                </div>
            </section>

            <section className="service-process">
                <div className="process-container">
                    <h2 className="service-section-title">How We Work</h2>
                    <div className="process-steps">
                        <div className="process-step">
                            <div className="step-number">1</div>
                            <h4>Discover</h4>
                            <p>Conducting user interviews, competitive analysis, and requirement gathering.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">2</div>
                            <h4>Define</h4>
                            <p>Creating user flows, wireframes, and information architecture.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">3</div>
                            <h4>Design</h4>
                            <p>Developing UI components, typography, and visual assets.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">4</div>
                            <h4>Test</h4>
                            <p>Usability testing with real users to iterate and perfect the experience.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ExperienceDesign;
