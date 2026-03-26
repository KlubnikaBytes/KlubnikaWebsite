const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    candidateName: {
        type: String,
        required: true,
        trim: true
    },
    candidateEmail: {
        type: String,
        required: true,
        trim: true
    },
    candidatePhone: {
        type: String,
        required: true,
        trim: true
    },
    candidateResumeUrl: {
        type: String,
    },
    jobRole: {
        type: String,
        required: true,
        trim: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        required: true
    },
    status: {
        type: String,
        enum: ['Submitted', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'],
        default: 'Submitted'
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const Referral = mongoose.model('Referral', referralSchema);
module.exports = Referral;
