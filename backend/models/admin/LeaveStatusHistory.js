const mongoose = require('mongoose');

const leaveStatusHistorySchema = new mongoose.Schema({
    leaveRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveRequest',
        required: true
    },
    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        required: true
    },
    previousStatus: {
        type: String,
        required: true
    },
    newStatus: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const LeaveStatusHistory = mongoose.model('LeaveStatusHistory', leaveStatusHistorySchema);
module.exports = LeaveStatusHistory;
