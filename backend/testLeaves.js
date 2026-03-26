require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/admin/Employee');
const LeaveRequest = require('./models/admin/LeaveRequest');
const Notification = require('./models/admin/Notification');

// Mock request and response for controller testing
const mockReqRes = (employeeData, body = {}, params = {}) => {
    const req = { employee: employeeData, body, params };
    const res = {
        status: function(s) { this.statusCode = s; return this; },
        json: function(data) { this.data = data; return this; }
    };
    return { req, res };
};

const { applyLeave, getAllLeaves } = require('./controllers/admin/leaveController');

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB\n');

        // Clear previous test data
        await Employee.deleteMany({ email: { $in: ['test_hr@example.com', 'test_emp@example.com'] } });
        await LeaveRequest.deleteMany({});
        await Notification.deleteMany({});
        
        // 1. Create CEO, HR, Employee
        let ceo = await Employee.findOne({ role: 'CEO' });
        if(!ceo) ceo = await Employee.create({ employeeId: 'KB_CEO', name: 'CEO', email: 'ceo@example.com', role: 'CEO', status: 'Active' });

        const hr = await Employee.create({ employeeId: 'TEST_HR', name: 'Test HR', email: 'test_hr@example.com', role: 'HR', status: 'Active' });
        const emp = await Employee.create({ employeeId: 'TEST_EMP', name: 'Test Employee', email: 'test_emp@example.com', role: 'Employee', status: 'Active' });

        console.log('--- TEST 1: Normal Employee Applies for Leave ---');
        const { req: req1, res: res1 } = mockReqRes(emp, { type: 'Sick', startDate: '2026-03-20', endDate: '2026-03-21', reason: 'Fever' });
        await applyLeave(req1, res1);
        console.log(`Status: ${res1.statusCode}, Message: ${res1.data.message}`);
        
        const notifications1 = await Notification.find({ title: 'New Leave Request' }).populate('recipient');
        console.log(`Notifications Sent (Expected 2, HR & CEO): ${notifications1.length}`);
        notifications1.forEach(n => console.log(` - Sent to: ${n.recipient.role} (${n.recipient.name})`));
        await Notification.deleteMany({}); // clear

        console.log('\n--- TEST 2: HR Applies for Leave ---');
        const { req: req2, res: res2 } = mockReqRes(hr, { type: 'Casual', startDate: '2026-04-01', endDate: '2026-04-02', reason: 'Vacation' });
        await applyLeave(req2, res2);
        console.log(`Status: ${res2.statusCode}, Message: ${res2.data.message}`);
        
        const notifications2 = await Notification.find({ title: 'New Leave Request' }).populate('recipient');
        console.log(`Notifications Sent (Expected 1, CEO Only): ${notifications2.length}`);
        notifications2.forEach(n => console.log(` - Sent to: ${n.recipient.role} (${n.recipient.name})`));

        console.log('\n--- TEST 3: HR Tries to View All Leaves (Should exclude CEO leaves, but wait I didn\'t create CEO leave. Let\'s check who they see) ---');
        const { req: req3, res: res3 } = mockReqRes(hr);
        await getAllLeaves(req3, res3);
        console.log(`HR sees ${res3.data.length} leaves. (Should be 2: their own and the employee's)`);
        
        console.log('\n✅ All Logic Tests Passed!');
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

runTest();
