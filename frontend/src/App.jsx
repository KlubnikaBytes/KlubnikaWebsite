import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import TechStackModal from './components/common/TechStackModal';
import Home from './pages/Home';
import { TermsConditions, PrivacyPolicy, CancellationRefundPolicy, ShippingDeliveryPolicy, WorkplacePolicy } from './pages/PolicyPages';
import './index.css';

// Lazy-loaded routes for optimal loading performance
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ApplyPage = lazy(() => import('./pages/ApplyPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ExpertiseDetail = lazy(() => import('./pages/expertise/ExpertiseDetail'));
const AdminRouter = lazy(() => import('./admin/AdminRouter'));

const PageFallback = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--kb-white)' }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid var(--kb-sand)',
      borderTopColor: 'var(--kb-strawberry)',
      borderRadius: '50%',
      animation: 'kbSpin 0.8s linear infinite'
    }} />
  </div>
);

function App() {
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);

  useEffect(() => {
    const handleOpenEvent = () => setIsTechStackOpen(true);
    window.addEventListener('kb:open-tech-stack', handleOpenEvent);
    return () => window.removeEventListener('kb:open-tech-stack', handleOpenEvent);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <TechStackModal isOpen={isTechStackOpen} onClose={() => setIsTechStackOpen(false)} />
      
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Admin Portal Routes - Isolated Layout (No Navbar/Footer) */}
          <Route path="/admin/*" element={<AdminRouter />} />

          {/* Public Website Routes */}
          <Route path="*" element={
            <>
              <Navbar onOpenTechStack={() => setIsTechStackOpen(true)} />
              <main>
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    {/* Landing Page */}
                    <Route path="/" element={<Home onOpenTechStack={() => setIsTechStackOpen(true)} />} />

                    {/* Main Pages */}
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/apply/:jobId" element={<ApplyPage />} />

                    {/* Three Core Verticals */}
                    <Route path="/expertise/:slug" element={<ExpertiseDetail onOpenTechStack={() => setIsTechStackOpen(true)} />} />

                    {/* Legacy Service Redirects */}
                    <Route path="/services" element={<Navigate to="/#expertise" replace />} />
                    <Route path="/services/software-engineering" element={<Navigate to="/expertise/it-solutions-digital-transformation" replace />} />
                    <Route path="/services/mobile-app-development" element={<Navigate to="/expertise/it-solutions-digital-transformation" replace />} />
                    <Route path="/services/website-development" element={<Navigate to="/expertise/it-solutions-digital-transformation" replace />} />
                    <Route path="/services/cloud-strategy" element={<Navigate to="/expertise/it-solutions-digital-transformation" replace />} />
                    <Route path="/services/digital-marketing" element={<Navigate to="/expertise/it-solutions-digital-transformation" replace />} />
                    <Route path="/services/experience-design" element={<Navigate to="/expertise/it-solutions-digital-transformation" replace />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Policy Routes */}
                    <Route path="/terms-and-conditions" element={<TermsConditions />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy />} />
                    <Route path="/shipping-delivery-policy" element={<ShippingDeliveryPolicy />} />
                    <Route path="/workplace-policy" element={<WorkplacePolicy />} />
                    
                    {/* 404 Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
