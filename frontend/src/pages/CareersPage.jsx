import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import { apiUrl } from '../config/api';
import './CareersPage.css';

const CareersPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(apiUrl('/api/jobs'));
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
    <div className="kb-careers-page">
      {/* Dark Cover Header */}
      <section className="kb-careers-hero">
        <div className="container kb-careers-hero-content">
          <span className="kb-eyebrow-dark">CAREERS AT KLUBNIKA</span>
          <h1 className="kb-careers-hero-title">Build Your Future With Us</h1>
          <div className="kb-hero-rule" />
          <p className="kb-careers-hero-lead">
            Join a collaborative culture of engineers, architects, and problem solvers delivering mission-critical digital systems across India, Canada, and the United States.
          </p>
        </div>
      </section>

      {/* Jobs Listing Container */}
      <section className="kb-careers-list-section">
        <div className="container kb-careers-container">
          <SectionHeader
            eyebrow="OPEN POSITIONS"
            title="Current Opportunities"
            lead="Explore roles across software engineering, cloud infrastructure, AI solutions, and operational consulting."
            center={true}
          />

          <div className="kb-jobs-list">
            {loading ? (
              <div className="kb-jobs-loading">
                <div className="kb-loading-spinner" />
                <p>Loading available positions...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="kb-jobs-empty">
                <h3>No Open Positions At Present</h3>
                <p>
                  We are not actively advertising vacancies at this moment, but we continuously evaluate outstanding talent. 
                  Send your resume and profile to <a href="mailto:hr@klubnikabytes.com">hr@klubnikabytes.com</a>.
                </p>
              </div>
            ) : (
              jobs.map((job) => (
                <article key={job._id} className="kb-job-card">
                  <div className="kb-job-card-header">
                    <div>
                      <div className="kb-job-id-tag">REQUISITION #{job._id.substring(0, 8).toUpperCase()}</div>
                      <h2 className="kb-job-title">{job.title}</h2>
                    </div>
                    <div className="kb-job-meta">
                      <span className="kb-job-meta-item">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {job.type}
                      </span>
                      <span className="kb-job-meta-item">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {job.location}
                      </span>
                    </div>
                  </div>

                  <div className="kb-job-description">
                    <p>{job.description}</p>
                  </div>

                  {((job.requirements && job.requirements.length > 0) || (job.benefits && job.benefits.length > 0)) && (
                    <div className="kb-job-grid">
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="kb-job-column">
                          <h3 className="kb-column-title">Requirements</h3>
                          <ul className="kb-job-bullets">
                            {job.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {job.benefits && job.benefits.length > 0 && (
                        <div className="kb-job-column">
                          <h3 className="kb-column-title">What We Offer</h3>
                          <ul className="kb-job-bullets">
                            {job.benefits.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="kb-job-card-footer">
                    <button
                      className="kb-btn-primary kb-apply-btn"
                      onClick={() => navigate(`/apply/${job._id}`)}
                    >
                      Apply For This Position →
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
