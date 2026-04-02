const mongoose = require('mongoose');

const performanceAppraisalSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        required: true
    },
    period: {
        type: String, // e.g. "Q1 2026", "2025 Annual"
        required: true
    },
    rating: {
        type: Number, // e.g. out of 5
        min: 1,
        max: 5,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    goalsAssigned: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Draft', 'Finalized'],
        default: 'Draft'
    }
}, { timestamps: true });

const PerformanceAppraisal = mongoose.model('PerformanceAppraisal', performanceAppraisalSchema);
module.exports = PerformanceAppraisal;
