import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CareersPage.css';

const CareersPage = () => {
    const navigate = useNavigate();
    const jobs = [
        {
            id: 1,
            title: "Machine Learning (ML) Intern",
            type: "Internship",
            location: "On-site",
            description: "Join our AI team for an intensive internship. You'll work on real-world machine learning models, data pipelines, and intelligent features for our digital products. Perfect for passionate students looking to gain hands-on AI engineering experience.",
            requirements: [
                "Pursuing a degree in Computer Science, AI, or related field",
                "Strong understanding of Python and SQL",
                "Familiarity with ML libraries (TensorFlow, PyTorch, Scikit-learn)",
                "Basic knowledge of data preprocessing and model evaluation",
                "Eagerness to learn and tackle complex data problems"
            ],
            benefits: [
                "Hands-on mentorship from senior engineers",
                "Internship stipend providing competitive compensation",
                "Flexible working hours to accommodate studies",
                "Potential for full-time offer upon successful completion",
                "Access to modern AI tools and compute resources"
            ]
        },
        {
            id: 2,
            title: "Full-Stack Developer",
            type: "Full-time",
            location: "On-site",
            description: "We are seeking a versatile full-stack developer with a strong foundation in both web and mobile application development. You'll bridge the gap between brilliant UI/UX designs and robust backend logic, delivering end-to-end solutions.",
            requirements: [
                "1+ years of proven experience in full-stack web and app development",
                "Strong proficiency in React.js and Node.js / Java / Spring Boot",
                "Experience building cross-platform mobile apps (React Native or Flutter)",
                "Knowledge of database architecture (MongoDB, PostgreSQL)",
                "Experience building and consuming RESTful APIs"
            ],
            benefits: [
                "Competitive salary and performance bonuses",
                "Flexible working hours",
                "Comprehensive health insurance coverage",
                "Dedicated budget for courses and skill development",
                "Generous paid time off policy"
            ]
        }
    ];

    return (
        <div className="careers-page">
            <div className="container careers-container">

                <div className="careers-header">
                    <h1>Join Our Team</h1>
                    <p>Help us shape the future of digital solutions.</p>
                </div>

                <div className="jobs-list">
                    {jobs.map((job) => (
                        <div key={job.id} className="job-listing-card" style={{ marginBottom: '3rem' }}>
                            <div className="job-header">
                                <h2>{job.title}</h2>
                                <span style={{ fontSize: '0.9rem', color: '#6b7280', display: 'block', marginTop: '0.2rem' }}>Job ID: #{job.id}</span>
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
                                <button className="btn btn-apply" onClick={() => navigate(`/apply/${job.id}`)}>Apply Now</button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default CareersPage;
