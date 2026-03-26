const mongoose = require('mongoose');

const leaveMessageSchema = new mongoose.Schema({
    leaveRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveRequest',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isSystemMessage: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const LeaveMessage = mongoose.model('LeaveMessage', leaveMessageSchema);
module.exports = LeaveMessage;
