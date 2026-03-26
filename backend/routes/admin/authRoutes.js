const express = require('express');
const router = express.Router();
const { 
    adminLogin, 
    verifyCeoOtp, 
    setupPassword, 
    generateOnboardingToken 
} = require('../../controllers/admin/authController');
const { adminAuth, requireRole } = require('../../middleware/admin/authMiddleware');

// Public Auth Routes (for Admin Portal)
router.post('/login', adminLogin);
router.post('/verify-otp', verifyCeoOtp);
router.post('/setup-password', setupPassword); // Temporarily authorized by resetToken in Header

// Protected Route (Requires Admin Login)
// Only CEO or HR can generate tokens
router.post('/generate-token', adminAuth, requireRole(['CEO', 'HR']), generateOnboardingToken);

module.exports = router;
