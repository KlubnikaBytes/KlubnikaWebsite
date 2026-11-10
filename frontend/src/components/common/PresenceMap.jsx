import React, { useRef } from 'react';
import SectionHeader from './SectionHeader';
import { locationsData } from '../../data/locations';
import './PresenceMap.css';

const PresenceMap = ({ isTeaser = false, hideMap = false }) => {
  const mapSectionRef = useRef(null);

  const deliveryLocations = [
    {
      city: 'Kolkata, West Bengal',
      country: 'India',
      badge: 'Corporate Headquarters',
      isPrimary: true,
      address: '11th Floor, West Tower, Mani Casadona, International Financial Hub (CBD), Kolkata, West Bengal 700160',
      description: 'Global Headquarters, Global Capability Center (GCC), Executive Leadership, 24/7 Operations & Client Briefing Suites.',
      capabilities: ['Global Executive Suites', 'AI & Cloud CoE', '24/7 Managed NOC', 'Full-Lifecycle Engineering']
    },
    {
      city: 'Pune, Maharashtra',
      country: 'India',
      badge: 'Regional Sales',
      isPrimary: false,
      address: 'Hinjewadi, Pune, Maharashtra 411057',
      description: 'Western India regional client sales, enterprise accounts, and technology consulting partnerships.',
      capabilities: ['Regional Client Liaison', 'Enterprise SOW Solutions', 'Strategic Accounts']
    },
    {
      city: 'Noida, Uttar Pradesh',
      country: 'India',
      badge: 'Regional Sales',
      isPrimary: false,
      address: 'Sector 63, Noida, Uttar Pradesh 201301',
      description: 'Northern India & NCR technology corridor sales, public sector & enterprise engagement hub.',
      capabilities: ['NCR Client Partnerships', 'Workforce Advisory', 'Solution Consulting']
    },
    {
      city: 'London, Ontario',
      country: 'Canada',
      badge: 'International Sales',
      isPrimary: false,
      address: 'London, Ontario, Canada',
      description: 'North American cross-border enterprise solutions, Canadian client operations and delivery management.',
      capabilities: ['Canada Client Relationship', 'Cross-Border Delivery', 'North America Sales']
    },
    {
      city: 'Dubai',
      country: 'United Arab Emirates',
      badge: 'International Sales',
      isPrimary: false,
      address: 'Dubai, UAE',
      description: 'Middle East & GCC market expansion, regional enterprise digital transformation and advisory.',
      capabilities: ['MENA Client Advisory', 'GCC Enterprise Accounts', 'Digital Acceleration']
    },
    {
      city: 'Jersey City, New Jersey',
      country: 'United States',
      badge: 'International Sales',
      isPrimary: false,
      address: 'Jersey City, New Jersey, USA',
      description: 'US East Coast commercial operations, enterprise fintech liaisons, and strategic client accounts.',
      capabilities: ['US Enterprise Accounts', 'FinTech Partnerships', 'Eastern Time Alignment']
    }
  ];

  return (
    <section id="presence" className="kb-presence-section" ref={mapSectionRef}>
      <div className="container">
        <SectionHeader
          eyebrow="GLOBAL FOOTPRINT"
          title="Global Presence & Sales Centers"
          lead="Operating from our Corporate Headquarters in Kolkata, supported by Regional Sales Centers in Pune and Noida, and International Sales Centers in Canada, the UAE, and the United States."
          center={true}
        />

        {/* 4 Key Presence Metric Tiles */}
        <div className="kb-presence-metrics-row">
          <div className="kb-presence-metric-card">
            <div className="kb-metric-number">3</div>
            <div className="kb-metric-label">Core Business Verticals</div>
          </div>
          <div className="kb-presence-metric-card">
            <div className="kb-metric-number">6</div>
            <div className="kb-metric-label">Global & Regional Hubs</div>
          </div>
          <div className="kb-presence-metric-card">
            <div className="kb-metric-number">24/7</div>
            <div className="kb-metric-label">Support Capabilities</div>
          </div>
          <div className="kb-presence-metric-card">
            <div className="kb-metric-number">ISO 9001</div>
            <div className="kb-metric-label">Quality Management</div>
          </div>
        </div>

        {/* 5 High-End Delivery Network Cards */}
        <div className="kb-locations-grid">
          {deliveryLocations.map((loc, idx) => (
            <div
              key={idx}
              className={`kb-location-card ${loc.isPrimary ? 'kb-location-card-primary' : ''}`}
            >
              <div className="kb-loc-header">
                <div className="kb-loc-meta">
                  <span className={`kb-loc-type-label ${loc.isPrimary ? 'primary' : ''}`}>
                    {loc.badge}
                  </span>
                  <span className="kb-loc-sep">·</span>
                  <span className="kb-loc-country-label">{loc.country}</span>
                </div>
              </div>

              <h3 className="kb-loc-city">{loc.city}</h3>
              <p className="kb-loc-address">{loc.address}</p>
              <p className="kb-loc-desc">{loc.description}</p>

              <div className="kb-loc-chips">
                {loc.capabilities.map((cap, cIdx) => (
                  <span key={cIdx} className="kb-loc-chip">
                    {cap}
                  </span>
                ))}
              </div>

              {loc.isPrimary && (
                <div className="kb-loc-primary-footer">
                  <a
                    href="https://www.google.com/maps?q=Mani+Casadona+New+Town+Kolkata+700160"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kb-btn-maps-link"
                  >
                    View on Google Maps ↗
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live Kolkata Interactive Google Map Embed (Always clean & centered) */}
        {!hideMap && (
          <div className="kb-hq-map-wrapper">
            <div className="kb-hq-map-header">
              <div>
                <span className="kb-hq-sub">CORPORATE HEADQUARTERS & GLOBAL CAPABILITY CENTER</span>
                <h3 className="kb-hq-title">Mani Casadona, New Town, Kolkata</h3>
                <p className="kb-hq-desc">
                  11th Floor, West Tower, Mani Casadona, International Financial Hub (CBD),
                  New Town, Kolkata 700160, West Bengal, India
                </p>
              </div>
              <div className="kb-hq-actions">
                <a
                  href="https://www.google.com/maps?q=Mani+Casadona+New+Town+Kolkata+700160"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kb-btn-hq-primary"
                >
                  Open in Google Maps ↗
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Mani+Casadona+New+Town+Kolkata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kb-btn-hq-secondary"
                >
                  Get Directions →
                </a>
              </div>
            </div>

            <div className="kb-hq-split-content">
              {/* Left Column: Mani Casadona Building Photo */}
              <div className="kb-hq-photo-side">
                <img
                  src="/contact-banner-bg.jpg"
                  alt="Mani Casadona West Tower Corporate Headquarters Kolkata"
                  className="kb-hq-building-image"
                  loading="lazy"
                />
                <div className="kb-hq-photo-overlay">
                  <span className="kb-hq-photo-badge">Mani Casadona · West Tower</span>
                  <span className="kb-hq-photo-landmark">Corporate Headquarters &amp; Global Delivery Facility</span>
                </div>
              </div>

              {/* Right Column: Google Maps Interactive Embed */}
              <div className="kb-hq-map-side">
                <iframe
                  title="Klubnika Bytes Kolkata Corporate Headquarters on Google Maps"
                  src="https://www.google.com/maps?q=Mani%20Casadona,%20Newtown,%20Kolkata,%20West%20Bengal%20700160&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PresenceMap;
