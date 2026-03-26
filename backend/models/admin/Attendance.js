const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkInTime: {
        type: Date,
        default: null
    },
    checkOutTime: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Half Day', 'Holiday', 'On Leave'],
        required: true
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Ensure one record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
