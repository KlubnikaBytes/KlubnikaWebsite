const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminEmployee',
        default: null
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
