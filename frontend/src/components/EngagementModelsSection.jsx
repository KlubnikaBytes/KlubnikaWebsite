import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from './common/SectionHeader';
import './EngagementModelsSection.css';

const EngagementModelsSection = () => {
  const [activeTab, setActiveTab] = useState('sow');

  const sowModels = [
    {
      title: 'Time & Material (T&M)',
      badge: 'Agile & Elastic',
      desc: 'Ideal for evolving product scopes, rapid prototyping, and high-velocity engineering where requirements adapt continuously.',
      features: ['Transparent hourly/monthly billing', 'Sprint-by-sprint team scalability', 'Full backlog flexibility']
    },
    {
      title: 'Outcome-Based Delivery',
      badge: 'KPI-Driven',
      desc: 'Commercial models tied directly to verified operational outcomes, business metrics, throughput gains, and SLA achievements.',
      features: ['Shared risk-reward mechanisms', 'Guaranteed performance baselines', 'Continuous value governance']
    },
    {
      title: 'Milestone-Based Delivery',
      badge: 'Gated Governance',
      desc: 'Structured payments aligned with predetermined architectural milestones, phase sign-offs, and critical delivery gates.',
      features: ['Pre-agreed deliverable schedule', 'Formal acceptance testing stages', 'Disciplined delivery cadence']
    },
    {
      title: 'Fixed Price / Fixed Scope',
      badge: 'Cost Certainty',
      desc: 'Turnkey software delivery with fixed capital commitment, strictly managed scope, and guaranteed delivery timelines.',
      features: ['100% budget predictability', 'ISO 9001 quality audits', 'Defined SLA commitments']
    },
    {
      title: 'Hybrid Engagement Model',
      badge: 'Maximum Adaptability',
      desc: 'A blended commercial structure pairing a fixed-cost dedicated engineering nucleus with elastic on-demand specialist capacity.',
      features: ['Stable core retention', 'Burst capacity during critical rollouts', 'Optimized blended day-rates']
    }
  ];

  const gccModels = [
    {
      title: 'BOT Model (Build, Operate, Transfer)',
      badge: 'Turnkey Global Pods',
      desc: 'We construct your dedicated Global Capability Center in Kolkata from ground zero, hire the engineering leadership, mature operational workflows, and transfer complete corporate assets and IP to your entity.',
      phases: [
        { name: 'BUILD', text: 'Talent hiring, infrastructure provisioning at Mani Casadona, security policies, and tech stack onboarding.' },
        { name: 'OPERATE', text: 'Day-to-day agile leadership, ISO 9001 delivery management, KPI tracking, and team scaling.' },
        { name: 'TRANSFER', text: 'Orderly transition of employment contracts, IP, licenses, and infrastructure to your legal subsidiary.' }
      ]
    },
    {
      title: 'Strategic Partnership & Retainer Model',
      badge: 'Co-Managed Excellence',
      desc: 'A permanent co-engineering relationship where Klubnika Bytes operates as an extended offshore division, maintaining dedicated pods exclusively devoted to your multi-year technology roadmap.',
      phases: [
        { name: 'ALIGNMENT', text: 'Deep integration with your internal DevOps pipelines, architecture boards, and sprint cycles.' },
        { name: 'RETENTION', text: 'Industry-leading talent retention backed by our 2.5% Payroll Club and competitive Kolkata talent advantage.' },
        { name: 'EVOLUTION', text: 'Proactive R&D spikes, AI agent experimentation, and ongoing cloud cost optimization.' }
      ]
    }
  ];

  return (
    <section id="engagement-models" className="kb-engagement-section">
      <div className="container">
        <SectionHeader
          eyebrow="COMMERCIAL FLEXIBILITY"
          title="Engagement &amp; Delivery Models"
          lead="Enterprise organizations require flexible contractual frameworks. We offer precision SOW solutions and end-to-end GCC incubation models tailored to your risk appetite and growth trajectory."
          center={true}
        />

        {/* Tab Toggle */}
        <div className="kb-engagement-tabs-wrap">
          <button
            className={`kb-engagement-tab ${activeTab === 'sow' ? 'active' : ''}`}
            onClick={() => setActiveTab('sow')}
          >
            <span className="kb-tab-code">SOW SOLUTIONS</span>
            <span className="kb-tab-title">Statement of Work (5 Frameworks)</span>
          </button>
          <button
            className={`kb-engagement-tab ${activeTab === 'gcc' ? 'active' : ''}`}
            onClick={() => setActiveTab('gcc')}
          >
            <span className="kb-tab-code">GCC SOLUTIONS</span>
            <span className="kb-tab-title">BOT &amp; Strategic Partnership</span>
          </button>
        </div>

        {/* Tab Content: SOW Solutions */}
        {activeTab === 'sow' && (
          <div className="kb-sow-grid animate-fade-in">
            {sowModels.map((m, idx) => (
              <div key={idx} className="kb-model-card">
                <div className="kb-model-top">
                  <span className="kb-model-badge">{m.badge}</span>
                  <span className="kb-model-index">0{idx + 1}</span>
                </div>
                <h3 className="kb-model-title">{m.title}</h3>
                <p className="kb-model-desc">{m.desc}</p>
                <ul className="kb-model-feature-list">
                  {m.features.map((feat, fIdx) => (
                    <li key={fIdx}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="kb-feat-check">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: GCC Solutions */}
        {activeTab === 'gcc' && (
          <div className="kb-gcc-grid animate-fade-in">
            {gccModels.map((m, idx) => (
              <div key={idx} className="kb-gcc-card">
                <div className="kb-gcc-header">
                  <span className="kb-gcc-badge">{m.badge}</span>
                  <h3 className="kb-gcc-title">{m.title}</h3>
                  <p className="kb-gcc-desc">{m.desc}</p>
                </div>

                <div className="kb-gcc-phases">
                  {m.phases.map((ph, pIdx) => (
                    <div key={pIdx} className="kb-gcc-phase-box">
                      <div className="kb-phase-tag">PHASE {pIdx + 1}: {ph.name}</div>
                      <p className="kb-phase-text">{ph.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="kb-engagement-cta-box">
          <div className="kb-cta-box-text">
            <h4>Need a Custom Master Services Agreement (MSA) or GCC Feasibility Study?</h4>
            <p>Our executive advisory team provides confidential evaluation of team ramp-up times, Kolkata infrastructure costs, and delivery SLAs.</p>
          </div>
          <Link to="/contact" className="kb-btn-engagement-cta">
            Schedule an Engagement Briefing →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EngagementModelsSection;
