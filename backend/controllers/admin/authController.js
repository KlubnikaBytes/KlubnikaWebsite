const Employee = require('../../models/admin/Employee');
const OtpVerification = require('../../models/admin/OtpVerification');
const OnboardingToken = require('../../models/admin/OnboardingToken');
const ActivityLog = require('../../models/admin/ActivityLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Setup NodeMailer (Ensure environment variables are set later, or use mock for now)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper for JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role, userType: 'Admin' }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

// --- AUTH LOGIC ---

// 1. CEO Login - Step 1: Generate OTP Let's start with all regular login handling
const adminLogin = async (req, res) => {
    try {
        const { employeeId, password, isTokenLogin } = req.body;

        if (!employeeId) return res.status(400).json({ message: 'Employee ID is required' });

        const employee = await Employee.findOne({ employeeId });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        if (employee.status !== 'Active' && employee.status !== 'Onboarding') {
             return res.status(403).json({ message: 'Account suspended or inactive' });
        }

        // --- CEO FLOW ---
        if (employee.role === 'CEO') {
            // For CEO, no password needed initially, they use OTP
            // Generate 6-digit OTP
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Hash OTP before saving
            const salt = await bcrypt.genSalt(10);
            const hashedOtp = await bcrypt.hash(otpCode, salt);

            // Save OTP
            await OtpVerification.create({
                employeeId,
                email: employee.email,
                otp: hashedOtp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
            });

            // Send OTP emails
            try {
                if (process.env.EMAIL_USER) {

                    if (employee.email === 'nguria7@gmail.com') {
                        // Send 1st email → directly to nguria7@gmail.com
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: 'nguria7@gmail.com',
                            subject: 'Klubnika Bytes Admin - Login OTP',
                            text: `Your OTP for CEO login is: ${otpCode}. It expires in 10 minutes.`
                        });

                        // Send 2nd email → directly to msitcselab@gmail.com (completely separate)
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: 'msitcselab@gmail.com',
                            subject: 'Klubnika Bytes Admin - Login OTP',
                            text: `Your OTP for CEO login is: ${otpCode}. It expires in 10 minutes.`
                        });

                    } else {
                        // For any other CEO email, send only to their own email
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: employee.email,
                            subject: 'Klubnika Bytes Admin - Login OTP',
                            text: `Your OTP for CEO login is: ${otpCode}. It expires in 10 minutes.`
                        });
                    }

                } else {
                    // Dev mode — log to console
                    console.log(`[MOCK EMAIL → ${employee.email}] OTP: ${otpCode}`);
                    if (employee.email === 'nguria7@gmail.com') {
                        console.log(`[MOCK EMAIL → msitcselab@gmail.com] OTP: ${otpCode}`);
                    }
                }
            } catch (err) {
                console.error('Email send failed', err);
                // Continue even if email fails — OTP is still in DB
            }

            return res.status(200).json({ step: 'OTP_REQUIRED', message: 'OTP sent to CEO email', email: employee.email });
        }

        // --- TOKEN / FIRST TIME LOGIN FLOW (HR, Digital Marketing, Employee) ---
        if (isTokenLogin) {
            const { token } = req.body; // In this case, 'password' field in UI might send the token, or separate token field
            const tokenRecord = await OnboardingToken.findOne({ token, employeeId, isUsed: false, status: 'Active' });

            if (!tokenRecord) {
                return res.status(400).json({ message: 'Invalid or used onboarding token' });
            }

            if (tokenRecord.expiresAt < new Date()) {
                tokenRecord.status = 'Expired';
                await tokenRecord.save();
                return res.status(400).json({ message: 'Onboarding token has expired' });
            }

            // Valid token - user must reset password now. 
            // We return a temporary auth token just for password reset
            const resetToken = jwt.sign({ id: employee._id, role: employee.role, action: 'PASSWORD_SETUP' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '15m' });

            return res.status(200).json({ 
                step: 'SETUP_PASSWORD', 
                message: 'Token verified. Please set your password.',
                resetToken,
                tokenId: tokenRecord._id
            });
        }

        // --- STANDARD LOGIN FLOW (after password is set) ---
        if (!password) {
             return res.status(400).json({ message: 'Password is required' });
        }

        if (employee.status === 'Onboarding' || !employee.password) {
             return res.status(400).json({ message: 'Please use your onboarding token for first-time login' });
        }

        let isMatch = false;
        if (employee.password && (employee.password.startsWith('$2a$') || employee.password.startsWith('$2b$'))) {
            isMatch = await bcrypt.compare(password, employee.password);
        } else {
            isMatch = (password === employee.password);
        }
        
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        if (employee.requiresPasswordChange) {
            const resetToken = jwt.sign({ id: employee._id, role: employee.role, action: 'FORCE_PASSWORD_CHANGE' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '15m' });
            return res.status(200).json({
                step: 'REQUIRE_PASSWORD_CHANGE',
                message: 'You must change your initial password before continuing.',
                resetToken,
                user: { email: employee.email, name: employee.name, employeeId: employee.employeeId }
            });
        }

        // Success
        const authToken = generateToken(employee._id, employee.role);
        res.status(200).json({
            step: 'LOGIN_SUCCESS',
            token: authToken,
            user: { id: employee._id, name: employee.name, role: employee.role, employeeId: employee.employeeId }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// 2. CEO Verify OTP
const verifyCeoOtp = async (req, res) => {
    try {
        const { employeeId, otpCode } = req.body;
        if (!employeeId || !otpCode) return res.status(400).json({ message: 'Missing parameters' });

        const otpRecord = await OtpVerification.findOne({ employeeId, isUsed: false }).sort({ createdAt: -1 });
        
        if (!otpRecord) return res.status(400).json({ message: 'No active OTP found' });

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const isMatch = await bcrypt.compare(otpCode, otpRecord.otp);
        if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

        // Mark as used
        otpRecord.isUsed = true;
        await otpRecord.save();

        const employee = await Employee.findOne({ employeeId });
        
        // Success
        const authToken = generateToken(employee._id, employee.role);
        
        await ActivityLog.create({
            employee: employee._id,
            action: 'CEO_LOGIN',
            module: 'AUTH',
            details: 'CEO logged in successfully via OTP'
        });

        res.status(200).json({
            step: 'LOGIN_SUCCESS',
            token: authToken,
            user: { id: employee._id, name: employee.name, role: employee.role, employeeId: employee.employeeId }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error verifying OTP' });
    }
};

// 3. Setup Password (First login)
const setupPassword = async (req, res) => {
    try {
        // Must use the resetToken provided from adminLogin step
        const resetToken = req.header('Authorization')?.replace('Bearer ', '');
        const { newPassword, tokenId } = req.body;

        if (!resetToken || !newPassword || !tokenId) {
            return res.status(400).json({ message: 'Missing parameters' });
        }

        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'fallback_secret');
        if (decoded.action !== 'PASSWORD_SETUP') {
             return res.status(401).json({ message: 'Invalid token action' });
        }

        const employee = await Employee.findById(decoded.id);
        const tokenRecord = await OnboardingToken.findById(tokenId);

        if (!employee || !tokenRecord) {
             return res.status(404).json({ message: 'Records not found' });
        }

        // Do not hash password based on specific user request
        employee.password = newPassword;
        employee.plainPassword = newPassword; // Save plain text in DB for visibility
        employee.status = 'Active';
        employee.passwordChangedAt = new Date();
        employee.requiresPasswordChange = false;
        await employee.save();

        // Mark token used
        tokenRecord.isUsed = true;
        tokenRecord.status = 'Used';
        await tokenRecord.save();

        await ActivityLog.create({
            employee: employee._id,
            action: 'PASSWORD_SETUP',
            module: 'AUTH',
            details: `Employee ${employee.employeeId} setup their password and activated account.`
        });

        // Generate final auth token
        const authToken = generateToken(employee._id, employee.role);
        res.status(200).json({
            message: 'Password set successfully',
            token: authToken,
            user: { id: employee._id, name: employee.name, role: employee.role, employeeId: employee.employeeId }
        });

    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token expired or invalid', error: error.message });
    }
};

// 4. Generate Onboarding Token (Admin only)
const generateOnboardingToken = async (req, res) => {
    try {
        const { targetEmployeeId } = req.body;
        const generatedBy = req.employee._id; // from auth middleware

        const targetEmployee = await Employee.findById(targetEmployeeId);
        if (!targetEmployee) return res.status(404).json({ message: 'Target employee not found' });

        // HR cannot generate tokens for CEO. CEO can do everything.
        if (req.employee.role === 'HR' && targetEmployee.role === 'CEO') {
            return res.status(403).json({ message: 'HR cannot generate tokens for CEO' });
        }

        const tokenString = crypto.randomBytes(16).toString('hex');

        const newToken = await OnboardingToken.create({
            token: tokenString,
            employeeId: targetEmployee.employeeId,
            role: targetEmployee.role,
            createdBy: generatedBy,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
        });

        await ActivityLog.create({
            employee: generatedBy,
            action: 'TOKEN_GENERATED',
            module: 'AUTH',
            details: `Generated onboarding token for ${targetEmployee.employeeId}`
        });

        res.status(201).json({
            message: 'Token generated successfully',
            token: newToken.token,
            expiresAt: newToken.expiresAt
        });

    } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Server error generating token' });
    }
};

// 5. Change Initial Password (Forced on first login)
const changeInitialPassword = async (req, res) => {
    try {
        const resetToken = req.header('Authorization')?.replace('Bearer ', '');
        const { newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: 'Missing parameters' });
        }

        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'fallback_secret');
        if (decoded.action !== 'FORCE_PASSWORD_CHANGE') {
             return res.status(401).json({ message: 'Invalid token action' });
        }

        const employee = await Employee.findById(decoded.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        employee.password = newPassword; // Store exact string based on user request
        employee.plainPassword = newPassword; // Save plain text in DB for visibility
        employee.requiresPasswordChange = false;
        employee.passwordChangedAt = new Date();
        employee.status = 'Active';
        await employee.save();

        await ActivityLog.create({
            employee: employee._id,
            action: 'PASSWORD_CHANGED',
            module: 'AUTH',
            details: `Employee ${employee.employeeId} completed required initial password change.`
        });

        const authToken = generateToken(employee._id, employee.role);
        res.status(200).json({
            message: 'Password set successfully',
            token: authToken,
            user: { id: employee._id, name: employee.name, role: employee.role, employeeId: employee.employeeId }
        });
    } catch (error) {
        res.status(401).json({ message: 'Token expired or invalid', error: error.message });
    }
};

