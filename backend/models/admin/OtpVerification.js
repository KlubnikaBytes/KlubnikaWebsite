const mongoose = require('mongoose');

const otpVerificationSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const OtpVerification = mongoose.model('OtpVerification', otpVerificationSchema);
module.exports = OtpVerification;
