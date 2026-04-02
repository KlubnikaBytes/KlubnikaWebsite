const express = require('express');
const router = express.Router();
const { 
    adminLogin, 
    verifyCeoOtp, 
    setupPassword, 
    generateOnboardingToken,
    changeInitialPassword,
    forgotPassword,
    resetPassword
} = require('../../controllers/admin/authController');
const { adminAuth, requireRole } = require('../../middleware/admin/authMiddleware');

// Public Auth Routes (for Admin Portal)
router.post('/login', adminLogin);
router.post('/verify-otp', verifyCeoOtp);
router.post('/setup-password', setupPassword); // Temporarily authorized by resetToken in Header
router.post('/change-initial-password', changeInitialPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected Route (Requires Admin Login)
// Only CEO or HR can generate tokens
router.post('/generate-token', adminAuth, requireRole(['CEO', 'HR']), generateOnboardingToken);

module.exports = router;
