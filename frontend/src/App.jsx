import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import { TermsConditions, PrivacyPolicy, CancellationRefundPolicy, ShippingDeliveryPolicy } from './pages/PolicyPages';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ApplyPage from './pages/ApplyPage';
import AdminRouter from './admin/AdminRouter';
import SoftwareEngineering from './pages/services/SoftwareEngineering';
import MobileAppDevelopment from './pages/services/MobileAppDevelopment';
import WebsiteDevelopment from './pages/services/WebsiteDevelopment';
import CloudStrategy from './pages/services/CloudStrategy';
import DigitalMarketing from './pages/services/DigitalMarketing';
import ExperienceDesign from './pages/services/ExperienceDesign';
import './index.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin Portal Routes - No Navbar/Footer from standard layout */}
        <Route path="/admin/*" element={<AdminRouter />} />

        {/* Public Website Routes */}
        <Route path="*" element={
          <>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/terms-and-conditions" element={<TermsConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy />} />
                <Route path="/shipping-delivery-policy" element={<ShippingDeliveryPolicy />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/apply/:jobId" element={<ApplyPage />} />
                <Route path="/services/software-engineering" element={<SoftwareEngineering />} />
                <Route path="/services/mobile-app-development" element={<MobileAppDevelopment />} />
                <Route path="/services/website-development" element={<WebsiteDevelopment />} />
                <Route path="/services/cloud-strategy" element={<CloudStrategy />} />
                <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
                <Route path="/services/experience-design" element={<ExperienceDesign />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
