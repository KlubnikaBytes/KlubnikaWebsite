const Employee = require('../../models/admin/Employee');
const Referral = require('../../models/admin/Referral');
const WebsitePage = require('../../models/admin/WebsitePage');
const ActivityLog = require('../../models/admin/ActivityLog');

const getDashboardStats = async (req, res) => {
    try {
        const role = req.employee.role;
        let stats = {};

        if (role === 'CEO') {
            stats.totalEmployees = await Employee.countDocuments();
            stats.activeEmployees = await Employee.countDocuments({ status: 'Active' });
            stats.totalReferrals = await Referral.countDocuments();
            stats.publishedPages = await WebsitePage.countDocuments({ status: 'Published' });
            stats.recentActivity = await ActivityLog.find().sort({ createdAt: -1 }).limit(10).populate('employee', 'name employeeId role');
        } 
        else if (role === 'HR') {
            stats.totalEmployees = await Employee.countDocuments();
            stats.onboardingEmployees = await Employee.countDocuments({ status: 'Onboarding' });
            stats.recentReferrals = await Referral.find().sort({ createdAt: -1 }).limit(5);
        }
        else if (role === 'Digital Marketing Manager') {
            stats.publishedPages = await WebsitePage.countDocuments({ status: 'Published' });
            stats.draftPages = await WebsitePage.countDocuments({ status: 'Draft' });
            stats.recentActivity = await ActivityLog.find({ module: 'CMS' }).sort({ createdAt: -1 }).limit(10);
        }
        else if (role === 'Employee') {
             stats.myReferrals = await Referral.find({ referredBy: req.employee._id }).sort({ createdAt: -1 }).limit(5);
        }

        res.status(200).json(stats);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

module.exports = { getDashboardStats };
