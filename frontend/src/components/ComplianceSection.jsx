import React from 'react';
import SectionHeader from './common/SectionHeader';
import { complianceBadges, complianceFooterNote } from '../data/compliance';
import './ComplianceSection.css';

const ComplianceSection = () => {
  return (
    <section id="compliance" className="kb-compliance-section">
      <div className="container">
        <SectionHeader
          eyebrow="TRUST & GOVERNANCE"
          title="Quality, Security & Compliance"
          lead="Quality, information security and responsible data handling are built into how we operate and deliver, from structured quality management to security governance and data protection."
          center={true}
        />

        {/* 3x2 Grid of Compliance Cards with Authentic Certification Badges */}
        <div className="kb-compliance-grid">
          {complianceBadges.map((badge) => (
            <div key={badge.id} className="kb-compliance-card">
              {/* Prominent Authentic Certification Seal */}
              <div className="kb-compliance-badge-wrapper">
                <img
                  src={badge.logoUrl}
                  alt={`${badge.code} Official Certification Seal`}
                  className="kb-compliance-badge-img"
                  loading="lazy"
                />
              </div>

              {/* Crisp Badge Code Pill */}
              <span className="kb-compliance-code-pill">
                {badge.code}
              </span>

              {/* Text Block */}
              <div className="kb-compliance-text-block">
                <h3 className="kb-compliance-card-title">{badge.title}</h3>
                <p className="kb-compliance-card-desc">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Footer Note */}
        <div className="kb-compliance-footer-note">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>{complianceFooterNote}</span>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;
