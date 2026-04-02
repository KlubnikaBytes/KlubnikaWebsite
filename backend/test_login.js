// Removed node-fetch
async function test() {
    // Let's create an employee through the hrController to be 100% sure we simulate CEO creating it
    // Wait, let's just make a mongoose call directly to create a test user
    const mongoose = require('mongoose');
    require('dotenv').config();
    const bcrypt = require('bcryptjs');
    const Employee = require('./models/admin/Employee');
    
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clean old test
    await Employee.deleteOne({ employeeId: 'TEST_PROMPT' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('initial123', salt);
    
    await Employee.create({
        employeeId: 'TEST_PROMPT',
        name: 'Test Prompt User',
        email: 'testprompt@klubnikabytes.com',
        role: 'HR',
        password: hashedPassword,
        status: 'Active',
        requiresPasswordChange: true
    });
    
    // Now simulate login via the login route (we'll just use http fetch to the actual running server)
    const rawUser = await Employee.findOne({ employeeId: 'TEST_PROMPT' }).lean();
    console.log('RAW USER requiresPasswordChange:', rawUser.requiresPasswordChange);

    const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'TEST_PROMPT', password: 'initial123', isTokenLogin: false })
    });
    
    const data = await res.json();
    console.log('LOGIN RESPONSE:', JSON.stringify(data, null, 2));
    
    await Employee.deleteOne({ employeeId: 'TEST_PROMPT' });
    process.exit(0);
}

test();
