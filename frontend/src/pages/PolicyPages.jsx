import React from 'react';
import { Link } from 'react-router-dom';

export const PolicyLayout = ({ title, children }) => {
  return (
    <div style={{ paddingTop: 'clamp(95px, 12vw, 130px)', paddingBottom: 'clamp(40px, 8vw, 80px)', minHeight: '75vh', backgroundColor: 'var(--kb-cream)' }}>
      <div
        className="container"
        style={{
          maxWidth: '860px',
          backgroundColor: 'var(--kb-white)',
          padding: 'clamp(1.5rem, 5vw, 3.5rem)',
          borderRadius: 'var(--kb-radius-lg)',
          boxShadow: 'var(--kb-shadow-md)',
          border: '1px solid var(--kb-sand)',
          borderLeft: '5px solid var(--kb-strawberry)'
        }}
      >
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.15em', wordSpacing: '0.25em', color: 'var(--kb-strawberry)', textTransform: 'uppercase' }}>
            CORPORATE GOVERNANCE
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--kb-cocoa)', margin: '0.5rem 0 1rem' }}>
            {title}
          </h1>
          <div style={{ width: '48px', height: '4px', backgroundColor: 'var(--kb-strawberry)', borderRadius: '2px' }} />
        </div>

        <div className="policy-content" style={{ color: 'var(--kb-text-muted)', lineHeight: '1.8', fontSize: '1.02rem' }}>
          {children}
        </div>

        <div style={{ marginTop: '3.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--kb-cream-deep)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--kb-taupe)' }}>
            Last revised: March 2026 • ISO 9001:2015 Governance Framework
          </span>
          <Link to="/" style={{ color: 'var(--kb-strawberry)', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export const TermsConditions = () => (
  <PolicyLayout title="Terms & Conditions">
    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>1. Commercial Services</h3>
    <p>Klubnika Bytes provides enterprise technology, advisory, and outsourcing services structured across three primary business verticals:</p>
    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
      <li><strong>IT Solutions & Digital Transformation:</strong> Cloud Architecture, AI/ML Automation, Custom Software, Enterprise Integration, and Experience Design.</li>
      <li><strong>HR Consulting & Workforce Solutions:</strong> Executive Search, Technical Staff Augmentation, RPO, and GCC Talent Advisory.</li>
      <li><strong>Outsourcing & Managed Services:</strong> 24/7 Infrastructure Operations, Managed Services, Application Support, and Process BPO.</li>
    </ul>
    <p>The definitive scope of work, service level agreements (SLAs), deliverables, and commercial consideration are governed by a mutually executed Master Services Agreement (MSA) or Statement of Work (SOW).</p>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>2. Intellectual Property & Code Ownership</h3>
    <p>Unless expressly agreed otherwise in an SOW, all custom deliverables developed specifically for a client become client property upon settlement of final consideration. Pre-existing proprietary modules, libraries, and frameworks retain the ownership of Klubnika Bytes.</p>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>3. Commercial Terms & Invoicing</h3>
    <p>Invoices are issued according to project milestones or monthly retainer schedules. Standard terms require payment within 30 days of invoice receipt, unless specified otherwise in the governing SOW.</p>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>4. Termination & Governing Law</h3>
    <p>Either party may terminate an engagement in accordance with the notice provisions set forth in the executed Master Services Agreement. These terms are governed under the laws of the jurisdiction specified in the commercial contract.</p>
  </PolicyLayout>
);

export const PrivacyPolicy = () => (
  <PolicyLayout title="Privacy & Data Protection Policy">
    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>1. Commitment to Privacy</h3>
    <p>Klubnika Bytes is committed to safeguarding personal and corporate information entrusted to us by clients, candidates, and website visitors. We align our data processing with international standards including GDPR, HIPAA data safeguard standards, and PCI DSS requirements.</p>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>2. Information Collection & Use</h3>
    <p>We collect information submitted directly through our contact form, candidate career portal, and authenticated account management tools. This data is utilized solely for:</p>
    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
      <li>Responding to technical inquiries and enterprise commercial proposals.</li>
      <li>Conducting candidate evaluations and background verifications.</li>
      <li>Administering secure portal credentials and role-based access.</li>
      <li>Improving service delivery and maintaining compliance logs.</li>
    </ul>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>3. Data Security & Storage</h3>
    <p>All transmitted information is encrypted using industry-standard TLS protocols. We do not monetize, sell, or rent personal data to third parties under any circumstances.</p>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>4. Data Subject Rights</h3>
    <p>Individuals may request access, modification, or deletion of their personal records by contacting our Data Protection Officer at <a href="mailto:info@klubnikabytes.com" style={{ color: 'var(--kb-strawberry)' }}>info@klubnikabytes.com</a>.</p>
  </PolicyLayout>
);

export const CancellationRefundPolicy = () => (
  <PolicyLayout title="Cancellation & Refund Policy">
    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>1. Professional Services & Consulting</h3>
    <p>Professional services, software engineering sprints, and consulting hours are billed based on agreed timeframes and deliverables. Cancellation of ongoing sprints must adhere to the notice period outlined in the governing Statement of Work (typically 15 to 30 days).</p>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>2. Milestone-Based Refunds</h3>
    <p>Where milestone-based contracts provide for refund eligibility, claims must be formally submitted in writing within 14 calendar days of deliverable submission. Verified refunds are credited via original settlement channels within 7 to 10 business days.</p>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>3. Digital Licenses & Dedicated Infrastructure</h3>
    <p>Cloud resource provisioning and third-party license subscriptions procured on behalf of a client are non-refundable once activated with the respective cloud vendor.</p>
  </PolicyLayout>
);

export const ShippingDeliveryPolicy = () => (
  <PolicyLayout title="Service Delivery & SLA Policy">
    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>1. Electronic & Cloud Delivery</h3>
    <p>All technology deliverables, source repositories, documentation, and cloud environments provided by Klubnika Bytes are transmitted electronically through secure protocols (e.g. Git repositories, encrypted S3 containers, or customer-designated staging servers).</p>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>2. Delivery Timelines & Milestones</h3>
    <p>Project schedules are governed by the sprint cadence and milestone schedules documented in the executed project roadmap. Enterprise retainers benefit from 24/7 monitoring and response protocols.</p>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>3. Acceptance & Handover</h3>
    <p>A deliverable is deemed formally delivered upon transmission of credentials and artifacts accompanied by a formal Handover Verification Document.</p>
  </PolicyLayout>
);
