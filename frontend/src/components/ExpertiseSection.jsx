import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from './common/SectionHeader';
import { coreVerticals } from '../data/expertise';
import './ExpertiseSection.css';

const ExpertiseSection = () => {
  const getVerticalIcon = (id) => {
    switch (id) {
      case 'it-solutions':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case 'hr-consulting':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'outsourcing':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      default:
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
    }
  };

  return (
    <section id="expertise" className="kb-expertise-section">
      <div className="container">
        <SectionHeader
          eyebrow="OUR EXPERTISE"
          title="Three Core Verticals, One Integrated Partner"
          lead="We provide specialized technology solutions, strategic workforce consulting and scalable outsourcing capabilities engineered to drive sustainable business growth."
          center={true}
        />

        <div className="kb-expertise-grid">
          {coreVerticals.map((vertical) => (
            <div key={vertical.id} className="kb-vertical-panel">
              <div className="kb-panel-top">
                <span className="kb-panel-num">{vertical.number}</span>
                <div className="kb-panel-icon">{getVerticalIcon(vertical.id)}</div>
              </div>

              <h3 className="kb-panel-title">{vertical.title}</h3>
              <p className="kb-panel-desc">{vertical.intro}</p>

              {/* Highlight of sub-capabilities */}
              <div className="kb-panel-caps-preview">
                <span className="kb-caps-label">KEY CAPABILITIES:</span>
                <ul className="kb-caps-list">
                  {vertical.subcapabilities.map((sub) => (
                    <li key={sub.letter}>
                      <strong>{sub.letter}.</strong> {sub.title}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/expertise/${vertical.slug}`}
                className="kb-panel-cta"
              >
                <span>Explore Full Scope</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;

