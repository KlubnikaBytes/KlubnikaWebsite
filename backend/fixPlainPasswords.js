/**
 * fixPlainPasswords.js
 * Resets all employees with bcrypt-hashed passwords to a plain-text default.
 * Run: node fixPlainPasswords.js
 */

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://klubnikabytes_db_user:ajZRuMUVF4c5asYQ@cluster0.kznlmrn.mongodb.net/?appName=Cluster0';
const DEFAULT_PLAIN_PASSWORD = 'Welcome@123';

const employeeSchema = new mongoose.Schema({
    employeeId: String,
    name: String,
    email: String,
    password: String,
    plainPassword: { type: String, default: null },
    requiresPasswordChange: Boolean,
    role: String,
    status: String,
    passwordChangedAt: Date
}, { strict: false });

async function fixPasswords() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!\n');

    const Employee = mongoose.model('AdminEmployee', employeeSchema);

    const all = await Employee.find({});
    let fixed = 0;

    for (const emp of all) {
        const pw = emp.password;
        let changed = false;

        if (pw && (pw.startsWith('$2a$') || pw.startsWith('$2b$'))) {
            // Bcrypt hashed — reset to known plain text
            emp.password = DEFAULT_PLAIN_PASSWORD;
            emp.plainPassword = DEFAULT_PLAIN_PASSWORD;
            emp.requiresPasswordChange = true;
            changed = true;
            console.log(`✅ Reset: ${emp.employeeId} (${emp.name}) → "${DEFAULT_PLAIN_PASSWORD}"`);
        } else if (pw && !emp.plainPassword) {
            // Plain text but no plainPassword field — sync it
            emp.plainPassword = pw;
            changed = true;
            console.log(`📋 Synced plainPassword for: ${emp.employeeId} (${emp.name}) → "${pw}"`);
        }

        if (changed) {
            await emp.save();
            fixed++;
        }
    }

    console.log(`\nDone! Updated ${fixed} record(s).`);
    if (fixed > 0) {
        console.log(`\n⚠️  Employees with reset passwords now have: "${DEFAULT_PLAIN_PASSWORD}"`);
        console.log('   They will be asked to change it on next login.\n');
    }
    await mongoose.disconnect();
    process.exit(0);
}

fixPasswords().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
