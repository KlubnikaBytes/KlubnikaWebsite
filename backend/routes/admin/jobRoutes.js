const express = require('express');
const router = express.Router();
const JobPosting = require('../../models/admin/JobPosting');
const { adminAuth, requireRole } = require('../../middleware/admin/authMiddleware');

// HR/CEO get all jobs
router.get('/', adminAuth, requireRole(['CEO', 'HR']), async (req, res) => {
    try {
        const jobs = await JobPosting.find().populate('postedBy', 'name').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// HR/CEO create job
router.post('/', adminAuth, requireRole(['CEO', 'HR']), async (req, res) => {
    try {
        const job = new JobPosting({
            ...req.body,
            postedBy: req.employee.id
        });
        await job.save();
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// HR/CEO update job
router.put('/:id', adminAuth, requireRole(['CEO', 'HR']), async (req, res) => {
    try {
        const job = await JobPosting.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// HR/CEO delete job
router.delete('/:id', adminAuth, requireRole(['CEO', 'HR']), async (req, res) => {
     try {
        await JobPosting.findByIdAndDelete(req.params.id);
        res.json({ success: true });
     } catch (error) {
         res.status(500).json({ error: error.message });
     }
});

module.exports = router;
