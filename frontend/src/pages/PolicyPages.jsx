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

export const WorkplacePolicy = () => (
  <PolicyLayout title="Workplace & Culture Policy">
    <div style={{ backgroundColor: 'var(--kb-cream)', padding: '1.25rem 1.5rem', borderRadius: 'var(--kb-radius-md)', borderLeft: '4px solid var(--kb-strawberry)', marginBottom: '2rem' }}>
      <p style={{ margin: 0, fontStyle: 'italic', fontWeight: 500, color: 'var(--kb-cocoa)', lineHeight: '1.7' }}>
        "At Klubnika Bytes, we foster an inclusive, collaborative, and growth-oriented workplace built on innovation, integrity, and mutual respect. We encourage continuous learning, diversity, flexibility, employee well-being, and work-life balance while empowering our people to achieve their full potential."
      </p>
    </div>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>1. Collaborative Working Environment & Facilities</h3>
    <p>We provide high-grade, tech-enabled collaborative working spaces across our global delivery centers and corporate offices (Kolkata HQ, Pune, Noida, London Canada, Dubai UAE, and Jersey City USA). Our physical and digital workspaces are engineered to support both energetic team synergy and individual deep work.</p>
    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
      <li><strong>Collaborative Working Spaces:</strong> Open-plan ideation hubs, breakout rooms, high-speed fiber connectivity, and hybrid conferencing infrastructure.</li>
      <li><strong>Dedicated Focus Hours:</strong> Prescheduled quiet blocks across project teams designed to minimize unscheduled meetings, safeguard cognitive flow, and enable uninterrupted engineering and problem-solving.</li>
      <li><strong>Ergonomics & Well-being:</strong> Workstations equipped with modern ergonomic standards, natural lighting, and recreational breakout zones.</li>
    </ul>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>2. Compensation & Regional Pay Adjustments</h3>
    <p>Klubnika Bytes upholds transparent, meritocratic, and competitive compensation models designed to reward skill, impact, and dedication:</p>
    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
      <li><strong>Regional Pay Adjustment:</strong> Salary bands and compensation structures are aligned with employee region, local cost of living, statutory benchmarks, and economic standards across our operating territories (India, Canada, UAE, USA).</li>
      <li><strong>Merit & Performance Reviews:</strong> Bi-annual and annual performance appraisals ensuring equitable remuneration growth, performance bonuses, and skill-based increments.</li>
      <li><strong>Equal Pay for Equal Value:</strong> Compensation is determined strictly based on role requirements, capability, and delivered impact, free from demographic disparity.</li>
    </ul>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>3. Health, Wellness & Vaccine Policy</h3>
    <p>The health, safety, and physical autonomy of our workforce are paramount principles across all operations:</p>
    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
      <li><strong>Vaccine Policy (No Vaccine Requirement):</strong> In accordance with company policy, personal autonomy, and occupational health guidelines, Klubnika Bytes maintains <strong>no mandatory vaccine requirement</strong> for employment, career progression, or entry to our physical facilities.</li>
      <li><strong>Sanitation & Facility Hygiene:</strong> All premises undergo routine sanitization, air filtration maintenance, and temperature/ventilation monitoring.</li>
      <li><strong>Health Insurance & Support:</strong> Comprehensive medical insurance coverage, wellness counseling, and accessible paid sick leave protocols.</li>
    </ul>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>4. Equal Opportunity, Diversity & Anti-Harassment</h3>
    <p>Klubnika Bytes is proud to be an Equal Opportunity Employer. We maintain an unconditional zero-tolerance policy against any form of unlawful discrimination or harassment:</p>
    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
      <li>Employment decisions—including hiring, promotion, assignment, and compensation—are based solely on qualifications, demonstrated competence, and job performance.</li>
      <li>We strictly prohibit discrimination based on race, color, religion, gender identity, sexual orientation, national origin, genetics, disability, age, or any legally protected category.</li>
      <li>Active compliance with the Prevention of Sexual Harassment (POSH) statutory framework, governed by an impartial Internal Complaints Committee (ICC).</li>
    </ul>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>5. Continuous Learning & Professional Development</h3>
    <p>We are invested in the lifelong professional evolution of every team member:</p>
    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
      <li>Sponsorship for cloud architecture certifications (AWS, Google Cloud, Azure), modern AI/ML frameworks, and project management credentials.</li>
      <li>Cross-vertical exposure across our IT Solutions, HR Consulting, and GCC Managed Services verticals.</li>
      <li>Internal tech talks, hackathons, executive mentoring, and leadership incubation.</li>
    </ul>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>6. Work-Life Balance & Leave Governance</h3>
    <p>Sustainable innovation requires personal well-being and rest:</p>
    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
      <li>Clear boundaries between working hours and off-duty personal time.</li>
      <li>Generous leave policy covering earned privilege leaves, casual leaves, medical leaves, maternity/paternity support, and bereavement leaves.</li>
      <li>Transparent leave application and approval workflow via the internal Klubnika Bytes Employee Portal.</li>
    </ul>

    <h3 style={{ color: 'var(--kb-cocoa)', marginTop: '2rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>7. Grievance Redressal & HR Contact</h3>
    <p>Employees or prospective candidates who have inquiries, concerns, or feedback regarding workplace conditions or policies may connect confidentially with our People Operations team at <a href="mailto:hr@klubnikabytes.com" style={{ color: 'var(--kb-strawberry)', fontWeight: 600 }}>hr@klubnikabytes.com</a> or corporate governance at <a href="mailto:info@klubnikabytes.com" style={{ color: 'var(--kb-strawberry)', fontWeight: 600 }}>info@klubnikabytes.com</a>.</p>
  </PolicyLayout>
);
