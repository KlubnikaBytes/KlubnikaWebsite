const { EmployeeDocument, SINGLE_UPLOAD_TYPES, HR_UPLOAD_TYPES } = require('../../models/admin/EmployeeDocument');
const Employee = require('../../models/admin/Employee');
const Notification = require('../../models/admin/Notification');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

// Helper — create a notification
const createNotification = async (recipientId, title, message, link = '') => {
    try {
        await Notification.create({ recipient: recipientId, title, message, link });
    } catch (err) {
        console.error('Notification creation failed:', err.message);
    }
};

// ── EMPLOYEE: Upload or replace a document ──────────────────────────────────
const uploadDocument = async (req, res) => {
    try {
        const { documentType, fileName, mimeType, fileData } = req.body;

        if (!documentType || !fileName || !mimeType || !fileData) {
            return res.status(400).json({ message: 'documentType, fileName, mimeType and fileData are required.' });
        }

        // Validate mime type
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            return res.status(400).json({ message: 'Only PDF, JPG, and PNG files are allowed.' });
        }

        // Validate file size from base64 (base64 size ≈ raw * 4/3)
        const rawSize = Math.ceil((fileData.length * 3) / 4);
        if (rawSize > MAX_FILE_SIZE) {
            return res.status(400).json({ message: 'File size must not exceed 5MB.' });
        }

        const isSingleType = SINGLE_UPLOAD_TYPES.includes(documentType);

        if (isSingleType) {
            // Replace existing if already uploaded
            const existing = await EmployeeDocument.findOne({
                employee: req.employee._id,
                documentType,
            });

            if (existing) {
                // Replace: update fields and reset to pending
                existing.fileName = fileName;
                existing.mimeType = mimeType;
                existing.fileData = fileData;
                existing.fileSize = rawSize;
                existing.status = 'pending';
                existing.remark = '';
                existing.uploadedAt = new Date();
                existing.verifiedBy = null;
                existing.verifiedAt = null;
                await existing.save();

                // Notify HR about re-upload
                await notifyAllHR(
                    `Document Re-uploaded`,
                    `${req.employee.name} re-uploaded their ${documentType}. Please review.`,
                    '/admin/hr/documents'
                );

                return res.status(200).json({ message: 'Document replaced successfully.', document: sanitize(existing) });
            }
        }

        // New upload
        const doc = await EmployeeDocument.create({
            employee: req.employee._id,
            documentType,
            fileName,
            mimeType,
            fileData,
            fileSize: rawSize,
        });

        // Notify HR about the new upload
        await notifyAllHR(
            `New Document Uploaded`,
            `${req.employee.name} uploaded their ${documentType}. Please review.`,
            '/admin/hr/documents'
        );

        return res.status(201).json({ message: 'Document uploaded successfully.', document: sanitize(doc) });
    } catch (err) {
        console.error('uploadDocument error:', err);
        res.status(500).json({ message: 'Error uploading document.', error: err.message });
    }
};

// ── EMPLOYEE: Get own documents ─────────────────────────────────────────────
const getMyDocuments = async (req, res) => {
    try {
        const docs = await EmployeeDocument.find({ employee: req.employee._id })
            .sort({ documentType: 1, uploadedAt: -1 })
            .lean();
        res.status(200).json(docs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching documents.', error: err.message });
    }
};

// ── EMPLOYEE: Delete own pending document ───────────────────────────────────
const deleteDocument = async (req, res) => {
    try {
        const doc = await EmployeeDocument.findOne({ _id: req.params.id, employee: req.employee._id });
        if (!doc) return res.status(404).json({ message: 'Document not found.' });
        if (doc.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending documents can be deleted.' });
        }
        await doc.deleteOne();
        res.status(200).json({ message: 'Document deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting document.', error: err.message });
    }
};

// ── HR/CEO: Summary list of all employees with doc counts (role-filtered) ───
const getAllEmployeesDocSummary = async (req, res) => {
    try {
        const requesterRole = req.employee.role;

        // HR sees Employee, Digital Marketing Manager, and other HR — but NOT CEO
        // CEO sees everyone
        const roleFilter = requesterRole === 'CEO'
            ? { status: { $in: ['Active', 'Onboarding'] } }
            : { status: { $in: ['Active', 'Onboarding'] }, role: { $ne: 'CEO' } };

        const employees = await Employee.find(roleFilter)
            .select('employeeId name email role designation status')
            .lean();

        const docs = await EmployeeDocument.find({})
            .select('employee status')
            .lean();

        // Build a map: employeeId -> counts
        const countMap = {};
        docs.forEach(d => {
            const key = d.employee.toString();
            if (!countMap[key]) countMap[key] = { total: 0, pending: 0, verified: 0, rejected: 0 };
            countMap[key].total++;
            countMap[key][d.status]++;
        });

        const result = employees.map(emp => ({
            ...emp,
            docCounts: countMap[emp._id.toString()] || { total: 0, pending: 0, verified: 0, rejected: 0 },
        }));

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employee summary.', error: err.message });
    }
};

// ── HR/CEO: Get all documents for a specific employee (no fileData) ────────
const getEmployeeDocuments = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.empId).select('-password').lean();
        if (!employee) return res.status(404).json({ message: 'Employee not found.' });

        // HR cannot access CEO's documents
        if (req.employee.role === 'HR' && employee.role === 'CEO') {
            return res.status(403).json({ message: 'Access denied: HR cannot view CEO documents.' });
        }

        const docs = await EmployeeDocument.find({ employee: req.params.empId })
            .select('-fileData') // exclude raw file data from listing
            .populate('verifiedBy', 'name employeeId')
            .populate('uploadedBy', 'name role')
            .sort({ documentType: 1, uploadedAt: -1 })
            .lean();

        res.status(200).json({ employee, documents: docs });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employee documents.', error: err.message });
    }
};

