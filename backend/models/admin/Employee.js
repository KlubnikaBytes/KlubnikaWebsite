const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false // Optional initially, since it is set on first login for everyone but CEO
    },
    role: {
        type: String,
        required: true,
        enum: ['CEO', 'HR', 'Digital Marketing Manager', 'Employee'],
        default: 'Employee'
    },
    designation: {
        type: String,
        trim: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        default: null
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Onboarding', 'Suspended'],
        default: 'Onboarding'
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    passwordChangedAt: {
        type: Date,
        default: null
    },
    // Profile Fields (editable by employee)
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    linkedIn: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    location: { type: String, default: '' },
    emergencyContact: { type: String, default: '' }
}, { timestamps: true });

const Employee = mongoose.model('AdminEmployee', employeeSchema);
module.exports = Employee;
