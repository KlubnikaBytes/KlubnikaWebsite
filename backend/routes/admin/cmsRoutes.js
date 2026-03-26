const express = require('express');
const router = express.Router();
const { getPages, createPage, updatePage, getSectionByName, upsertSection, getMedia, createMedia } = require('../../controllers/admin/cmsController');
const { adminAuth, requireRole } = require('../../middleware/admin/authMiddleware');

// Only CEO and Digital Marketing Manager can access CMS
router.use(adminAuth, requireRole(['CEO', 'Digital Marketing Manager']));

router.get('/pages', getPages);
router.post('/pages', createPage);
router.put('/pages/:id', updatePage);

// Sections (Homepage, Banners)
router.get('/sections/:name', getSectionByName);
router.put('/sections/:name', upsertSection);

// Media
router.get('/media', getMedia);
router.post('/media', createMedia);

module.exports = router;
