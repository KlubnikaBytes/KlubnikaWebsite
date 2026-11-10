const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        trim: true
    },
    jobTitle: {
        type: String,
        trim: true,
        default: ''
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    resumeLink: {
        type: String,
        required: false,
        trim: true,
        default: ''
    },
    resumeFileName: {
        type: String,
        default: ''
    },
    resumeContentType: {
        type: String,
        default: 'application/pdf'
    },
    resumeFileSize: {
        type: Number,
        default: 0
    },
    resumeFilePath: {
        type: String,
        default: ''
    },
    resumeData: {
        type: Buffer,
        select: false
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    workExperience: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String,
        trim: true,
        default: ''
    },
    legalTermsAccepted: {
        type: Boolean,
        required: true
    },
    acknowledgementAccepted: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Rejected', 'Interviewing', 'Accepted'],
        default: 'Pending'
    },
    referredBy: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
