import React from 'react';
import './StatTile.css';

const StatTile = ({ value, label, subtext, className = '' }) => {
  return (
    <div className={`kb-stat-tile ${className}`}>
      <div className="kb-stat-val">{value}</div>
      <div className="kb-stat-label">{label}</div>
      {subtext && <div className="kb-stat-subtext">{subtext}</div>}
    </div>
  );
};

export default StatTile;

