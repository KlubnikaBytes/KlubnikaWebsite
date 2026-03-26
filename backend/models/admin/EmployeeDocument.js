const mongoose = require('mongoose');

// Document types that employees can upload themselves
const SINGLE_UPLOAD_TYPES = [
    'Aadhaar Card',
    'PAN Card',
    'Bank Details Document',
    '10th Marksheet',
    '12th Marksheet',
    'Degree Certificate',
    'Profile Photo',
    'Experience Proof',
    'Internship Certificate',
];

// Document types that HR/CEO upload on behalf of employees (joining/professional docs)
const HR_UPLOAD_TYPES = [
    'Offer Letter',
    'Appointment Letter',
    'Employment Contract',
    'Joining Form',
    'Salary Slip',
    'Increment Letter',
    'Warning Letter',
    'Relieving Letter',
    'Experience Letter',
];

const ALL_DOCUMENT_TYPES = [...SINGLE_UPLOAD_TYPES, 'Semester Results', ...HR_UPLOAD_TYPES];

const employeeDocumentSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        required: true,
        index: true,
    },
    documentType: {
        type: String,
        required: true,
        enum: ALL_DOCUMENT_TYPES,
    },
    fileName: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number, // bytes
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    fileData: {
        type: String, // base64 encoded file content
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
    },
    remark: {
        type: String,
        default: '',
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        default: null,
    },
    verifiedAt: {
        type: Date,
        default: null,
    },
    // Who uploaded this document
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        default: null, // null means the employee uploaded themselves
    },
    uploadedByRole: {
        type: String,
        enum: ['self', 'hr', 'ceo'],
        default: 'self',
    },
}, { timestamps: true });

const EmployeeDocument = mongoose.model('EmployeeDocument', employeeDocumentSchema);

module.exports = { EmployeeDocument, SINGLE_UPLOAD_TYPES, ALL_DOCUMENT_TYPES, HR_UPLOAD_TYPES };
