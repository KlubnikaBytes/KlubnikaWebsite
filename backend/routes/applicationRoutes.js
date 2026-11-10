const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Application = require('../models/JobApplication');
const JobPosting = require('../models/admin/JobPosting');
const { sendJobApplicationNotification, sendCandidateConfirmation } = require('../utils/emailService');

// Multer in-memory storage for handling resume file upload (up to 10MB)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(pdf|doc|docx|txt)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file format. Please upload a PDF, DOC, or DOCX document.'));
        }
    }
});

// GET /api/applications/:id/resume - Direct download endpoint for candidate resume
router.get('/:id/resume', async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id).select('+resumeData');

        if (!application) {
            return res.status(404).send('Application record not found.');
        }

        const rawFileName = application.resumeFileName || `${application.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`;
        const safeFileName = rawFileName.replace(/["\r\n]/g, '');
        const contentType = application.resumeContentType || 'application/pdf';

        // 1. Direct Buffer Download from MongoDB Atlas
        if (application.resumeData && application.resumeData.length > 0) {
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodeURIComponent(safeFileName)}`);
            res.setHeader('Content-Length', application.resumeData.length);
            return res.send(application.resumeData);
        }

        // 2. Disk Cache Fallback (if present on server filesystem)
        if (application.resumeFilePath && fs.existsSync(application.resumeFilePath)) {
            return res.download(application.resumeFilePath, safeFileName);
        }

        // 3. External Link Fallback
        if (application.resumeLink && application.resumeLink.startsWith('http') && !application.resumeLink.includes('/api/applications/')) {
            return res.redirect(application.resumeLink);
        }

        return res.status(404).send('No resume document file was stored for this candidate.');
    } catch (error) {
        console.error('Error downloading resume file:', error);
        return res.status(500).send('Server error retrieving resume file.');
    }
});

// POST /api/applications - Submit a job application (Supports both multipart file upload and JSON)
router.post('/', upload.single('resumeFile'), async (req, res) => {
    try {
        const {
            jobId,
            jobTitle: passedJobTitle,
            fullName,
            email,
            phone,
            address,
            workExperience,
            education,
            coverLetter,
            resumeLink,
            referredBy,
            legalTermsAccepted,
            acknowledgementAccepted
        } = req.body;

        // Check required fields
        if (!jobId || !fullName || !email || !phone || !address || !workExperience || !education) {
            return res.status(400).json({
                status: 'error',
                message: 'Please complete all required fields (Name, Email, Phone, Address, Work Experience, Education).'
            });
        }

        // Must provide either a file or a link
        const hasFile = !!(req.file && req.file.buffer);
        const hasLink = !!(resumeLink && resumeLink.trim());
        if (!hasFile && !hasLink) {
            return res.status(400).json({
                status: 'error',
                message: 'Please upload your resume document or provide an active portfolio/resume link.'
            });
        }

        // Validate acceptance of terms
        const termsAccepted = legalTermsAccepted === true || legalTermsAccepted === 'true';
        const ackAccepted = acknowledgementAccepted === true || acknowledgementAccepted === 'true';
        if (!termsAccepted || !ackAccepted) {
            return res.status(400).json({
                status: 'error',
                message: 'You must accept the legal terms and acknowledge the professional declaration.'
            });
        }

        // Optional token check (if candidate is logged in)
        let candidateId = null;
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
                candidateId = decoded.id || decoded._id || null;
            } catch (err) {
                // If invalid token, continue as guest applicant
            }
        }

        // Look up job title if not provided
        let resolvedJobTitle = passedJobTitle || '';
        if (!resolvedJobTitle && jobId) {
            try {
                const job = await JobPosting.findById(jobId);
                if (job) resolvedJobTitle = job.title;
            } catch (e) {
                // jobId might not be a valid mongo ObjectId or general role
            }
        }

        // Cache file to local disk if running with persistent filesystem
        let diskFilePath = '';
        if (hasFile) {
            try {
                const uploadDir = path.join(__dirname, '..', 'uploads', 'resumes');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const safeName = `${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                diskFilePath = path.join(uploadDir, safeName);
                fs.writeFileSync(diskFilePath, req.file.buffer);
            } catch (fsErr) {
                console.warn('Could not cache file to local disk (storing securely in MongoDB Atlas):', fsErr.message);
            }
        }

        // Create new Application record in DB
        const newApplication = new Application({
            jobId,
            jobTitle: resolvedJobTitle,
            candidate: candidateId,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            address: address.trim(),
            workExperience: workExperience.trim(),
            education: education.trim(),
            coverLetter: coverLetter ? coverLetter.trim() : '',
            resumeFileName: req.file ? req.file.originalname : '',
            resumeContentType: req.file ? (req.file.mimetype || 'application/pdf') : 'application/pdf',
            resumeFileSize: req.file ? req.file.size : 0,
            resumeFilePath: diskFilePath,
            resumeData: req.file ? req.file.buffer : null,
            legalTermsAccepted: true,
            acknowledgementAccepted: true,
            referredBy: referredBy ? referredBy.trim() : ''
        });

        // Determine public download URL for HR and candidate records
        const baseUrl = (process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
        const downloadUrl = `${baseUrl}/api/applications/${newApplication._id}/resume`;
        newApplication.resumeLink = hasFile ? downloadUrl : (hasLink ? resumeLink.trim() : '');

        await newApplication.save();

        // Send Email Notification to HR (with both direct download link and physical attachment)
        sendJobApplicationNotification({
            jobId,
            jobTitle: resolvedJobTitle,
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
            workExperience: workExperience.trim(),
            education: education.trim(),
            coverLetter: coverLetter ? coverLetter.trim() : '',
            resumeLink: hasLink ? resumeLink.trim() : '',
            downloadUrl: hasFile ? downloadUrl : '',
            referredBy: referredBy ? referredBy.trim() : '',
            resumeFile: req.file || null
        }).catch(err => console.error('Background HR notification error:', err));

        // Send confirmation email to candidate
        sendCandidateConfirmation(email.trim(), fullName.trim(), resolvedJobTitle)
            .catch(err => console.error('Background candidate confirmation error:', err));

        return res.status(201).json({
            status: 'success',
            message: 'Application submitted successfully! Our talent team will review your qualifications and reach out.',
            applicationId: newApplication._id,
            downloadUrl: hasFile ? downloadUrl : null
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Server error while submitting application. Please try again.'
        });
    }
});

module.exports = router;
