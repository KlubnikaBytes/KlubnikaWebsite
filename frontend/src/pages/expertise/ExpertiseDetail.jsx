import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PhotoDuotone from '../../components/common/PhotoDuotone';
import { coreVerticals } from '../../data/expertise';
import officeDoor from '/office-door.jpg';
import officeDesk from '/office-desk.jpg';
import officeReception from '/office-reception.jpg';
import './ExpertiseDetail.css';

const ExpertiseDetail = ({ onOpenTechStack }) => {
  const { slug } = useParams();

  // Find the current vertical from slug
  const currentIndex = coreVerticals.findIndex(
    (v) => v.slug === slug || v.id === slug
  );
  const vertical = coreVerticals[currentIndex >= 0 ? currentIndex : 0];

  const prevVertical =
    currentIndex > 0
      ? coreVerticals[currentIndex - 1]
      : coreVerticals[coreVerticals.length - 1];
  const nextVertical =
    currentIndex < coreVerticals.length - 1
      ? coreVerticals[currentIndex + 1]
      : coreVerticals[0];

  // Pick duotone image by vertical
  const heroImage =
    vertical.id === 'it-solutions'
      ? officeDoor
      : vertical.id === 'hr-consulting'
      ? officeDesk
      : officeReception;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="kb-expertise-detail-page">
      {/* 1. Cover-Style Dark Hero */}
      <section className="kb-detail-hero">
        <div className="container kb-detail-hero-container">
          {/* Breadcrumb */}
          <nav className="kb-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="kb-breadcrumb-sep">/</span>
            <a href="/#expertise">Expertise</a>
            <span className="kb-breadcrumb-sep">/</span>
            <span className="kb-breadcrumb-current">{vertical.title}</span>
          </nav>

          <div className="kb-detail-hero-grid">
            <div className="kb-detail-hero-content">
              <span className="kb-detail-eyebrow">{vertical.eyebrow}</span>
              <h1 className="kb-detail-title">{vertical.title}</h1>
              <p className="kb-detail-intro">{vertical.intro}</p>
              <div className="kb-detail-hero-ctas">
                <Link to="/contact" className="kb-btn-primary">
                  Start an Engagement
                </Link>
                {vertical.featureBand.hasTechStackButton && (
                  <button
                    type="button"
                    className="kb-btn-secondary"
                    onClick={() => {
                      if (typeof onOpenTechStack === 'function') {
                        onOpenTechStack();
                      }
                      window.dispatchEvent(new CustomEvent('kb:open-tech-stack'));
                    }}
                  >
                    View Technical Stack
                  </button>
                )}
              </div>
            </div>

            <div className="kb-detail-hero-media">
              <PhotoDuotone
                src={heroImage}
                alt={vertical.title}
                aspectRatio="4/3"
                caption={`Klubnika Bytes • ${vertical.title}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sub-Capability Cards Grid (2-Column on Desktop) */}
      <section className="kb-subcaps-section">
        <div className="container">
          <div className="kb-subcaps-grid">
            {vertical.subcapabilities.map((sub) => (
              <div
                key={sub.letter}
                id={`sub-${sub.letter}`}
                className="kb-subcap-card"
              >
                <div className="kb-subcap-header">
                  <span className="kb-subcap-letter">{sub.letter}.</span>
                  <h3 className="kb-subcap-title">{sub.title}</h3>
                </div>

                <ul className="kb-subcap-bullets">
                  {sub.bullets.map((bullet, idx) => (
                    <li key={idx}>
                      <span className="kb-bullet-dot" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Feature Band (Cocoa Card + Duotone Photo) */}
      <section className="kb-feature-band-section">
        <div className="container">
          <div className="kb-feature-band-card kb-dot-grid">
            <div className="kb-feature-band-text">
              <span className="kb-eyebrow kb-eyebrow-coral">FEATURED CAPABILITY</span>
              <h2 className="kb-feature-band-title">{vertical.featureBand.title}</h2>
              <p className="kb-feature-band-desc">{vertical.featureBand.text}</p>
              {vertical.featureBand.hasTechStackButton && (
                <button
                  className="kb-btn-primary"
                  onClick={onOpenTechStack}
                >
                  View Technical Stack →
                </button>
              )}
            </div>
            <div className="kb-feature-band-media">
              <PhotoDuotone
                src={heroImage}
                alt={vertical.featureBand.title}
                aspectRatio="16/9"
                caption="Klubnika Bytes Enterprise Capabilities"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Prev / Next Navigation & CTA */}
      <section className="kb-vertical-nav-section">
        <div className="container">
          <div className="kb-vertical-nav-grid">
            <Link
              to={`/expertise/${prevVertical.slug}`}
              className="kb-nav-card kb-nav-prev"
            >
              <span className="kb-nav-dir">← Previous Vertical</span>
              <span className="kb-nav-name">{prevVertical.title}</span>
            </Link>

            <Link
              to={`/expertise/${nextVertical.slug}`}
              className="kb-nav-card kb-nav-next"
            >
              <span className="kb-nav-dir">Next Vertical →</span>
              <span className="kb-nav-name">{nextVertical.title}</span>
            </Link>
          </div>

          <div className="kb-vertical-cta-band">
            <h3>Ready to discuss your {vertical.title.toLowerCase()} requirements?</h3>
            <p>Our consultants and technical leadership are available to evaluate your scope and build a tailored roadmap.</p>
            <Link to="/contact" className="kb-btn-primary">
              Speak with a Specialist →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpertiseDetail;

