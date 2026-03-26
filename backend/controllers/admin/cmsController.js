const WebsitePage = require('../../models/admin/WebsitePage');
const WebsiteSection = require('../../models/admin/WebsiteSection');
const MediaAsset = require('../../models/admin/MediaAsset');
const ActivityLog = require('../../models/admin/ActivityLog');

// Get all pages
const getPages = async (req, res) => {
    try {
        const pages = await WebsitePage.find().sort({ createdAt: -1 });
        res.status(200).json(pages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pages' });
    }
};

// Create a draft page
const createPage = async (req, res) => {
    try {
        const { title, slug } = req.body;
        
        const existing = await WebsitePage.findOne({ slug });
        if (existing) return res.status(400).json({ message: 'Slug already exists' });

        const newPage = await WebsitePage.create({
            title, slug, lastEditedBy: req.employee._id
        });

        await ActivityLog.create({
            employee: req.employee._id,
            action: 'CREATED_PAGE',
            module: 'CMS',
            details: `Created new draft page: ${title}`
        });

        res.status(201).json({ message: 'Page created under drafts', page: newPage });

    } catch (error) {
         res.status(500).json({ message: 'Error creating page' });
    }
};

// Update and Publish
const updatePage = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // { content, seoMeta, status }

        const page = await WebsitePage.findById(id);
        if (!page) return res.status(404).json({ message: 'Page not found' });

        if (updates.status === 'Published' && page.status !== 'Published') {
            updates.publishedAt = new Date();
             await ActivityLog.create({
                employee: req.employee._id,
                action: 'PUBLISHED_PAGE',
                module: 'CMS',
                details: `Published page: ${page.title}`
            });
        } else {
             await ActivityLog.create({
                employee: req.employee._id,
                action: 'UPDATED_PAGE_DRAFT',
                module: 'CMS',
                details: `Updated draft for: ${page.title}`
            });
        }

        updates.lastEditedBy = req.employee._id;
        const updated = await WebsitePage.findByIdAndUpdate(id, updates, { new: true });
        
        res.status(200).json({ message: 'Page updated', page: updated });

    } catch (error) {
        res.status(500).json({ message: 'Error updating page' });
    }
}

// --- Sections ---

const getSectionByName = async (req, res) => {
    try {
        const { name } = req.params;
        const section = await WebsiteSection.findOne({ name });
        if (!section) return res.status(404).json({ message: 'Section not found' });
        res.status(200).json(section);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching section' });
    }
};

const upsertSection = async (req, res) => {
    try {
        const { name } = req.params;
        const { content, status } = req.body;

        const updated = await WebsiteSection.findOneAndUpdate(
            { name },
            { content, status, lastEditedBy: req.employee._id },
            { new: true, upsert: true }
        );

        await ActivityLog.create({
            employee: req.employee._id,
            action: 'UPDATED_SECTION',
            module: 'CMS',
            details: `Updated section: ${name}`
        });

        res.status(200).json({ message: 'Section saved', section: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error saving section' });
    }
};

// --- Media ---

const getMedia = async (req, res) => {
    try {
        const media = await MediaAsset.find().sort({ createdAt: -1 });
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching media' });
    }
};

const createMedia = async (req, res) => {
    try {
        const { name, url, type } = req.body;
        
        const newMedia = await MediaAsset.create({
            name, url, type, uploadedBy: req.employee._id
        });

        await ActivityLog.create({
            employee: req.employee._id,
            action: 'UPLOADED_MEDIA',
            module: 'CMS',
            details: `Added media asset: ${name}`
        });

        res.status(201).json({ message: 'Media added', media: newMedia });
    } catch (error) {
        res.status(500).json({ message: 'Error adding media' });
    }
};

module.exports = {
    getPages,
    createPage,
    updatePage,
    getSectionByName,
    upsertSection,
    getMedia,
    createMedia
};
