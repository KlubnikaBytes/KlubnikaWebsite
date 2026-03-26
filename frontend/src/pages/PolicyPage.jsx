import React from 'react';

const PolicyPage = ({ title }) => {
    return (
        <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '60vh', backgroundColor: '#f8fafc' }}>
            <div className="container" style={{ maxWidth: '800px', backgroundColor: 'white', padding: '4rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '2rem' }}>{title}</h1>
                <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                    This is a placeholder for the {title} page. Content will be updated soon.
                </p>
                <p style={{ color: '#475569', lineHeight: '1.8' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
        </div>
    );
};

export default PolicyPage;
