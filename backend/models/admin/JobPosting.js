const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String, // e.g., "Full-time", "Internship"
        required: true
    },
    location: {
        type: String, // e.g., "On-site", "Remote"
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        default: []
    },
    benefits: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee'
    }
}, { timestamps: true });

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
module.exports = JobPosting;
