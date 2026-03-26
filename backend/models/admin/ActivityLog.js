const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        required: true
    },
    action: {
        type: String, // e.g., 'CREATED_EMPLOYEE', 'PUBLISHED_PAGE', 'GENERATED_TOKEN'
        required: true
    },
    module: {
        type: String, // e.g., 'HR_MANAGEMENT', 'CMS', 'AUTH', 'SETTINGS'
        required: true
    },
    details: {
        type: String, // descriptive text
        required: true
    },
    ipAddress: {
        type: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed, // Storing IDs of affected records
        default: {}
    }
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
module.exports = ActivityLog;
