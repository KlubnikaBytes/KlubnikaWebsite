const express = require('express');
const router = express.Router();
const { submitReferral, getReferrals, updateReferralStatus } = require('../../controllers/admin/referralController');
const { adminAuth, requireRole } = require('../../middleware/admin/authMiddleware');

router.use(adminAuth);

// All authenticated admin users can submit and view their own
router.post('/', submitReferral);
router.get('/', getReferrals);

// Only HR and CEO can update statuses
router.put('/:id/status', requireRole(['CEO', 'HR']), updateReferralStatus);

module.exports = router;
