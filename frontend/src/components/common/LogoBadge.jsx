import React from 'react';
import logo from '../../assets/logo.png';
import './LogoBadge.css';

const LogoBadge = ({ size = 80, showGlow = true, className = '' }) => {
  return (
    <div
      className={`kb-logo-badge ${showGlow ? 'kb-logo-badge-glow' : ''} ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div className="kb-logo-badge-inner">
        <img src={logo} alt="Klubnika Bytes" className="kb-logo-badge-img" />
      </div>
    </div>
  );
};

export default LogoBadge;

