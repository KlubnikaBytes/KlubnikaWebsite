require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    const Employee = require('./models/admin/Employee');
    const hr = await Employee.findOne({ role: 'HR' });
    
    const token = jwt.sign(
        { id: hr._id, role: hr.role, userType: 'Admin' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1h' }
    );
    
    console.log('Fetching with token...');
    const res = await fetch('http://localhost:5000/api/admin/leaves/all', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('API Status:', res.status);
    const data = await res.json();
    console.log(`HR sees ${data.length} records.`);
    if (data.length > 0) console.log(data);
    process.exit(0);
}
test();
