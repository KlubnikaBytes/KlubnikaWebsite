import React, { useState, useEffect } from 'react';
import './Hero.css';

const heroSlides = [
    {
        image: '/hero-bg.png',
        title: 'Architecting Digital Futures',
        subtitle: 'We build scalable, enterprise-grade software solutions tailored for modern business challenges.'
    },
    {
        image: '/hero-bg-2.png',
        title: 'Cloud-Native Innovation',
        subtitle: 'Accelerate your digital transformation with high-performance cloud infrastructure and security.'
    },
    {
        image: '/hero-bg-3.png',
        title: 'Intelligence at Scale',
        subtitle: 'Leveraging AI and data analytics to drive informed decision-making and operational efficiency.'
    }
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
        }, 6000); // 6s gives more time to read professional copy

        return () => clearInterval(slideInterval);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section id="home" className="hero-section">
            {/* Background Layer with Zoom Effect */}
            {heroSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`hero-bg-image ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6)), url(${slide.image})` }}
                />
            ))}

            <div className="container hero-content-wrapper">
                <div className="hero-content">
                    {/* Badge */}
                    <span className="hero-badge animate-fade-up" key={`badge-${currentSlide}`}>
                        Industry Leading IT Solutions
                    </span>

                    {/* Title with key change to re-trigger animation */}
                    <h1 className="hero-title animate-fade-up" key={`title-${currentSlide}`}>
                        {heroSlides[currentSlide].title}
                    </h1>

                    <p className="hero-subtitle animate-fade-up" key={`subtitle-${currentSlide}`}>
                        {heroSlides[currentSlide].subtitle}
                    </p>

                    <div className="hero-cta-group animate-fade-up" key={`cta-${currentSlide}`}>
                        <a href="#services" className="btn-enterprise">
                            Explore Capabilities
                        </a>
                        <a href="contact" className="btn-ghost">
                            Contact Consultant
                        </a>
                    </div>
                </div>
            </div>

            {/* Redefined Indicators */}
            <div className="carousel-navigation">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    >
                        <span className="dot-progress"></span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default Hero;