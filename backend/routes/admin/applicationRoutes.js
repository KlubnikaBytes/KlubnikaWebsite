const express = require('express');
const router = express.Router();
const Application = require('../../models/JobApplication');
const { adminAuth } = require('../../middleware/admin/authMiddleware');
const { sendApplicationStatusEmail } = require('../../utils/emailService');

// GET /api/admin/applications - Get all applications for HR/CEO
router.get('/', adminAuth, async (req, res) => {
    try {
        // Only HR and CEO should ideally see this, but adminAuth likely handles it
        // Or we can add role checks here if needed.
        
        const applications = await Application.find()
            .populate('candidate', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({ status: 'success', applications });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ status: 'error', message: 'Server error while fetching applications.' });
    }
});

// PUT /api/admin/applications/:id/status - Update application status & send email
router.put('/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ status: 'error', message: 'Invalid status' });
        }

        const application = await Application.findById(req.params.id);
        
        if (!application) {
            return res.status(404).json({ status: 'error', message: 'Application not found' });
        }

        if (application.status !== 'Pending') {
            return res.status(400).json({ status: 'error', message: 'Application has already been processed' });
        }

        application.status = status;
        await application.save();

        // Send Email Notification
        await sendApplicationStatusEmail(
            application.email, 
            application.fullName, 
            status, 
            application.jobId
        );

        res.status(200).json({ status: 'success', message: `Application ${status.toLowerCase()} and email sent successfully`, application });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ status: 'error', message: 'Server error while updating application status.' });
    }
});

module.exports = router;
