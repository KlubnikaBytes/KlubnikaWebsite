import React from 'react';
import { getBrandLogo } from './common/BrandLogos';
import './TechTeaser.css';

const featuredTechCategories = [
  {
    category: 'Payment Gateways & FinTech',
    badge: 'REGULATED APIS',
    items: [
      'Stripe', 'Razorpay', 'RazorpayX', 'PayPal',
      'Square', 'Adyen', 'Apple Pay', 'Google Pay', 'Plaid'
    ]
  },
  {
    category: 'Enterprise Cloud & Infrastructure',
    badge: 'MULTI-CLOUD',
    items: [
      'Amazon Web Services (AWS)', 'Microsoft Azure',
      'Google Cloud Platform (GCP)', 'Cloudflare', 'Oracle Cloud Infrastructure'
    ]
  },
  {
    category: 'Enterprise Platforms & ERP',
    badge: 'CORE BUSINESS SYSTEMS',
    items: [
      'SAP S/4HANA', 'Salesforce CRM', 'ServiceNow',
      'Workday', 'Oracle NetSuite', 'Microsoft Dynamics 365'
    ]
  },
  {
    category: 'Frontier AI & Core Stack',
    badge: 'REASONING & ENGINEERING',
    items: [
      'OpenAI (GPT-4o & o1)', 'Google DeepMind (Gemini 2.0)',
      'Anthropic (Claude 3.5)', 'React', 'Next.js', 'Node.js',
      'Python', 'Docker', 'Kubernetes', 'PostgreSQL'
    ]
  }
];

const TechTeaser = ({ onOpenModal }) => {
  const handleOpen = () => {
    if (typeof onOpenModal === 'function') {
      onOpenModal();
    }
    window.dispatchEvent(new CustomEvent('kb:open-tech-stack'));
  };

  return (
    <section id="technology" className="kb-tech-teaser-section kb-dot-grid">
      <div className="container">
        {/* Header */}
        <div className="kb-tech-header-block">
          <span className="kb-eyebrow kb-eyebrow-coral">ENTERPRISE TECH STACK &amp; PLATFORMS</span>
          <h2 className="kb-tech-teaser-title">Built on Modern Enterprise Platforms &amp; Frontier AI</h2>
          <p className="kb-tech-teaser-lead">
            Our technical capabilities span modern programming languages, cloud platforms, regulated payment gateways,
            distributed databases, enterprise ERP systems, and frontier AI reasoning models.
          </p>
        </div>

        {/* Categories Showcase with Real Brand Logos (No office image) */}
        <div className="kb-tech-showcase-grid">
          {featuredTechCategories.map((cat, idx) => (
            <div key={idx} className="kb-tech-cat-card">
              <div className="kb-tech-cat-header">
                <span className="kb-tech-cat-badge">{cat.badge}</span>
                <h3 className="kb-tech-cat-title">{cat.category}</h3>
              </div>

              <div className="kb-tech-logos-wrap">
                {cat.items.map((item, iIdx) => (
                  <div key={iIdx} className="kb-tech-logo-tile" title={item}>
                    <span className="kb-tech-logo-icon">{getBrandLogo(item, 22)}</span>
                    <span className="kb-tech-logo-name">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Strip with CTAs & Compliance Note */}
        <div className="kb-tech-footer-strip">
          <div className="kb-tech-compliance-note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>
              All payment integrations, cloud architectures and enterprise platforms are deployed under official enterprise partner APIs conforming to PCI-DSS, HIPAA, and regional regulatory frameworks.
            </span>
          </div>

          <div className="kb-tech-teaser-actions">
            <button
              type="button"
              className="kb-btn-primary"
              onClick={handleOpen}
              aria-label="View full technical stack"
            >
              <span>View Full Technical Stack (60+ Platforms)</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>

            <a href="/contact" className="kb-btn-outline-light">
              Discuss Architecture Requirements →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechTeaser;
