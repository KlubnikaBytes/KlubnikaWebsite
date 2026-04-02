const express = require('express');
const router = express.Router();
const JobPosting = require('../models/admin/JobPosting');

// Get active jobs for public careers page
router.get('/', async (req, res) => {
    try {
        const jobs = await JobPosting.find({ status: 'Active' }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
