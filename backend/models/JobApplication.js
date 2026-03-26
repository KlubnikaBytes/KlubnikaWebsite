const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        trim: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeLink: {
        type: String,
        required: true,
        trim: true
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
