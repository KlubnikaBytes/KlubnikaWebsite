const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../../controllers/admin/dashboardController');
const { adminAuth } = require('../../middleware/admin/authMiddleware');

router.use(adminAuth);
router.get('/stats', getDashboardStats);

module.exports = router;
