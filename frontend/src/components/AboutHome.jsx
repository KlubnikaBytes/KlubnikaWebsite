import React from 'react';
import './AboutHome.css';

const AboutHome = () => {
    const stats = [
        { label: 'Solutions Deployed', value: '150+' },
        { label: 'Global Retainers', value: '80+' },
        { label: 'Years of Innovation', value: '10+' },
        { label: 'Regional Markets', value: '5+' }
    ];

    const features = [
        {
            title: 'Digital Transformation',
            desc: 'Architecting scalable cloud infrastructures and modernizing legacy systems for the digital-first era.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            title: 'Strategic Engineering',
            desc: 'Precision-led development focused on high-concurrency, security, and optimized performance metrics.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 21H18M12 17V21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            title: 'Data Intelligence',
            desc: 'Leveraging advanced analytics and AI-driven insights to power informed business decision-making.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16V12M12 8H12.01" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        }
    ];

    return (
        <section id="about" className="about-home-section">
            <div className="about-container">

                {/* Header Section */}
                <div className="about-header-content">
                    <div className="badge">Corporate Identity</div>
                    <h2 className="about-main-title">Modernizing the <span>Digital Landscape</span></h2>
                    <p className="about-lead-text">
                        Klubnika Bytes is a leading technology consultancy focused on delivering
                        enterprise-grade software solutions. We specialize in bridge-building between
                        complex business requirements and cutting-edge technical execution.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="modern-feature-grid">
                    {features.map((f, i) => (
                        <div key={i} className="modern-feature-card">
                            <div className="icon-frame">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Professional Stats Strip */}
                <div className="corporate-stats-bar">
                    {stats.map((stat, i) => (
                        <div key={i} className="corp-stat-box">
                            <span className="corp-stat-val">{stat.value}</span>
                            <span className="corp-stat-lab">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Final CTA */}
                <div className="about-action-area">
                    <a href="contact" className="premium-btn">
                        Corporate Profile
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default AboutHome;