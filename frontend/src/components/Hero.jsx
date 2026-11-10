import React, { useState, useEffect } from 'react';
import './Hero.css';

const heroSlides = [
  {
    image: '/hero-bg-2.png',
    badge: 'AI-POWERED IT & CLOUD MODERNIZATION',
    title: 'AI-Powered IT Solutions & Enterprise Cloud Modernization',
    subtitle: 'Architecting digital futures with autonomous AI agents, intelligent workflow automation, and scalable cloud ecosystems, engineered for modern enterprises, startups, and growing industries.'
  },
  {
    image: '/hero-bg.png',
    badge: 'STRATEGIC TALENT & GCC ADVISORY',
    title: 'Workforce Solutions (2.5% Payroll Club - India) & GCC Talent Advisory',
    subtitle: "Accelerate engineering throughput with India's most competitive 2.5% Payroll Club, specialized offshore pods, executive search, and turnkey Global Capability Center (GCC) setup in Kolkata."
  },
  {
    image: '/hero-bg-3.png',
    badge: '24/7 MANAGED ENTERPRISE SERVICES',
    title: '24/7 Managed IT & Infrastructure Operations',
    subtitle: 'Mission-critical AI Assistant and BOT-based managed services, Revenue Cycle Management (RCM) solutions, enterprise BPO operations, and continuous infrastructure governance.'
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(slideInterval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section id="home" className="hero-section">
      {/* Background Slides with Ken Burns Smooth Transition */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`hero-bg-image ${index === currentSlide ? 'active' : ''}`}
          style={{
            backgroundImage: `linear-gradient(rgba(26, 17, 14, 0.72), rgba(50, 32, 27, 0.82)), url(${slide.image})`
          }}
        />
      ))}

      <div className="container hero-content-wrapper">
        <div className="hero-content">
          {/* Eyebrow Badge */}
          <span className="hero-badge animate-fade-up" key={`badge-${currentSlide}`}>
            {heroSlides[currentSlide].badge}
          </span>

          {/* Title with key to re-trigger smooth entrance animation */}
          <h1 className="hero-title animate-fade-up" key={`title-${currentSlide}`}>
            {heroSlides[currentSlide].title}
          </h1>

          <p className="hero-subtitle animate-fade-up" key={`subtitle-${currentSlide}`}>
            {heroSlides[currentSlide].subtitle}
          </p>

          <div className="hero-cta-group animate-fade-up" key={`cta-${currentSlide}`}>
            <a href="#expertise" className="btn-enterprise">
              Explore Core Verticals →
            </a>
            <a href="/contact" className="btn-ghost">
              Connect With Us
            </a>
          </div>
        </div>
      </div>

      {/* Modern Horizontal Dash Carousel Indicators */}
      <div className="carousel-navigation">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          >
            <span className="dot-progress" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
