require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/admin/Employee');
const LeaveRequest = require('./models/admin/LeaveRequest');

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const leaves = await LeaveRequest.find().populate('employee', 'name role');
        console.log('Total Leaves in DB:', leaves.length);
        
        leaves.forEach(l => {
            console.log(`- Type: ${l.type}, Status: ${l.status}`);
            console.log(`  Employee: ${l.employee ? l.employee.name + ' (' + l.employee.role + ')' : 'NULL / NOT FOUND'}`);
            console.log(`  Raw Employee ID: ${l.employee ? l.employee._id : 'N/A'}`);
        });

        // Test HR Query specifically
        const nonCeoEmployees = await Employee.find({ role: { $ne: 'CEO' } }).select('_id');
        const nonCeoIds = nonCeoEmployees.map(e => e._id);
        const hrLeaves = await LeaveRequest.find({ employee: { $in: nonCeoIds } });
        console.log(`\nHR Query Output length: ${hrLeaves.length}`);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
runTest();
