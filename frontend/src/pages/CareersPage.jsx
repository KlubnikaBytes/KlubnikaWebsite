import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import { apiUrl } from '../config/api';
import './CareersPage.css';

const CareersPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null); // For Full JD Modal
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(apiUrl('/api/jobs'));
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs', err);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Handle body scroll locking when modal is open
  useEffect(() => {
    if (selectedJob) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedJob(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedJob]);

  const getWorkplaceBadge = (job) => {
    if (job.workplaceType) return job.workplaceType;
    if (['On-site', 'Remote', 'Hybrid'].includes(job.location)) return job.location;
    return 'On-site';
  };

  const getLocationDisplay = (job) => {
    if (job.workplaceType && job.location) return job.location;
    if (!['On-site', 'Remote', 'Hybrid'].includes(job.location) && job.location) return job.location;
    return '';
  };

  const filteredJobs = jobs.filter((job) => {
    const workplace = getWorkplaceBadge(job);
    const matchesFilter = filterType === 'All' || workplace.toLowerCase() === filterType.toLowerCase();
    const city = getLocationDisplay(job).toLowerCase();
    const title = (job.title || '').toLowerCase();
    const desc = (job.description || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || title.includes(q) || desc.includes(q) || city.includes(q);
    return matchesFilter && matchesSearch;
  });

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

          {/* Search & Filter Bar */}
          <div className="kb-careers-controls">
            <div className="kb-careers-search-wrap">
              <svg className="kb-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs by title, skills, or location..."
                className="kb-careers-search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="kb-search-clear-btn" aria-label="Clear search">✕</button>
              )}
            </div>

            <div className="kb-careers-filter-tabs">
              {['All', 'On-site', 'Remote', 'Hybrid'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`kb-filter-tab ${filterType === type ? 'active' : ''}`}
                >
                  {type === 'All' ? 'All Roles' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="kb-jobs-grid-wrap">
            {loading ? (
              <div className="kb-jobs-loading">
                <div className="kb-loading-spinner" />
                <p>Loading available positions...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="kb-jobs-empty">
                <h3>{jobs.length === 0 ? 'No Open Positions At Present' : 'No Matching Positions Found'}</h3>
                <p>
                  {jobs.length === 0
                    ? 'We are not actively advertising vacancies at this moment, but we continuously evaluate outstanding talent. Send your resume to '
                    : 'Try clearing your search query or filters, or send your open profile directly to '}
                  <a href="mailto:hr@klubnikabytes.com">hr@klubnikabytes.com</a>.
                </p>
                {jobs.length > 0 && (
                  <button 
                    onClick={() => { setFilterType('All'); setSearchQuery(''); }}
                    className="kb-btn-reset-filters">
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="kb-jobs-grid">
                {filteredJobs.map((job) => {
                  const workplace = getWorkplaceBadge(job);
                  const city = getLocationDisplay(job);
                  const reqId = job._id ? job._id.substring(0, 8).toUpperCase() : 'JOB';

                  return (
                    <article key={job._id} className="kb-compact-job-card">
                      <div className="kb-compact-card-body">
                        {/* Card Top: Requisition Tag & Workplace Badge */}
                        <div className="kb-compact-card-header">
                          <span className="kb-job-id-tag">REQUISITION #{reqId}</span>
                          <span className="kb-job-status-pill">Active</span>
                        </div>

                        {/* Title */}
                        <h2 className="kb-compact-job-title" title={job.title}>
                          {job.title}
                        </h2>

                        {/* Meta Tags Row */}
                        <div className="kb-compact-job-meta">
                          <span className="kb-job-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {job.type}
                          </span>

                          <span className="kb-job-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
                              <rect x="1" y="21" width="22" height="2"></rect>
                            </svg>
                            {workplace}
                          </span>

                          {city && (
                            <span className="kb-job-meta-item kb-meta-location">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              {city}
                            </span>
                          )}
                        </div>

                        {/* Short Excerpt */}
                        <p className="kb-compact-job-desc">
                          {job.description}
                        </p>
                      </div>

                      {/* Card Bottom: Two Action Buttons */}
                      <div className="kb-compact-card-actions">
                        <button
                          type="button"
                          className="kb-btn-read-jd"
                          onClick={() => setSelectedJob(job)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                          Read Job Description
                        </button>

                        <button
                          type="button"
                          className="kb-btn-apply-direct"
                          onClick={() => navigate(`/apply/${job._id}`)}
                        >
                          Apply Now
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full Job Description Modal */}
      {selectedJob && (
        <div 
          className="kb-jd-modal-backdrop" 
          onClick={() => setSelectedJob(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="kb-jd-modal-dialog" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="kb-jd-modal-header">
              <div className="kb-jd-header-info">
                <div className="kb-jd-req-strip">
                  <span className="kb-job-id-tag">
                    REQUISITION #{selectedJob._id ? selectedJob._id.substring(0, 8).toUpperCase() : 'JOB'}
                  </span>
                  <span className="kb-job-status-pill">Active Position</span>
                </div>
                <h2 className="kb-jd-modal-title">{selectedJob.title}</h2>
                <div className="kb-compact-job-meta">
                  <span className="kb-job-meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {selectedJob.type}
                  </span>
                  <span className="kb-job-meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
                      <rect x="1" y="21" width="22" height="2"></rect>
                    </svg>
                    {getWorkplaceBadge(selectedJob)}
                  </span>
                  {getLocationDisplay(selectedJob) && (
                    <span className="kb-job-meta-item kb-meta-location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {getLocationDisplay(selectedJob)}
                    </span>
                  )}
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedJob(null)} 
                className="kb-jd-modal-close-btn"
                aria-label="Close Job Description"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="kb-jd-modal-body">
              {/* Overview / Description */}
              <div className="kb-jd-section">
                <h3 className="kb-jd-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  About the Role & Overview
                </h3>
                <p className="kb-jd-text-body">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div className="kb-jd-section">
                  <h3 className="kb-jd-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Key Responsibilities & Qualifications
                  </h3>
                  <ul className="kb-jd-bullets-list">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx}>
                        <span className="kb-bullet-indicator" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div className="kb-jd-section">
                  <h3 className="kb-jd-section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    What We Offer & Benefits
                  </h3>
                  <ul className="kb-jd-bullets-list kb-benefits-list">
                    {selectedJob.benefits.map((benefit, idx) => (
                      <li key={idx}>
                        <span className="kb-bullet-star">★</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer with Apply Button */}
            <div className="kb-jd-modal-footer">
              <button 
                type="button" 
                onClick={() => setSelectedJob(null)} 
                className="kb-btn-modal-cancel">
                Close
              </button>
              <button
                type="button"
                className="kb-btn-modal-apply"
                onClick={() => {
                  const targetId = selectedJob._id;
                  setSelectedJob(null);
                  navigate(`/apply/${targetId}`);
                }}
              >
                Apply For This Position
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
