import React from 'react';
import './Services.css';

const servicesData = [
    {
        number: '01',
        title: 'Software Engineering',
        description: 'Creating scalable cloud-native apps and enterprise solutions with modern development stacks.',
        color: '#2563eb',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
            </svg>
        )
    },
    {
        number: '02',
        title: 'Mobility Solutions',
        description: 'High-performance mobile app development for iOS and Android built to scale.',
        color: '#6366f1',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <path d="M12 18h.01"></path>
            </svg>
        )
    },
    {
        number: '03',
        title: 'Experience Design',
        description: 'Creating user-focused designs that reduce friction and boost conversions.',
        color: '#0ea5e9',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
        )
    },
    {
        number: '04',
        title: 'Cloud Strategy',
        description: 'Upgrading legacy systems with smart digital transformation and DevOps services.',
        color: '#3b82f6',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
        )
    },
    {
        number: '05',
        title: 'Web Development',
        description: 'We provide high-performance, scalable web development solutions built to grow with your business and ensure long-term reliability.',
        color: '#ec4899',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
        )
    },
    {
        number: '06',
        title: 'Mobile App Development',
        description: 'Our applications are built for seamless performance, delivering fast, reliable functionality and an exceptional user experience.',
        color: '#8b5cf6',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <path d="M12 18h.01"></path>
            </svg>
        )
    },
    {
        number: '07',
        title: 'Internet Of Things',
        description: 'Craft a distinctive business strategy that capitalizes on the complete, interconnected capabilities of the Internet of Things.',
        color: '#14b8a6',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
            </svg>
        )
    },
    {
        number: '08',
        title: 'Game Development',
        description: 'We turn your ideas into engaging, immersive games — Crafted with creativity, interactivity and precision to deliver unforgettable player experiences.',
        color: '#f59e0b',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
                <path d="M6 12h4"></path>
                <path d="M8 10v4"></path>
                <circle cx="15" cy="13" r="1"></circle>
                <circle cx="18" cy="11" r="1"></circle>
            </svg>
        )
    },
    {
        number: '09',
        title: 'Artificial Intelligence',
        description: 'Empower your business to reach its brand objectives with strategic, structured AI-driven solutions.',
        color: '#ef4444',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <path d="M9 9h6v6H9z"></path>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>
        )
    },
    {
        number: '10',
        title: 'Digital Marketing',
        description: 'We help your business stand out online and bring in the right audience through smart, results-driven digital marketing strategies.',
        color: '#10b981',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0z"></path>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                <path d="M2 12h20"></path>
            </svg>
        )
    },
    {
        number: '11',
        title: 'Data Science Consulting',
        description: 'At Klubnika Bytes, we deliver advanced data science consulting solutions driven by expertise, innovation and a strong commitment to excellence.',
        color: '#6366f1',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
        )
    }
];

const Services = () => {
    return (
        <section id="services" className="services-section-v2">
            <div className="services-container">
                <div className="services-header-v2">
                    <span className="corp-badge">Expertise</span>
                    <h2 className="services-title-v2">Enterprise <span>Capabilities</span></h2>
                    <p className="services-desc-v2">
                        Specialised technology solutions built for modern business challenges and digital growth.
                    </p>
                </div>

                <div className="services-grid-v2">
                    {servicesData.map((service, index) => (
                        <div
                            key={index}
                            className="premium-service-card"
                            style={{ "--brand-color": service.color }}
                        >
                            <div className="card-top-row">
                                <span className="service-index">{service.number}</span>
                                <div className="service-icon-box">{service.icon}</div>
                            </div>

                            <h3 className="service-heading-v2">{service.title}</h3>
                            <p className="service-text-v2">{service.description}</p>

                            <div className="card-action-v2">
                                <span className="action-label">Service Details</span>
                                <svg className="action-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="services-action-v2">
                    <a href="#capabilities" className="btn-full-services">
                        View Technical Stack
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Services;