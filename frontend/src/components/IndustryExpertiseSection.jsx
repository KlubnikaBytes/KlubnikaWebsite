import React, { useState } from 'react';
import SectionHeader from './common/SectionHeader';
import './IndustryExpertiseSection.css';

const industriesData = [
  {
    id: 'healthcare-pharma',
    name: 'Healthcare, Pharma & Clinical Networks',
    badge: 'MISSION CRITICAL',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    headline: 'Clinical & Hospital Systems, Pharma Supply Chain & Compliance',
    desc: 'Engineering resilient hospital management systems, patient workflows, and clinical trial audit trails conforming to HIPAA and GxP standards.',
    highlights: [
      'Clinical & Multi-Specialty Hospital ERP',
      'Pharma Inventory & Cold-Chain Tracking',
      'Electronic Health Records (EHR) & Telehealth',
      'HIPAA / GxP Data Privacy Compliance'
    ]
  },
  {
    id: 'fintech-bfsi',
    name: 'FinTech, Brokerage & Insurance',
    badge: 'HIGH-FREQUENCY & SECURE',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    headline: 'FinTech Startups, Stock Brokerages & Micro-Insurance Platforms',
    desc: 'High-throughput transactional infrastructure, automated trade reconciliations, policy administration, and automated claims workflows.',
    highlights: [
      'Stock Brokerage & Retail Trading Interfaces',
      'Micro-Insurance Policy & Claim Management',
      'FinTech Startup MVP to Scaled Production',
      'KYC/AML Automated Verification Engines'
    ]
  },
  {
    id: 'workforce-hrms',
    name: 'HRMS, Payroll (EOR / AOR) & Workforce',
    badge: 'ENTERPRISE GOVERNANCE',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    headline: 'EOR & AOR India, 2.5% Payroll Club & Performance Systems',
    desc: 'Comprehensive human capital management, automated statutory payroll filings across India, contractor management, and OKR-driven appraisal frameworks.',
    highlights: [
      '2.5% Payroll Club Engine (All-India Compliance)',
      'Employer of Record (EOR) & AOR Incubation',
      'Employee Performance Management (PMS)',
      'Real-Time Biometric Attendance & Rostering'
    ]
  },
  {
    id: 'hospitality-tourism',
    name: 'Hospitality, Cafés & Travel Chains',
    badge: 'OMNICHANNEL EXPERIENCES',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
    headline: 'Restaurant & Hotel Chains, Modern-Day Cafés & Tourism',
    desc: 'Cloud POS, kitchen order synchronization (KDS), multi-outlet inventory, table booking, and integrated guest loyalty programs.',
    highlights: [
      'Multi-Outlet Restaurant & Hotel POS Integration',
      'Modern-Day Café Self-Ordering & Loyalty App',
      'Kitchen Display Systems (KDS) & Supply Forecasting',
      'Travel & Tourism Itinerary & Booking Portals'
    ]
  },
  {
    id: 'edtech',
    name: 'EdTech & Learning Platforms',
    badge: 'KNOWLEDGE SYSTEMS',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    headline: 'Adaptive Learning Portals, Examination & Student Lifecycle',
    desc: 'Cloud-native learning management systems (LMS), AI-assisted tutoring algorithms, proctored assessments, and student fee reconciliation.',
    highlights: [
      'Enterprise Learning Management Systems (LMS)',
      'Automated Online Examination & Proctoring',
      'Student Analytics & Course Progression Tracking',
      'Interactive Micro-Learning Applications'
    ]
  },
  {
    id: 'ai-automation-bpo',
    name: 'AI Agentic Bots & WhatsApp Automation',
    badge: 'INTELLIGENT OPERATIONS',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    headline: 'AI Back Office Operations, Autonomous Bots & WhatsApp CRM',
    desc: 'Supporting front-line and back-office operations with autonomous AI agents, enterprise WhatsApp API automation, and high-velocity managed workflows.',
    highlights: [
      'Autonomous AI Agentic Decision Bots',
      'WhatsApp Business API Lead & Service Automation',
      'AI-Enabled Back Office Document Extraction',
      '24/7 Managed NOC & Customer Service Pods'
    ]
  }
];

const IndustryExpertiseSection = () => {
  const [selectedIndustry, setSelectedIndustry] = useState(industriesData[0].id);

  const current = industriesData.find((item) => item.id === selectedIndustry) || industriesData[0];

  return (
    <section id="industry-expertise" className="kb-industries-section">
      <div className="container">
        <SectionHeader
          eyebrow="TARGETED DOMAIN EXPERTISE"
          title="Industries &amp; Specialized Solutions We Power"
          lead="From clinical hospital infrastructure and financial brokerages to modern retail chains and nationwide payroll operations, we tailor deep-tech software to industry-specific operational realities."
          center={true}
        />

        {/* Industry Pill Selector Grid */}
        <div className="kb-industries-pills-row">
          {industriesData.map((ind) => (
            <button
              key={ind.id}
              className={`kb-industry-pill-btn ${ind.id === selectedIndustry ? 'active' : ''}`}
              onClick={() => setSelectedIndustry(ind.id)}
            >
              <span className="kb-pill-icon">{ind.icon}</span>
              <span className="kb-pill-name">{ind.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Industry Detail Showcase */}
        <div className="kb-industry-detail-card animate-fade-in" key={current.id}>
          <div className="kb-detail-card-left">
            <span className="kb-detail-card-badge">{current.badge}</span>
            <h3 className="kb-detail-card-headline">{current.headline}</h3>
            <p className="kb-detail-card-desc">{current.desc}</p>
          </div>

          <div className="kb-detail-card-right">
            <span className="kb-detail-chips-label">CORE CAPABILITY SUITE:</span>
            <div className="kb-detail-chips-grid">
              {current.highlights.map((h, i) => (
                <div key={i} className="kb-industry-chip">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="kb-chip-check">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Marquee / Ticker of Specialized Domains */}
        <div className="kb-industry-ticker-wrap">
          <span className="kb-ticker-label">CROSS-SECTOR SPECIALIZATIONS:</span>
          <div className="kb-ticker-chips">
            <span>Healthcare</span>
            <span>Pharma Supply Chain</span>
            <span>Clinical Hospitals</span>
            <span>FinTech Startups</span>
            <span>Micro-Insurance</span>
            <span>Stock Brokerages</span>
            <span>Hotel &amp; Restaurant Chains</span>
            <span>Modern-Day Cafés</span>
            <span>Travel &amp; Tourism</span>
            <span>HRMS &amp; Payroll Club (2.5%)</span>
            <span>EOR &amp; AOR India</span>
            <span>Employee Performance</span>
            <span>AI Back Office</span>
            <span>Agentic Bots</span>
            <span>WhatsApp Automation</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryExpertiseSection;
