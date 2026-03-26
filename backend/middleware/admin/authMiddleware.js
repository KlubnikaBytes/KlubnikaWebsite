const jwt = require('jsonwebtoken');
const Employee = require('../../models/admin/Employee');

// General Authentication for Admin Portal
const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        
        // Ensure the token belongs to an AdminEmployee, not a regular user
        if (decoded.userType !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized for Admin Portal' });
        }
        
        const employee = await Employee.findById(decoded.id).select('-password');
        
        if (!employee) {
            return res.status(401).json({ message: 'Employee not found' });
        }
        
        if (employee.status !== 'Active' && employee.status !== 'Onboarding') {
            return res.status(403).json({ message: 'Account is not active' });
        }
        
        req.employee = employee;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Role-Based Access Control Middleware
// Usage: router.get('/cms', adminAuth, requireRole(['CEO', 'Digital Marketing Manager']), controller);
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.employee || !allowedRoles.includes(req.employee.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }
        next();
    };
};

module.exports = { adminAuth, requireRole };
