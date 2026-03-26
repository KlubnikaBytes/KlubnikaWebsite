const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendOTP } = require('../utils/emailService');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ status: 'error', message: 'Please enter all fields' });
        }

        // Check for existing user
        let user = await User.findOne({ email });
        
        if (user) {
            if (user.isVerified) {
                return res.status(400).json({ status: 'error', message: 'User already exists' });
            }
            // If user exists but is not verified, we let them attempt signup again (updating info)
            user.name = name;
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({
                name,
                email,
                password: hashedPassword,
                isVerified: false
            });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        
        // Hash the OTP
        const salt = await bcrypt.genSalt(10);
        user.otp = await bcrypt.hash(otp, salt);
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        await user.save();

        // Send OTP email
        const emailSent = await sendOTP(user.email, otp);

        if (!emailSent) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            return res.status(500).json({ status: 'error', message: 'Failed to send OTP email. Please try again later.' });
        }

        res.status(201).json({
            status: 'success',
            message: 'OTP sent successfully. Please check your email to verify your account.',
            email: user.email
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ status: 'error', message: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Login user (Admin or Public) & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password, isTokenLogin } = req.body; // 'email' field in frontend might actually hold Employee ID now

        if (!email) {
            return res.status(400).json({ status: 'error', message: 'Please enter Email or Employee ID' });
        }

        // ============================================
        // 1. ADMIN SYSTEM CHECK (CEO, HR, Employee)
        // ============================================
        const AdminEmployee = require('../models/admin/Employee');
        const OtpVerification = require('../models/admin/OtpVerification');
        const OnboardingToken = require('../models/admin/OnboardingToken');
        
        // Search by Employee ID or Email
        const adminUser = await AdminEmployee.findOne({ 
            $or: [{ employeeId: email }, { email: email }] 
        });

        if (adminUser) {
            if (adminUser.status !== 'Active' && adminUser.status !== 'Onboarding') {
                return res.status(403).json({ status: 'error', message: 'Account suspended or inactive' });
            }

            // --- CEO FLOW (OTP) ---
            if (adminUser.role === 'CEO') {
                const otpCode = crypto.randomInt(100000, 999999).toString();
                const salt = await bcrypt.genSalt(10);
                const hashedOtp = await bcrypt.hash(otpCode, salt);

                await OtpVerification.create({
                    employeeId: adminUser.employeeId,
                    email: adminUser.email,
                    otp: hashedOtp,
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                });

                if (process.env.EMAIL_USER) {
                    await sendOTP(adminUser.email, otpCode); // Assuming sendOTP works for CEO too
                } else {
                    console.log(`[MOCK EMAIL] OTP for CEO (${adminUser.email}): ${otpCode}`);
                }

                return res.status(200).json({ 
                    status: 'success', 
                    step: 'OTP_REQUIRED', 
                    message: 'OTP sent to CEO email', 
                    email: adminUser.email,
                    isAdmin: true,
                    employeeId: adminUser.employeeId 
                });
            }

            // --- TOKEN / FIRST TIME LOGIN FLOW ---
            if (isTokenLogin) {
                const tokenRecord = await OnboardingToken.findOne({ token: password, employeeId: adminUser.employeeId, isUsed: false, status: 'Active' });
                
                if (!tokenRecord) return res.status(400).json({ status: 'error', message: 'Invalid or used onboarding token' });
                if (tokenRecord.expiresAt < new Date()) {
                    tokenRecord.status = 'Expired';
                    await tokenRecord.save();
                    return res.status(400).json({ status: 'error', message: 'Onboarding token has expired' });
                }

                const resetToken = jwt.sign({ id: adminUser._id, role: adminUser.role, action: 'PASSWORD_SETUP' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '15m' });
                return res.status(200).json({ 
                    status: 'success', 
                    step: 'SETUP_PASSWORD', 
                    message: 'Token verified. Please set your password.',
                    resetToken,
                    tokenId: tokenRecord._id,
                    isAdmin: true
                });
            }

            // --- STANDARD ADMIN LOGIN FLOW ---
            if (!password) return res.status(400).json({ status: 'error', message: 'Password is required' });
            if (adminUser.status === 'Onboarding' || !adminUser.password) {
                return res.status(400).json({ status: 'error', message: 'Please use your onboarding token for first-time login' });
            }

            const isMatch = await bcrypt.compare(password, adminUser.password);
            if (!isMatch) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

            const authToken = jwt.sign({ id: adminUser._id, role: adminUser.role, userType: 'Admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
            
            return res.status(200).json({
                status: 'success',
                step: 'LOGIN_SUCCESS',
                isAdmin: true,
                token: authToken,
                user: { id: adminUser._id, name: adminUser.name, role: adminUser.role, employeeId: adminUser.employeeId }
            });
        }

        // ============================================
        // 2. STANDARD USER SYSTEM (Fallback)
        // ============================================
        if (!password) {
            return res.status(400).json({ status: 'error', message: 'Password is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const salt = await bcrypt.genSalt(10);
        user.otp = await bcrypt.hash(otp, salt);
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const emailSent = await sendOTP(user.email, otp);
        if (!emailSent) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            return res.status(500).json({ status: 'error', message: 'Failed to send OTP email.' });
        }

        return res.status(200).json({
            status: 'success',
            step: 'PUBLIC_OTP_REQUIRED', // Differentiating from Admin CEO OTP
            message: 'OTP sent successfully. Please check your email.',
            email: user.email
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ status: 'error', message: 'Server error during login' });
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and get token
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ status: 'error', message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 'error', message: 'User not found' });
        }

        // Check if OTP exists and is not expired
        if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
            return res.status(400).json({ status: 'error', message: 'OTP is expired or invalid' });
        }

        // Validate the provided OTP
        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) {
            return res.status(400).json({ status: 'error', message: 'Invalid OTP' });
        }

        // Clear OTP fields and mark as verified
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isVerified = true;
        await user.save();

        // Issue JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('OTP Verification Error:', error);
        res.status(500).json({ status: 'error', message: 'Server error during OTP verification' });
    }
});
// @route   POST /api/auth/resend-otp
// @desc    Resend OTP to email
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ status: 'error', message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 'error', message: 'User not found' });
        }

        // Generate a new 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        
        // Hash the new OTP
        const salt = await bcrypt.genSalt(10);
        user.otp = await bcrypt.hash(otp, salt);
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        await user.save();

        // Send OTP email
        const emailSent = await sendOTP(user.email, otp);

        if (!emailSent) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            return res.status(500).json({ status: 'error', message: 'Failed to send OTP email. Please try again later.' });
        }

        res.status(200).json({
            status: 'success',
            message: 'A new OTP has been sent successfully.',
            email: user.email
        });
    } catch (error) {
        console.error('OTP Resend Error:', error);
        res.status(500).json({ status: 'error', message: 'Server error during OTP resend' });
    }
});

module.exports = router;
