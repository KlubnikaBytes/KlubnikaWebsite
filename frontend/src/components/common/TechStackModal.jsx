import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { techStackCategories, aiModels } from '../../data/techStack';
import { getBrandLogo } from './BrandLogos';
import './TechStackModal.css';

const TechStackModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderAiLogo = (provider) => {
    const p = (provider || '').toUpperCase();
    if (p.includes('OPENAI')) {
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.8956zm16.5996 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4036-.6669zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.4074 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1636a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813v6.7227zm1.1448-2.6115l3.208-1.854 3.208 1.854v3.708l-3.208 1.854-3.208-1.854z"/>
        </svg>
      );
    }
    if (p.includes('GOOGLE') || p.includes('DEEPMIND')) {
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.627 5.627-12 12-12-6.627 0-12-5.627-12-12z" />
        </svg>
      );
    }
    if (p.includes('ANTHROPIC')) {
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.42 20.37h-3.42l-1.98-4.8H8.08l-1.95 4.8H2.75L9.08 4.25h3.25l5.09 16.12zM9.03 13.12h2.95l-1.46-4.04-1.49 4.04z" />
        </svg>
      );
    }
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'code':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case 'gear':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        );
      case 'database':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        );
      case 'cloud':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          </svg>
        );
      case 'grid':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
        );
      case 'card':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
    }
  };

  const filteredCategories = techStackCategories.filter((cat) => {
    if (activeCategory !== 'all' && cat.id !== activeCategory) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const matchesCat = cat.title.toLowerCase().includes(term);
    const matchesItem = cat.items.some((i) => i.toLowerCase().includes(term));
    return matchesCat || matchesItem;
  });

  return (
    <div className="kb-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="kb-modal-container"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        {/* Close Button */}
        <button
          className="kb-modal-close-btn"
          onClick={onClose}
          aria-label="Close Technology Stack"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="kb-modal-header">
          <span className="kb-modal-eyebrow">TECHNOLOGY &amp; INTEGRATIONS ECOSYSTEM</span>
          <h2 className="kb-modal-title">Enterprise Tech Stack &amp; Platforms</h2>
          <div className="kb-modal-rule" />
          <p className="kb-modal-intro">
            Our technical capabilities span modern programming languages, cloud platforms, payment gateways,
            distributed databases, enterprise ERP systems, and frontier AI reasoning models.
          </p>

          {/* Search Filter Box */}
          <div className="kb-modal-search-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="kb-search-icon">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="kb-modal-search-input"
              placeholder="Filter technologies (e.g. Stripe, AWS, React, Python, SAP, Gemini)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="kb-search-clear"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Pills (Horizontal scrollable on mobile) */}
          <div className="kb-modal-tabs-container">
            <div className="kb-modal-tabs">
              <button
                className={`kb-tab-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All Capabilities
              </button>
              {techStackCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`kb-tab-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.title}
                </button>
              ))}
              <button
                className={`kb-tab-pill ${activeCategory === 'ai' ? 'active' : ''}`}
                onClick={() => setActiveCategory('ai')}
              >
                Frontier AI Models
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body: Categories & Items */}
        <div className="kb-modal-body">
          {/* AI Section (shown if 'all' or 'ai') */}
          {(activeCategory === 'all' || activeCategory === 'ai') && (!searchTerm || 'ai models gpt gemini claude reasoning'.includes(searchTerm.toLowerCase())) && (
            <div className="kb-modal-cat-section kb-modal-ai-section">
              <div className="kb-cat-header">
                <span className="kb-cat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
                <h3 className="kb-cat-title">Frontier AI Models We Work With</h3>
              </div>
              <div className="kb-ai-cards-grid">
                {aiModels.map((m, idx) => (
                  <div key={idx} className="kb-ai-model-card">
                    <div className="kb-ai-logo-wrap">
                      {renderAiLogo(m.provider)}
                    </div>
                    <div className="kb-ai-model-provider">{m.provider}</div>
                    <div className="kb-ai-model-series">{m.series}</div>
                    <div className="kb-ai-model-models">{m.models}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Categories */}
          {activeCategory !== 'ai' && (
            <div className="kb-modal-categories-grid">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="kb-modal-cat-section">
                  <div className="kb-cat-header">
                    <span className="kb-cat-icon">{renderIcon(cat.iconType || cat.icon)}</span>
                    <h3 className="kb-cat-title">{cat.title}</h3>
                  </div>
                  <div className="kb-cat-chips">
                    {cat.items.map((item, iIdx) => (
                      <span key={iIdx} className="kb-tech-chip">
                        <span className="kb-chip-logo-wrap">{getBrandLogo(item, 20)}</span>
                        <span className="kb-chip-label">{item}</span>
                      </span>
                    ))}
                  </div>
                  {cat.footnote && (
                    <div className="kb-cat-footnote">
                      {cat.footnote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {filteredCategories.length === 0 && activeCategory !== 'ai' && (
            <div className="kb-modal-no-results">
              <p>No technologies matched "<strong>{searchTerm}</strong>".</p>
              <button
                className="kb-btn-reset-search"
                onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="kb-modal-footer">
          <span className="kb-modal-footer-text">
            Need a custom integration, specific cloud migration, payment gateway setup, or specialized tech stack?
          </span>
          <Link to="/contact" className="kb-btn-modal-contact" onClick={onClose}>
            Discuss Architecture Requirements →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TechStackModal;