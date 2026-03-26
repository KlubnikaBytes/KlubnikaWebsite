const express = require('express');
const router = express.Router();
const { 
    applyLeave, 
    getMyLeaves, 
    getAllLeaves, 
    getLeaveDetails,
    reviewLeave,
    addLeaveMessage
} = require('../../controllers/admin/leaveController');
const { adminAuth, requireRole } = require('../../middleware/admin/authMiddleware');

router.use(adminAuth);

// Employee routes (All authenticated employees)
router.post('/apply', applyLeave);
router.get('/mine', getMyLeaves);

// Admin only routes
router.get('/all', requireRole(['CEO', 'HR']), getAllLeaves);

// Both Admin and Employee need to see details & add messages (controller checks access)
// WARNING: /all must come before /:id so Express doesn't treat 'all' as an ID
router.get('/:id', getLeaveDetails);
router.post('/:id/message', addLeaveMessage);
router.post('/:id/review', requireRole(['CEO', 'HR']), reviewLeave);

module.exports = router;
