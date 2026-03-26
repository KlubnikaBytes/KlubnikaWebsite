const mongoose = require('mongoose');

const onboardingTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    employeeId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Active', 'Used', 'Expired', 'Revoked'],
        default: 'Active'
    }
}, { timestamps: true });

// Check expiry and update status before saving if needed, but usually handled by cron or queries
onboardingTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Alternatively let it auto-delete, but we want tracking. We'll leave index without TTL and manually handle 'Expired' status dynamically or via job.

const OnboardingToken = mongoose.model('OnboardingToken', onboardingTokenSchema);
module.exports = OnboardingToken;
