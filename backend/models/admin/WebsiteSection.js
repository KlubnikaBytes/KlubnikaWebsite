const mongoose = require('mongoose');

const websiteSectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    page: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WebsitePage',
        default: null // Can be global or page-specific
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        default: {} 
    },
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    },
    lastEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee'
    }
}, { timestamps: true });

const WebsiteSection = mongoose.model('WebsiteSection', websiteSectionSchema);
module.exports = WebsiteSection;
