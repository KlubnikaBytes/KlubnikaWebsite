import React from 'react';
import { Link } from 'react-router-dom';
import PhotoDuotone from './common/PhotoDuotone';
import { coreVerticals } from '../data/expertise';
import officeDesk from '/office-desk.jpg';
import './AboutHome.css';

const AboutHome = () => {
  const stats = [
    { value: '3', label: 'Core Business Verticals' },
    { value: '5', label: 'Locations across India, Canada & the USA' },
    { value: '24/7', label: 'Support Capabilities' },
    { value: 'ISO 9001', label: 'Quality Management Framework' }
  ];

  const credentials = [
    {
      num: '01',
      title: 'IIT & NIT Alumnus Leadership',
      desc: 'Founded and steered by senior engineering leaders from India’s premier institutes (IIT & NIT), blending technical rigor with enterprise scaling experience.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      )
    },
    {
      num: '02',
      title: 'Certified Cloud & AI Architects',
      desc: 'Engineers certified in AWS Solutions Architecture, Microsoft Azure Enterprise, Google Cloud, and enterprise GenAI agentic automation pipelines.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
    {
      num: '03',
      title: 'Top-Notch Industry Consultants',
      desc: 'Advisory practice led by veterans from top-tier management consultancies, guiding Global Capability Center (GCC) incubation and enterprise modernization.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    }
  ];

  return (
    <section id="about" className="kb-about-section">
      <div className="container">
        {/* A. ABOUT US INTRODUCTION — Editorial 2-Column Composition */}
        <div className="kb-about-intro">
          <div className="kb-about-intro-heading">
            <span className="kb-about-kicker">ABOUT US</span>
            <h2 className="kb-about-title">Who We Are</h2>
          </div>

          <div className="kb-about-intro-narrative">
            <p className="kb-about-paragraph-primary">
              Klubnika Bytes delivers integrated technology, digital transformation, HR consulting and outsourcing solutions designed to help businesses modernize operations, improve productivity, optimize costs and accelerate growth.
            </p>
            <p className="kb-about-paragraph-secondary">
              Our portfolio combines technology innovation, AI-driven automation, domain expertise and flexible delivery capabilities to support organizations across industries and business sizes, from startups and SMEs to enterprise organizations.
            </p>
          </div>
        </div>

        {/* B. OUR LEADERSHIP & EXPERTISE — 3-Column Editorial Row */}
        <div className="kb-leadership-editorial">
          {credentials.map((c, i) => (
            <div key={i} className="kb-leadership-column">
              <div className="kb-leadership-head">
                <span className="kb-leadership-index">{c.num}</span>
                <span className="kb-leadership-icon-wrap">{c.icon}</span>
              </div>
              <h3 className="kb-leadership-heading">{c.title}</h3>
              <p className="kb-leadership-text">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* C. OUR MISSION & VISION — Architectural Dual Panels */}
        <div className="kb-mv-duo">
          {/* Mission Panel (Deep Chocolate Brown) */}
          <div className="kb-mv-panel kb-mv-panel-mission">
            <div className="kb-mv-panel-header">
              <span className="kb-mv-eyebrow">OUR MISSION</span>
            </div>
            <h3 className="kb-mv-title">Our Mission</h3>
            <div className="kb-mv-divider" />
            <p className="kb-mv-statement">
              To accelerate enterprise velocity by architecting resilient deep-tech software, automating mission-critical workflows, and establishing high-performing Global Capability Centers backed by unmatched precision, client-centric delivery, and operational excellence.
            </p>
          </div>

          {/* Vision Panel (Warm Beige / Cream) */}
          <div className="kb-mv-panel kb-mv-panel-vision">
            <div className="kb-mv-panel-header">
              <span className="kb-mv-eyebrow">OUR VISION</span>
            </div>
            <h3 className="kb-mv-title">Our Vision</h3>
            <div className="kb-mv-divider" />
            <p className="kb-mv-statement">
              To stand as the premier global technology and strategic workforce partner, pioneering intelligent agentic automation, fostering world-class engineering talent, and empowering organizations worldwide to thrive in an AI-first digital economy.
            </p>
          </div>
        </div>

        {/* D. COMPANY STATISTICS — Full-Width Unified Corporate Strip */}
        <div className="kb-stats-strip">
          {stats.map((stat, i) => (
            <div key={i} className="kb-stats-item">
              <div className="kb-stats-number">{stat.value}</div>
              <div className="kb-stats-description">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Philosophy (Two-Column: Text Left, Duotone Photo Right) — Untouched */}
        <div className="kb-philosophy-grid">
          <div className="kb-philosophy-content">
            <span className="kb-eyebrow">OUR PHILOSOPHY</span>
            <h3 className="kb-philosophy-title">Delivery-Driven, Client-Centric &amp; Deep-Tech</h3>
            <blockquote className="kb-philosophy-quote">
              <p className="kb-philosophy-p">
                Klubnika Bytes differentiates itself through a delivery-driven,
                client-centric and deep-tech-focused approach, combining
                artificial intelligence, technology innovation, domain
                specialization and a long-term partnership mindset.
              </p>
              <p className="kb-philosophy-p">
                Our philosophy goes beyond conventional service delivery. We
                focus on understanding our clients’ business challenges,
                developing practical technology solutions and creating
                measurable business value, through technical expertise,
                operational excellence, cost efficiency and continuous
                innovation.
              </p>
            </blockquote>
            <div className="kb-philosophy-actions">
              <Link to="/contact" className="kb-btn-primary">
                Corporate Profile &amp; Engagement Briefing
              </Link>
            </div>
          </div>

          <div className="kb-philosophy-media">
            <PhotoDuotone
              src={officeDesk}
              alt="Klubnika Bytes Operations & Strategy"
              aspectRatio="4/3"
              caption="Strategy & Operations at Mani Casadona, Kolkata"
            />
          </div>
        </div>

        {/* Three Core Business Verticals Teaser — Untouched */}
        <div className="kb-about-verticals-container">
          <div className="kb-about-verticals-head">
            <span className="kb-eyebrow">CORE CAPABILITIES</span>
            <h3 className="kb-verticals-title">Three Core Business Verticals</h3>
          </div>

          <div className="kb-about-verticals-grid">
            {coreVerticals.map((vert) => (
              <Link
                key={vert.id}
                to={`/expertise/${vert.slug}`}
                className="kb-vertical-card"
              >
                <div className="kb-vertical-num">{vert.number}</div>
                <h4 className="kb-vertical-name">{vert.title}</h4>
                <p className="kb-vertical-desc">{vert.tagline}</p>
                <span className="kb-vertical-arrow">Explore Details →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHome;
