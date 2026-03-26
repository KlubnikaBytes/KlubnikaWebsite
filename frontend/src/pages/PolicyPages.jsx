import React from 'react';

export const PolicyLayout = ({ title, children }) => {
    return (
        <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '60vh', backgroundColor: '#f8fafc' }}>
            <div className="container" style={{ maxWidth: '800px', backgroundColor: 'white', padding: '4rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '2.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>{title}</h1>
                <div className="policy-content" style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.05rem' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export const TermsConditions = () => (
    <PolicyLayout title="Terms & Conditions">
        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Services</h3>
        <p>Klubnika Bytes provides digital services including but not limited to:</p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>Professional Website Development</li>
            <li>Mobile Application Development</li>
            <li>Software Maintenance</li>
            <li>Digital Marketing & Strategy</li>
        </ul>
        <p>The scope of work, delivery timeline and pricing will be defined in a separate agreement or proposal shared with the client.</p>

        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>User Rules</h3>
        <p>Users must provide accurate info and not attempt to hack or misuse our services.</p>

        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Payments</h3>
        <p>Clients agree to make payments according to the agreed project proposal or invoice. Typical payment structure may include:</p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>Advance payment before project start</li>
            <li>Milestone-based payments</li>
            <li>Final payment before project delivery</li>
        </ul>
        <p>Failure to complete payment may result in suspension of services or delay in project delivery.</p>

        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Termination</h3>
        <p>We reserve the right to suspend accounts that violate our terms.</p>
    </PolicyLayout>
);

export const PrivacyPolicy = () => (
    <PolicyLayout title="Privacy Policy">
        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Data Protection</h3>
        <p>We implement appropriate security measures to protect your personal information from unauthorized access, misuse, or disclosure. However, no method of online transmission or storage is 100% secure and we cannot guarantee absolute security.</p>

        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>How We Use Your Information</h3>
        <p>The information we collect may be used to:</p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>Provide our services</li>
            <li>Respond to your inquiries</li>
            <li>Improve our website and services</li>
            <li>Communicate updates or offers</li>
            <li>Provide customer support</li>
        </ul>

        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Protection</h3>
        <p>We do not sell your data. We use industry-standard encryption.</p>
    </PolicyLayout>
);

export const CancellationRefundPolicy = () => (
    <PolicyLayout title="Cancellation & Refund Policy">
        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Cancellations</h3>
        <p>Users can cancel their service at any time or within 24 hours of booking depending on the project agreement.</p>

        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Refunds</h3>
        <p>If eligible, refunds are processed to the original payment method within 5–7 working days.</p>

        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Digital Goods</h3>
        <p>Note that once a digital service/license is "activated," it may not be eligible for a full refund.</p>
    </PolicyLayout>
);

export const ShippingDeliveryPolicy = () => (
    <PolicyLayout title="Service Delivery Policy">
        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Delivery Method</h3>
        <p>Digital services are delivered via Email or Dashboard Access.</p>

        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Timeline</h3>
        <p>Access is typically granted instantly or within 24 hours after payment confirmation.</p>

        <h3 style={{ color: '#0f172a', marginTop: '2rem', marginBottom: '1rem' }}>Service Scope</h3>
        <p>Delivery is considered complete once the login credentials or project files are sent to the user.</p>
    </PolicyLayout>
);