// ── HR/CEO: Get file data for viewing a single document ───────────────────
const getDocumentFile = async (req, res) => {
    try {
        const doc = await EmployeeDocument.findById(req.params.id).lean();
        if (!doc) return res.status(404).json({ message: 'Document not found.' });

        const isOwner = doc.employee.toString() === req.employee._id.toString();
        const isHRorCEO = ['HR', 'CEO'].includes(req.employee.role);

        if (!isOwner && !isHRorCEO) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // HR cannot view files belonging to a CEO employee
        if (req.employee.role === 'HR') {
            const fileOwner = await Employee.findById(doc.employee).select('role').lean();
            if (fileOwner && fileOwner.role === 'CEO') {
                return res.status(403).json({ message: 'Access denied: HR cannot view CEO documents.' });
            }
        }

        res.status(200).json({ fileData: doc.fileData, mimeType: doc.mimeType, fileName: doc.fileName });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching document file.', error: err.message });
    }
};

// ── HR/CEO: Verify (approve / reject) a document ──────────────────────────
const verifyDocument = async (req, res) => {
    try {
        const { status, remark } = req.body;

        if (!['verified', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be "verified" or "rejected".' });
        }
        if (status === 'rejected' && (!remark || !remark.trim())) {
            return res.status(400).json({ message: 'A remark is required when rejecting a document.' });
        }

        const doc = await EmployeeDocument.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found.' });

        // HR cannot verify CEO employee documents
        if (req.employee.role === 'HR') {
            const fileOwner = await Employee.findById(doc.employee).select('role').lean();
            if (fileOwner && fileOwner.role === 'CEO') {
                return res.status(403).json({ message: 'Access denied: HR cannot verify CEO documents.' });
            }
        }

        doc.status = status;
        doc.remark = remark ? remark.trim() : '';
        doc.verifiedBy = req.employee._id;
        doc.verifiedAt = new Date();
        await doc.save();

        // Notify the employee
        const statusLabel = status === 'verified' ? '✅ Verified' : '❌ Rejected';
        const remarkNote = remark ? ` Remark: "${remark.trim()}"` : '';
        await createNotification(
            doc.employee,
            `Document ${statusLabel}`,
            `Your ${doc.documentType} has been ${status} by HR.${remarkNote}`,
            '/admin/documents'
        );

        res.status(200).json({ message: `Document ${status}.`, document: sanitize(doc) });
    } catch (err) {
        res.status(500).json({ message: 'Error verifying document.', error: err.message });
    }
};

// ── HR/CEO: Upload a joining/professional document for an employee ─────────
const uploadDocumentForEmployee = async (req, res) => {
    try {
        const { documentType, fileName, mimeType, fileData } = req.body;
        const { empId } = req.params;

        if (!documentType || !fileName || !mimeType || !fileData) {
            return res.status(400).json({ message: 'documentType, fileName, mimeType and fileData are required.' });
        }

        // Only HR-upload types allowed via this route
        if (!HR_UPLOAD_TYPES.includes(documentType)) {
            return res.status(400).json({ message: `"${documentType}" is not a valid HR-uploadable document type.` });
        }

        // Validate mime type
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            return res.status(400).json({ message: 'Only PDF, JPG, and PNG files are allowed.' });
        }

        // Validate file size from base64
        const rawSize = Math.ceil((fileData.length * 3) / 4);
        if (rawSize > MAX_FILE_SIZE) {
            return res.status(400).json({ message: 'File size must not exceed 5MB.' });
        }

        // Validate that the target employee exists
        const targetEmployee = await Employee.findById(empId).select('role name').lean();
        if (!targetEmployee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        // HR cannot upload documents for CEO
        if (req.employee.role === 'HR' && targetEmployee.role === 'CEO') {
            return res.status(403).json({ message: 'Access denied: HR cannot upload documents for CEO.' });
        }

        const uploaderRole = req.employee.role.toLowerCase(); // 'hr' or 'ceo'

        const doc = await EmployeeDocument.create({
            employee: empId,
            documentType,
            fileName,
            mimeType,
            fileData,
            fileSize: rawSize,
            status: 'verified', // HR/CEO uploaded docs are auto-verified
            uploadedBy: req.employee._id,
            uploadedByRole: uploaderRole,
        });

        // Notify the employee
        await createNotification(
            empId,
            `📄 New Document Added`,
            `${req.employee.name} (${req.employee.role}) added a "${documentType}" to your documents.`,
            '/admin/documents'
        );

        return res.status(201).json({ message: 'Document uploaded for employee successfully.', document: sanitize(doc) });
    } catch (err) {
        console.error('uploadDocumentForEmployee error:', err);
        res.status(500).json({ message: 'Error uploading document for employee.', error: err.message });
    }
};

// ── Helpers ────────────────────────────────────────────────────────────────
const sanitize = (doc) => {
    const obj = doc.toObject ? doc.toObject() : { ...doc };
    delete obj.fileData; // never send file data back unless explicitly requested
    return obj;
};

const notifyAllHR = async (title, message, link) => {
    try {
        const hrEmployees = await Employee.find({ role: { $in: ['HR', 'CEO'] } }).select('_id').lean();
        await Promise.all(hrEmployees.map(hr => createNotification(hr._id, title, message, link)));
    } catch (err) {
        console.error('notifyAllHR error:', err.message);
    }
};

module.exports = {
    uploadDocument,
    getMyDocuments,
    deleteDocument,
    getAllEmployeesDocSummary,
    getEmployeeDocuments,
    getDocumentFile,
    verifyDocument,
    uploadDocumentForEmployee,
};
