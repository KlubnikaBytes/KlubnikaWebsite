require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const testApi = async () => {
    // Generate an HR token
    const tokenOptions = { expiresIn: '8h' };
    
    await mongoose.connect(process.env.MONGO_URI);
    const Employee = require('./backend/models/admin/Employee');
    const hr = await Employee.findOne({ role: 'HR' });
    const ceo = await Employee.findOne({ role: 'CEO' });
    const emp = await Employee.findOne({ role: 'Employee' });

    console.log('--- USERS ---');
    console.log('HR:', hr._id);
    console.log('CEO:', ceo._id);
    console.log('EMP:', emp._id);

    const generateToken = (user) => {
        return jwt.sign(
            { id: user._id, role: user.role, email: user.email, userType: 'Admin' },
            process.env.JWT_SECRET || 'fallback_secret',
            tokenOptions
        );
    };

    const hrToken = generateToken(hr);
    const empToken = generateToken(emp);
    const ceoToken = generateToken(ceo);

    // Apply Leave as Employee
    console.log('\n--- Employee Applying for Leave ---');
    const applyRes = await fetch('http://localhost:5000/api/admin/leaves/apply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${empToken}`
        },
        body: JSON.stringify({ type: 'Casual', startDate: '2026-05-01', endDate: '2026-05-02', reason: 'Test API' })
    });
    console.log('Apply Status:', applyRes.status);
    const applyData = await applyRes.json();
    console.log('Apply Response:', applyData.message);

    // HR Fetches All Leaves
    console.log('\n--- HR Fetching All Leaves ---');
    const hrFetchRes = await fetch('http://localhost:5000/api/admin/leaves/all', {
        headers: { 'Authorization': `Bearer ${hrToken}` }
    });
    console.log('HR Fetch Status:', hrFetchRes.status);
    const hrLeaves = await hrFetchRes.json();
    if (hrFetchRes.status === 200) {
        console.log(`HR sees ${hrLeaves.length} leaves. IDs:`, hrLeaves.map(l => l.employee._id));
    } else {
        console.log('HR Fetch Error:', hrLeaves);
    }
    
    // CEO Fetches All Leaves
    console.log('\n--- CEO Fetching All Leaves ---');
    const ceoFetchRes = await fetch('http://localhost:5000/api/admin/leaves/all', {
        headers: { 'Authorization': `Bearer ${ceoToken}` }
    });
    console.log('CEO Fetch Status:', ceoFetchRes.status);
    const ceoLeaves = await ceoFetchRes.json();
    if (ceoFetchRes.status === 200) {
        console.log(`CEO sees ${ceoLeaves.length} leaves.`);
    } else {
        console.log('CEO Fetch Error:', ceoLeaves);
    }

    process.exit(0);
};

testApi();
