import React from 'react';
import SectionHeader from './common/SectionHeader';
import { valueProposition } from '../data/valueProposition';
import './ValuePropositionSection.css';

const ValuePropositionSection = () => {
  return (
    <section id="value-prop" className="kb-value-prop-section">
      <div className="container">
        <SectionHeader
          eyebrow="OUR VALUE PROPOSITION"
          title={valueProposition.title}
          lead={valueProposition.lead}
          center={true}
        />

        {/* 5 Numbered Rows matching Brochure p.12 */}
        <div className="kb-principles-list">
          {valueProposition.principles.map((p, idx) => (
            <div key={idx} className="kb-principle-row">
              <div className="kb-principle-num">{p.num}</div>
              <div className="kb-principle-content">
                <h3 className="kb-principle-title">{p.title}</h3>
                <p className="kb-principle-text">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-width Cocoa Closing Banner */}
      <div className="kb-value-prop-banner">
        <div className="container">
          <p className="kb-banner-statement">{valueProposition.bannerText}</p>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;

