const express = require('express');
const router = express.Router();
const PerformanceAppraisal = require('../../models/admin/PerformanceAppraisal');
const { adminAuth, requireRole } = require('../../middleware/admin/authMiddleware');

// HR/CEO get all appraisals
router.get('/', adminAuth, requireRole(['CEO', 'HR']), async (req, res) => {
    try {
        const records = await PerformanceAppraisal.find()
            .populate('employee', 'name employeeId role department')
            .populate('reviewer', 'name role')
            .sort({ createdAt: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create appraisal
router.post('/', adminAuth, requireRole(['CEO', 'HR']), async (req, res) => {
    try {
        const appraisal = new PerformanceAppraisal({
            ...req.body,
            reviewer: req.employee.id
        });
        await appraisal.save();
        res.json({ success: true, appraisal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update appraisal
router.put('/:id', adminAuth, requireRole(['CEO', 'HR']), async (req, res) => {
    try {
        const appraisal = await PerformanceAppraisal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, appraisal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Employee get my appraisals
router.get('/my', adminAuth, async (req, res) => {
    try {
        const records = await PerformanceAppraisal.find({ employee: req.employee.id })
             .populate('reviewer', 'name role')
             .sort({ createdAt: -1 });
        res.json(records);
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
});

module.exports = router;
