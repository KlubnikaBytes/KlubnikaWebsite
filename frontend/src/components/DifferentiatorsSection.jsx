import React, { useState } from 'react';
import SectionHeader from './common/SectionHeader';
import { differentiators } from '../data/differentiators';
import './DifferentiatorsSection.css';

const DifferentiatorsSection = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedDifferentiators = showAll ? differentiators : differentiators.slice(0, 8);

  return (
    <section id="differentiators" className="kb-diff-section">
      <div className="container">
        <SectionHeader
          eyebrow="WHY KLUBNIKA BYTES"
          title="Our Differentiators"
          lead="A delivery-driven, client-centric and deep-tech-focused approach, combining AI, technology innovation, domain specialization and a long-term partnership mindset."
          center={true}
        />

        <div className="kb-diff-grid">
          {displayedDifferentiators.map((diff) => (
            <div key={diff.num} className="kb-diff-card">
              <div className="kb-diff-top">
                <span className="kb-diff-num">{diff.num}</span>
                <h3 className="kb-diff-title">{diff.title}</h3>
              </div>
              <p className="kb-diff-text">{diff.text}</p>
            </div>
          ))}
        </div>

        {/* Expand / Collapse Button */}
        <div className="kb-diff-action-wrap">
          <button
            className="kb-btn-secondary-light"
            onClick={() => setShowAll((prev) => !prev)}
            aria-expanded={showAll}
          >
            {showAll ? 'Show Fewer Differentiators ↑' : 'Show All 14 Differentiators ↓'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default DifferentiatorsSection;

