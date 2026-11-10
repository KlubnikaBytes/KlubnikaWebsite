import React from 'react';
import { Link } from 'react-router-dom';
import './FinalCTA.css';

const FinalCTA = () => {
  return (
    <section className="kb-final-cta-section">
      <div className="container kb-final-cta-container">
        <span className="kb-eyebrow kb-eyebrow-coral">GET IN TOUCH</span>
        <h2 className="kb-final-cta-title">Let’s Build What’s Next, Together.</h2>
        <p className="kb-final-cta-copy">
          Talk to us about AI-powered digital transformation, HR consulting and workforce solutions,
          or outsourcing and managed services tailored to your business.
        </p>

        <div className="kb-final-cta-actions">
          <Link to="/contact" className="kb-btn-primary">
            Contact Us
          </Link>
          <a href="tel:+919831041427" className="kb-btn-secondary">
            Call +91 98310 41427
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
