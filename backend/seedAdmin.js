require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/admin/Employee');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Check if CEO already exists
        let ceo = await Employee.findOne({ role: 'CEO' });

        if (ceo) {
            console.log('CEO already exists. Updating details...');
            ceo.employeeId = 'KB_CEO';
            ceo.email = 'nguria7@gmail.com';
            ceo.name = 'Klubnika CEO';
            ceo.status = 'Active';
            await ceo.save();
        } else {
            console.log('Creating initial CEO account...');
            ceo = await Employee.create({
                employeeId: 'KB_CEO',
                name: 'Klubnika CEO',
                email: 'nguria7@gmail.com',
                role: 'CEO',
                status: 'Active'
            });
        }
        console.log('✅ CEO Configured! Employee ID: KB_CEO, Email: nguria7@gmail.com');

        // Note: HR will be created via the CEO from the frontend dashboard
        // I won't create them here so you can test the flow!

        process.exit(0);
    } catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};

seedAdmin();
