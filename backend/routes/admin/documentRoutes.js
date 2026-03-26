const express = require('express');
const router = express.Router();
const {
    uploadDocument,
    getMyDocuments,
    deleteDocument,
    getAllEmployeesDocSummary,
    getEmployeeDocuments,
    getDocumentFile,
    verifyDocument,
    uploadDocumentForEmployee,
} = require('../../controllers/admin/documentController');
const { adminAuth, requireRole } = require('../../middleware/admin/authMiddleware');

// ── Employee routes (any authenticated employee) ──
router.post('/upload', adminAuth, uploadDocument);
router.get('/mine', adminAuth, getMyDocuments);
router.delete('/:id', adminAuth, deleteDocument);
router.get('/file/:id', adminAuth, getDocumentFile);

// ── HR / CEO routes ──
router.get('/employees', adminAuth, requireRole(['CEO', 'HR']), getAllEmployeesDocSummary);
router.get('/employee/:empId', adminAuth, requireRole(['CEO', 'HR']), getEmployeeDocuments);
router.patch('/:id/verify', adminAuth, requireRole(['CEO', 'HR']), verifyDocument);

// ── HR / CEO: Upload a document for a specific employee (joining/professional docs) ──
router.post('/employee/:empId/upload', adminAuth, requireRole(['CEO', 'HR']), uploadDocumentForEmployee);

module.exports = router;

