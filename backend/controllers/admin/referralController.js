const Referral = require('../../models/admin/Referral');
const ActivityLog = require('../../models/admin/ActivityLog');

// Submit a referral (All Employees can do this)
const submitReferral = async (req, res) => {
    try {
        const { candidateName, candidateEmail, candidatePhone, candidateResumeUrl, jobRole, notes } = req.body;

        const newReferral = await Referral.create({
            candidateName,
            candidateEmail,
            candidatePhone,
            candidateResumeUrl,
            jobRole,
            notes,
            referredBy: req.employee._id,
            status: 'Submitted'
        });

        await ActivityLog.create({
            employee: req.employee._id,
            action: 'SUBMITTED_REFERRAL',
            module: 'REFERRAL_MANAGEMENT',
            details: `Referred ${candidateName} for ${jobRole}`
        });

        res.status(201).json({ message: 'Referral submitted successfully', referral: newReferral });

    } catch (error) {
        res.status(500).json({ message: 'Error submitting referral' });
    }
};

// Get referrals (HR & CEO see all, Employees see their own)
const getReferrals = async (req, res) => {
    try {
        let query = {};
        
        // If not CEO or HR, only show own referrals
        if (req.employee.role !== 'CEO' && req.employee.role !== 'HR') {
            query.referredBy = req.employee._id;
        }

        const referrals = await Referral.find(query).populate('referredBy', 'name employeeId').sort({ createdAt: -1 });
        res.status(200).json(referrals);
    } catch (error) {
         res.status(500).json({ message: 'Error fetching referrals' });
    }
};

// Update referral status (HR & CEO only)
const updateReferralStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, hrNotes } = req.body;

        const referral = await Referral.findById(id);
        if (!referral) return res.status(404).json({ message: 'Referral not found' });

        referral.status = status || referral.status;
        if (hrNotes) referral.notes = hrNotes; // append or overwrite based on frontend impl

        await referral.save();

        await ActivityLog.create({
            employee: req.employee._id,
            action: 'UPDATED_REFERRAL',
            module: 'REFERRAL_MANAGEMENT',
            details: `Updated referral status for ${referral.candidateName} to ${status}`
        });

        res.status(200).json({ message: 'Status updated', referral });

    } catch (error) {
        res.status(500).json({ message: 'Error updating referral' });
    }
}

module.exports = {
    submitReferral,
    getReferrals,
    updateReferralStatus
};
