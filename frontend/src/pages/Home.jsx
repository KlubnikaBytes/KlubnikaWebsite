import React from 'react';
import Hero from '../components/Hero';
import AboutHome from '../components/AboutHome';
import ExpertiseSection from '../components/ExpertiseSection';
import IndustryExpertiseSection from '../components/IndustryExpertiseSection';
import TechTeaser from '../components/TechTeaser';
import EngagementModelsSection from '../components/EngagementModelsSection';
import PresenceMap from '../components/common/PresenceMap';
import ComplianceSection from '../components/ComplianceSection';
import DifferentiatorsSection from '../components/DifferentiatorsSection';
import ValuePropositionSection from '../components/ValuePropositionSection';
import Blog from '../components/Blog';
import FinalCTA from '../components/FinalCTA';

const Home = ({ onOpenTechStack }) => {
  return (
    <>
      {/* 1. Cover Hero (Dark Espresso Slider) */}
      <Hero />

      {/* 2. Who We Are (IIT-NIT Pedigree, Mission, Vision & PDF Philosophy) */}
      <AboutHome />

      {/* 3. Three Core Verticals */}
      <ExpertiseSection />

      {/* 4. Industry Expertise & Specialized Domain Solutions */}
      <IndustryExpertiseSection />

      {/* 5. Technology Stack Band */}
      <TechTeaser onOpenModal={onOpenTechStack} />

      {/* 6. Strategic Engagement & Delivery Models (SOW & GCC Solutions) */}
      <EngagementModelsSection />

      {/* 7. Presence & Delivery Centers Teaser */}
      <PresenceMap isTeaser={true} />

      {/* 8. Compliance & Governance Framework (ISO 9001) */}
      <ComplianceSection />

      {/* 9. Key Differentiators */}
      <DifferentiatorsSection />

      {/* 10. Value Proposition */}
      <ValuePropositionSection />

      {/* 11. Insights & Articles */}
      <Blog />

      {/* 12. Final Call to Action */}
      <FinalCTA />
    </>
  );
};

export default Home;