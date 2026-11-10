import React from 'react';
import './RibbonCorner.css';

const RibbonCorner = ({ className = '' }) => {
  return (
    <div className={`kb-ribbon-corner ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="kb-ribbon-svg"
      >
        {/* Dark crimson outer triangle */}
        <path d="M160 0L40 0L160 120V0Z" fill="var(--kb-crimson)" />
        {/* Vibrant strawberry top-right wedge */}
        <path d="M160 0L85 0L160 75V0Z" fill="var(--kb-strawberry)" />
      </svg>
    </div>
  );
};

export default RibbonCorner;