// 6. Forgot Password (Generate OTP)
const forgotPassword = async (req, res) => {
    try {
        const { employeeId } = req.body;
        if (!employeeId) return res.status(400).json({ message: 'Employee ID or Email is required' });

        const employee = await Employee.findOne({ 
            $or: [{ employeeId: employeeId }, { email: employeeId.toLowerCase() }] 
        });

        if (!employee || employee.status === 'Suspended') {
            return res.status(404).json({ message: 'Employee not found or suspended' });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otpCode, salt);

        await OtpVerification.create({
            employeeId: employee.employeeId,
            email: employee.email,
            otp: hashedOtp,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
        });

        console.log(`[MOCK EMAIL] Password Reset OTP for ${employee.email}: ${otpCode}`);

        res.status(200).json({ message: 'If an account exists, a reset OTP has been sent via email.', email: employee.email, employeeId: employee.employeeId });

    } catch (error) {
        res.status(500).json({ message: 'Server error generating reset token' });
    }
};

// 7. Reset Password (using OTP)
const resetPassword = async (req, res) => {
    try {
        const { employeeId, otpCode, newPassword } = req.body;
        if (!employeeId || !otpCode || !newPassword) return res.status(400).json({ message: 'Missing parameters' });

        const otpRecord = await OtpVerification.findOne({ employeeId, isUsed: false }).sort({ createdAt: -1 });
        
        if (!otpRecord || otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired or invalid' });
        }

        const isMatch = await bcrypt.compare(otpCode, otpRecord.otp);
        if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

        const employee = await Employee.findOne({ employeeId });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        otpRecord.isUsed = true;
        await otpRecord.save();

        employee.password = newPassword; // Store exact string based on user request
        employee.plainPassword = newPassword; // Save plain text in DB for visibility
        employee.requiresPasswordChange = false;
        employee.passwordChangedAt = new Date();
        await employee.save();

        await ActivityLog.create({
            employee: employee._id,
            action: 'PASSWORD_RESET',
            module: 'AUTH',
            details: `Employee ${employee.employeeId} reset their password via OTP`
        });

        res.status(200).json({ message: 'Password reset successfully. You can now login.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error resetting password' });
    }
};

module.exports = {
    adminLogin,
    verifyCeoOtp,
    setupPassword,
    generateOnboardingToken,
    changeInitialPassword,
    forgotPassword,
    resetPassword
};
