const mongoose = require('mongoose');

const websitePageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Archived'],
        default: 'Draft'
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        default: {} // Can store complex JSON structures for blocks
    },
    seoMeta: {
        title: String,
        description: String,
        keywords: String
    },
    lastEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee'
    },
    publishedAt: {
        type: Date
    }
}, { timestamps: true });

const WebsitePage = mongoose.model('WebsitePage', websitePageSchema);
module.exports = WebsitePage;
