const mongoose = require('mongoose');
require('dotenv').config();

const Employee = require('./models/admin/Employee');

async function fixUsers() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Update all users who don't have the field yet
    const result = await Employee.updateMany(
        { requiresPasswordChange: { $exists: false } },
        { $set: { requiresPasswordChange: true } }
    );
    
    console.log(`Updated ${result.modifiedCount} employees.`);
    process.exit(0);
}

fixUsers();
