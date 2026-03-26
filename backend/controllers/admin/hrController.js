const Employee = require('../../models/admin/Employee');
const ActivityLog = require('../../models/admin/ActivityLog');
const Department = require('../../models/admin/Department');

// Get all employees (HR & CEO only)
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().select('-password').populate('department', 'name');
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error in getEmployees:", error);
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};

// Create a new employee (HR & CEO only)
const createEmployee = async (req, res) => {
    try {
        const { employeeId, name, email, role, designation, department } = req.body;
        
        // HR cannot create CEO or other HR (unless CEO)
        if (req.employee.role === 'HR' && (role === 'CEO' || role === 'HR')) {
            return res.status(403).json({ message: 'HR cannot create CEO or HR roles' });
        }

        const existing = await Employee.findOne({ $or: [{ employeeId }, { email }] });
        if (existing) {
             return res.status(400).json({ message: 'Employee with this ID or Email already exists' });
        }

        const newEmployee = await Employee.create({
            employeeId, name, email, role, designation, department, status: 'Onboarding'
        });

        await ActivityLog.create({
            employee: req.employee._id,
            action: 'CREATED_EMPLOYEE',
            module: 'HR_MANAGEMENT',
            details: `Created new employee ${name} (${employeeId})`
        });

        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });

    } catch (error) {
        console.error("Error in createEmployee:", error);
        res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
};

// Update employee (HR & CEO only)
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Prevent password update through this route
        delete updates.password;

        const targetEmployee = await Employee.findById(id);
        
        if (!targetEmployee) return res.status(404).json({ message: 'Employee not found' });

        if (req.employee.role === 'HR' && targetEmployee.role === 'CEO') {
             return res.status(403).json({ message: 'HR cannot edit CEO profile' });
        }

        const updated = await Employee.findByIdAndUpdate(id, updates, { new: true }).select('-password');
        
        await ActivityLog.create({
            employee: req.employee._id,
            action: 'UPDATED_EMPLOYEE',
            module: 'HR_MANAGEMENT',
            details: `Updated info for ${targetEmployee.employeeId}`
        });

        res.status(200).json({ message: 'Employee updated', employee: updated });

    } catch (error) {
         res.status(500).json({ message: 'Error updating employee' });
    }
};

// Delete employee (CEO and HR)
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const target = await Employee.findById(id);
        if (!target) return res.status(404).json({ message: 'Employee not found' });
        
        // Prevent removing yourself
        if (target._id.toString() === req.employee._id.toString()) {
            return res.status(400).json({ message: 'You cannot remove yourself.' });
        }

        // HR cannot remove CEO or other HR
        if (req.employee.role === 'HR' && (target.role === 'CEO' || target.role === 'HR')) {
            return res.status(403).json({ message: 'HR cannot remove CEO or other HR accounts.' });
        }

        await Employee.findByIdAndDelete(id);

        await ActivityLog.create({
            employee: req.employee._id,
            action: 'REMOVED_EMPLOYEE',
            module: 'HR_MANAGEMENT',
            details: `Removed employee ${target.name} (${target.employeeId})`
        });

        res.status(200).json({ message: 'Employee removed successfully.' });

    } catch (error) {
        console.error('Error in deleteEmployee:', error);
        res.status(500).json({ message: 'Error removing employee', error: error.message });
    }
};

// Get my own profile
const getMyProfile = async (req, res) => {
    try {
        const emp = await Employee.findById(req.employee._id).select('-password');
        if (!emp) return res.status(404).json({ message: 'Profile not found' });
        res.status(200).json(emp);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// Update my own profile
const updateMyProfile = async (req, res) => {
    try {
        const allowedFields = ['phone', 'bio', 'skills', 'linkedIn', 'github', 'portfolio', 'location', 'emergencyContact'];
        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const updated = await Employee.findByIdAndUpdate(
            req.employee._id,
            updates,
            { new: true }
        ).select('-password');

        res.status(200).json({ message: 'Profile updated', employee: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getMyProfile,
    updateMyProfile
};
