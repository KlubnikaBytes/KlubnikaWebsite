import React from 'react';
import './InfoCard.css';

const InfoCard = ({
  number,
  title,
  children,
  className = '',
  onClick
}) => {
  return (
    <div
      className={`kb-info-card ${onClick ? 'kb-info-card-clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {number && <span className="kb-info-card-num">{number}</span>}
      {title && <h3 className="kb-info-card-title">{title}</h3>}
      <div className="kb-info-card-content">{children}</div>
    </div>
  );
};

export default InfoCard;

