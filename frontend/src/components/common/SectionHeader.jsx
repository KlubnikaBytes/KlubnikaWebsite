import React from 'react';
import './SectionHeader.css';

const SectionHeader = ({
  eyebrow,
  title,
  highlight,
  lead,
  center = false,
  light = false,
  className = ''
}) => {
  return (
    <div className={`kb-section-header ${center ? 'kb-header-center' : ''} ${light ? 'kb-header-light' : ''} ${className}`}>
      {eyebrow && <span className="kb-eyebrow">{eyebrow}</span>}
      <h2 className="kb-section-title">
        {title} {highlight && <span className="kb-title-highlight">{highlight}</span>}
      </h2>
      {lead && <p className="kb-section-lead">{lead}</p>}
    </div>
  );
};

export default SectionHeader;

