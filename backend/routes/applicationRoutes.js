const express = require('express');
const router = express.Router();
const Application = require('../models/JobApplication');
const auth = require('../middleware/authMiddleware');

// POST /api/applications - Submit a job application
router.post('/', auth, async (req, res) => {
    try {
        const { 
            jobId, resumeLink, coverLetter, referredBy, 
            fullName, email, phone, address, 
            workExperience, education, legalTermsAccepted, acknowledgementAccepted 
        } = req.body;

        if (!jobId || !resumeLink || !fullName || !email || !phone || !address || !workExperience || !education || !legalTermsAccepted || !acknowledgementAccepted) {
            return res.status(400).json({ status: 'error', message: 'All required fields must be filled and terms accepted.' });
        }

        const newApplication = new Application({
            jobId,
            candidate: req.user._id || req.user.id,
            fullName,
            email,
            phone,
            address,
            workExperience,
            education,
            resumeLink,
            coverLetter,
            legalTermsAccepted,
            acknowledgementAccepted,
            referredBy
        });

        await newApplication.save();

        res.status(201).json({ status: 'success', message: 'Application submitted successfully.', application: newApplication });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ status: 'error', message: 'Server error while submitting application.' });
    }
});

module.exports = router;
