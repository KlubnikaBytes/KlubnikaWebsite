const path = require('path');
const dns = require('dns');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Employee = require('./models/admin/Employee');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
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

        // Configure HR / Admin Account from .env
        const bcrypt = require('bcryptjs');
        const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'hr@klubnikabytes.com').trim().toLowerCase();
        const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'HR@KB';
        const adminRole = process.env.ADMIN_DEFAULT_ROLE || 'HR';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        let hrAdmin = await Employee.findOne({ email: adminEmail });
        if (hrAdmin) {
            console.log(`HR/Admin already exists (${adminEmail}). Updating credentials...`);
            hrAdmin.password = hashedPassword;
            hrAdmin.plainPassword = adminPassword;
            hrAdmin.status = 'Active';
            hrAdmin.requiresPasswordChange = false;
            hrAdmin.role = adminRole;
            await hrAdmin.save();
        } else {
            console.log(`Creating initial HR/Admin account (${adminEmail})...`);
            hrAdmin = await Employee.create({
                employeeId: 'KB_HR_ADMIN',
                name: 'Klubnika HR & Admin',
                email: adminEmail,
                role: adminRole,
                status: 'Active',
                requiresPasswordChange: false,
                password: hashedPassword,
                plainPassword: adminPassword,
                designation: 'HR & Administrative Operations'
            });
        }
        console.log(`✅ HR/Admin configured! Email: ${adminEmail}, Password: ${adminPassword}, Role: ${adminRole}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};

seedAdmin();
