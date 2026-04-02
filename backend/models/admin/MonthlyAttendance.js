const mongoose = require('mongoose');

const monthlyAttendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        required: true
    },
    month: {
        type: Number, // 1-12
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    lates: {
        type: Number,
        default: 0
    },
    leaves: {
        type: Number,
        default: 0
    },
    halfDays: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Ensure one record per employee per month/year
monthlyAttendanceSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const MonthlyAttendance = mongoose.model('MonthlyAttendance', monthlyAttendanceSchema);
module.exports = MonthlyAttendance;
