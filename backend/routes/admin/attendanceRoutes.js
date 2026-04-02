const express = require('express');
const router = express.Router();
const Attendance = require('../../models/admin/Attendance');
const MonthlyAttendance = require('../../models/admin/MonthlyAttendance');
const { adminAuth, requireRole } = require('../../middleware/admin/authMiddleware');

// Get all attendance for HR
router.get('/all', adminAuth, requireRole(['CEO', 'HR']), async (req, res) => {
    try {
        const records = await Attendance.find().populate('employee', 'name employeeId role department').sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Employee mark attendance (Check-in/Check-out)
router.post('/mark', adminAuth, async (req, res) => {
    try {
        const { status, checkInTime, checkOutTime, notes } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendance = await Attendance.findOne({ employee: req.employee.id, date: today });
        if (attendance) {
            if (status) attendance.status = status;
            if (checkOutTime) attendance.checkOutTime = checkOutTime;
            if (notes) attendance.notes = notes;
            await attendance.save();
        } else {
            attendance = new Attendance({
                employee: req.employee.id,
                date: today,
                status: status || 'Present',
                checkInTime: checkInTime || new Date(),
                notes
            });
            await attendance.save();
        }
        res.json({ success: true, attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// --- Monthly Summary Routes (HR/CEO) ---
router.get('/monthly', adminAuth, requireRole(['CEO', 'HR']), async (req, res) => {
    try {
        const records = await MonthlyAttendance.find().populate('employee', 'name employeeId role').sort({ year: -1, month: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/monthly', adminAuth, requireRole(['CEO', 'HR']), async (req, res) => {
    try {
        const { employee, month, year, lates, leaves, halfDays } = req.body;
        
        let record = await MonthlyAttendance.findOne({ employee, month, year });
        if (record) {
            record.lates = lates;
            record.leaves = leaves;
            record.halfDays = halfDays;
            await record.save();
        } else {
            record = new MonthlyAttendance({ employee, month, year, lates, leaves, halfDays });
            await record.save();
        }
        res.json({ success: true, record });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/monthly/:id', adminAuth, requireRole(['CEO', 'HR']), async (req, res) => {
    try {
        await MonthlyAttendance.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
