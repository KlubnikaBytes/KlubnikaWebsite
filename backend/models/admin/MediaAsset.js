const mongoose = require('mongoose');

const mediaAssetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Image', 'Video', 'Document', 'Other'],
        default: 'Image'
    },
    size: {
        type: Number, // In bytes
        default: 0
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee'
    }
}, { timestamps: true });

const MediaAsset = mongoose.model('MediaAsset', mediaAssetSchema);
module.exports = MediaAsset;
