import React from 'react';
import './PhotoDuotone.css';

const PhotoDuotone = ({
  src,
  alt,
  caption,
  className = '',
  aspectRatio = 'auto',
  style = {}
}) => {
  return (
    <div
      className={`kb-duotone-wrapper ${className}`}
      style={{ aspectRatio, ...style }}
    >
      <img src={src} alt={alt || ''} className="kb-duotone-img" loading="lazy" />
      <div className="kb-duotone-tint" aria-hidden="true" />
      {caption && <div className="kb-duotone-caption">{caption}</div>}
    </div>
  );
};

export default PhotoDuotone;

