const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

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

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Klubnika Bytes API is running' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    try {
        // Save to Database
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        console.log(`[Contact Form Received & Saved] Name: ${name}, Email: ${email}`);
        res.status(200).json({ status: 'success', message: 'Message saved successfully' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error while saving message' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
