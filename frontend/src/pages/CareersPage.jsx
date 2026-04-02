import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CareersPage.css';

const CareersPage = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('/api/jobs');
                if (!res.ok) throw new Error('Failed to fetch jobs');
                const data = await res.json();
                setJobs(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching jobs', err);
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className="careers-page">
            <div className="container careers-container">

                <div className="careers-header">
                    <h1>Join Our Team</h1>
                    <p>Help us shape the future of digital solutions.</p>
                </div>

                <div className="jobs-list">
                    {loading ? (
                        <p className="text-center text-slate-500 py-8">Loading available positions...</p>
                    ) : jobs.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">No open positions at the moment. Please check back later!</p>
                    ) : (
                        jobs.map((job) => (
                            <div key={job._id} className="job-listing-card" style={{ marginBottom: '3rem' }}>
                            <div className="job-header">
                                <h2>{job.title}</h2>
                                <span style={{ fontSize: '0.9rem', color: '#6b7280', display: 'block', marginTop: '0.2rem' }}>Job ID: #{job._id.substring(0, 8)}</span>
                                <div className="job-meta" style={{ marginTop: '0.5rem' }}>
                                    <span className="meta-item">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        {job.type}
                                    </span>
                                    <span className="meta-item">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        {job.location}
                                    </span>
                                </div>
                            </div>

                            <div className="job-description">
                                <p>{job.description}</p>
                            </div>

                            <div className="job-details-grid">
                                <div className="details-column">
                                    <h3>Requirements</h3>
                                    <ul>
                                        {job.requirements.map((req, index) => (
                                            <li key={index}>{req}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="details-column">
                                    <h3>Benefits</h3>
                                    <ul>
                                        {job.benefits.map((benefit, index) => (
                                            <li key={index}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="apply-section">
                                <button className="btn btn-apply" onClick={() => navigate(`/apply/${job._id}`)}>Apply Now</button>
                            </div>
                        </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default CareersPage;
