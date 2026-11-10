const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Configure Google & Cloudflare public DNS servers to resolve MongoDB Atlas SRV records
// reliably across Windows networks and Indian ISPs (prevents querySrv ECONNREFUSED)
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
    console.warn('DNS server customization skipped:', dnsErr.message);
}

const app = express();
const PORT = process.env.PORT || 5000;

const {
    sendContactInquiryNotification,
    sendContactAcknowledgment,
    sendNewsletterNotification,
    sendNewsletterWelcome
} = require('./utils/emailService');

const allowedOrigins = [
    'https://klubnikabytes.com',
    'https://www.klubnikabytes.com',
    'http://localhost:5173',
    'http://localhost:5000',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || (typeof origin === 'string' && origin.includes('klubnikabytes.com'))) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure default admin account exists and is synchronized from .env
const ensureDefaultAdminAccount = async () => {
    try {
        const Employee = require('./models/admin/Employee');
        const bcrypt = require('bcryptjs');

        const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'hr@klubnikabytes.com').trim().toLowerCase();
        const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'HR@KB';
        const adminRole = process.env.ADMIN_DEFAULT_ROLE || 'HR';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        let employee = await Employee.findOne({ email: adminEmail });
        if (employee) {
            employee.password = hashedPassword;
            employee.plainPassword = adminPassword;
            employee.status = 'Active';
            employee.requiresPasswordChange = false;
            employee.role = adminRole;
            await employee.save();
            console.log(`✅ Default Admin user synced from .env: ${adminEmail}`);
        } else {
            await Employee.create({
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
            console.log(`✅ Default Admin user created from .env: ${adminEmail}`);
        }
    } catch (err) {
        console.error('Error ensuring default admin user:', err.message);
    }
};

// MongoDB Connection
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        console.log('Mongo URI:', uri);

        await mongoose.connect(uri);

        console.log('✅ MongoDB Connected Successfully');
        await ensureDefaultAdminAccount();
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminAuthRoutes = require('./routes/admin/authRoutes');
const adminHrRoutes = require('./routes/admin/hrRoutes');
const adminCmsRoutes = require('./routes/admin/cmsRoutes');
const adminReferralRoutes = require('./routes/admin/referralRoutes');
const adminLeaveRoutes = require('./routes/admin/leaveRoutes');
const adminDashboardRoutes = require('./routes/admin/dashboardRoutes');
const adminDocumentRoutes = require('./routes/admin/documentRoutes');
const adminApplicationRoutes = require('./routes/admin/applicationRoutes');
const adminAttendanceRoutes = require('./routes/admin/attendanceRoutes');
const adminPerformanceRoutes = require('./routes/admin/performanceRoutes');
const adminJobRoutes = require('./routes/admin/jobRoutes');
const publicJobRoutes = require('./routes/publicJobRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/hr', adminHrRoutes);
app.use('/api/admin/cms', adminCmsRoutes);
app.use('/api/admin/referrals', adminReferralRoutes);
app.use('/api/admin/leaves', adminLeaveRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/documents', adminDocumentRoutes);
app.use('/api/admin/applications', adminApplicationRoutes);
app.use('/api/admin/attendance', adminAttendanceRoutes);
app.use('/api/admin/performance', adminPerformanceRoutes);
app.use('/api/admin/jobs', adminJobRoutes);
app.use('/api/jobs', publicJobRoutes);

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    subject: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema);

// Newsletter Subscriber Schema
const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Subscribed', 'Unsubscribed'],
        default: 'Subscribed'
    }
});

const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSchema);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Klubnika Bytes API is running'
    });
});

// Contact Form - dispatches notification to info@klubnikabytes.com & confirms to sender
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            status: 'error',
            message: 'Name, email, and message are required'
        });
    }

    try {
        const newContact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : '',
            subject: subject ? subject.trim() : '',
            message: message.trim()
        });

        await newContact.save();

        // Dispatch email notification to leadership/inbox (configured in .env)
        sendContactInquiryNotification({
            name: name.trim(),
            email: email.trim(),
            phone: phone ? phone.trim() : '',
            subject: subject ? subject.trim() : '',
            message: message.trim()
        }).catch(err => console.error('Background contact inquiry email failed:', err));

        // Dispatch acknowledgment email to user
        sendContactAcknowledgment(email.trim(), name.trim(), subject ? subject.trim() : '')
            .catch(err => console.error('Background contact acknowledgment email failed:', err));

        res.status(200).json({
            status: 'success',
            message: 'Message saved and dispatched successfully'
        });
    } catch (error) {
        console.error('Error saving message:', error);

        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

// Newsletter Subscription Endpoint
app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide a valid corporate or personal email address.'
        });
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
        let subscriber = await NewsletterSubscriber.findOne({ email: cleanEmail });

        if (!subscriber) {
            subscriber = new NewsletterSubscriber({ email: cleanEmail });
            await subscriber.save();
        } else if (subscriber.status === 'Unsubscribed') {
            subscriber.status = 'Subscribed';
            subscriber.subscribedAt = new Date();
            await subscriber.save();
        }

        // Send email notifications asynchronously
        sendNewsletterNotification(cleanEmail)
            .catch(err => console.error('Background newsletter notification failed:', err));

        sendNewsletterWelcome(cleanEmail)
            .catch(err => console.error('Background newsletter welcome failed:', err));

        return res.status(200).json({
            status: 'success',
            message: 'Subscribed successfully! Thank you for joining our newsletter.'
        });
    } catch (error) {
        console.error('Newsletter error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to process subscription. Please try again later.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});