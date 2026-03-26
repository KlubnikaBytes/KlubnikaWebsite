const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        required: true
    },
    type: {
        type: String,
        enum: ['Sick', 'Casual', 'Earned', 'Unpaid', 'Emergency', 'Other'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    attachmentUrl: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Need More Info'],
        default: 'Pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        default: null
    },
    reviewNotes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
module.exports = LeaveRequest;
