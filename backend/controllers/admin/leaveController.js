const LeaveRequest = require('../../models/admin/LeaveRequest');
const LeaveMessage = require('../../models/admin/LeaveMessage');
const LeaveStatusHistory = require('../../models/admin/LeaveStatusHistory');
const Notification = require('../../models/admin/Notification');
const Employee = require('../../models/admin/Employee');
const ActivityLog = require('../../models/admin/ActivityLog');

// Submit a leave request
const applyLeave = async (req, res) => {
    try {
        const { type, startDate, endDate, reason, attachmentUrl } = req.body;
        const employeeId = req.employee._id;
        const employeeRole = req.employee.role;

        const newLeave = await LeaveRequest.create({
            employee: employeeId,
            type,
            startDate,
            endDate,
            reason,
            attachmentUrl,
            status: 'Pending'
        });

        // NOTIFICATION ROUTING LOGIC
        // If employee is HR, send notification ONLY to CEO
        // If employee is Normal, send notification to HR and CEO
        let notifyRoles = ['CEO'];
        if (employeeRole !== 'HR' && employeeRole !== 'CEO') {
            notifyRoles.push('HR');
        }

        console.log(`[DEBUG APPLYLEAVE] Employee ${req.employee.name} (${employeeRole}) applied. Notifying roles: ${notifyRoles.join(', ')}`);

        const notifyUsers = await Employee.find({ role: { $in: notifyRoles }, status: 'Active' });
        console.log(`[DEBUG APPLYLEAVE] Found ${notifyUsers.length} users to notify.`);

        
        const notifications = notifyUsers.map(u => ({
            recipient: u._id,
            title: 'New Leave Request',
            message: `${req.employee.name} (${req.employee.employeeId}) requested ${type} leave.`,
            link: `/admin/leaves/${newLeave._id}` // Example frontend route
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        await ActivityLog.create({
            employee: employeeId,
            action: 'SUBMITTED_LEAVE',
            module: 'LEAVE_MANAGEMENT',
            details: `Requested ${type} leave from ${startDate} to ${endDate}`
        });

        res.status(201).json({ message: 'Leave request submitted successfully', leave: newLeave });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting leave request' });
    }
};

// Get personal leaves
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await LeaveRequest.find({ employee: req.employee._id })
            .sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching personal leaves' });
    }
};

// Get all leaves based on Role rules
const getAllLeaves = async (req, res) => {
    try {
        const viewerRole = req.employee.role;
        let query = {};
        
        // Populate first to filter by employee role if needed, or better:
        if (viewerRole === 'HR') {
            // HR can see ONLY Normal Employees and their OWN leaves. No other HRs.
            const allowedEmployees = await Employee.find({ 
                $or: [
                    { role: 'Employee' }, // Normal Employees
                    { _id: req.employee._id } // Their own
                ]
            }).select('_id');
            const allowedIds = allowedEmployees.map(e => e._id);
            query.employee = { $in: allowedIds };
            console.log(`[DEBUG GETALL] HR view (${req.employee.name}). Querying leaves for ${allowedIds.length} allowed employees.`);
        } else if (viewerRole !== 'CEO') {
            return res.status(403).json({ message: 'Access denied.' });
        } else {
            console.log(`[DEBUG GETALL] CEO view. Querying all leaves.`);
        }

        const leaves = await LeaveRequest.find(query)
            .populate('employee', 'name employeeId role')
            .populate('reviewedBy', 'name role')
            .sort({ createdAt: -1 });
            
        res.status(200).json(leaves);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching all leaves' });
    }
};

// Get single leave details + messages
const getLeaveDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const leave = await LeaveRequest.findById(id)
            .populate('employee', 'name employeeId role email')
            .populate('reviewedBy', 'name role');

        if (!leave) return res.status(404).json({ message: 'Leave request not found' });

        // Access check
        if (req.employee.role !== 'CEO' && leave.employee._id.toString() !== req.employee._id.toString()) {
            if (req.employee.role === 'HR') {
                if (leave.employee.role !== 'Employee') {
                    return res.status(403).json({ message: 'Access denied: HR can only view Normal Employee leaves or their own' });
                }
            } else {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        const messages = await LeaveMessage.find({ leaveRequest: id })
            .populate('sender', 'name role employeeId')
            .sort({ createdAt: 1 });

        const history = await LeaveStatusHistory.find({ leaveRequest: id })
            .populate('changedBy', 'name role')
            .sort({ createdAt: 1 });

        res.status(200).json({ leave, messages, history });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching leave details' });
    }
};

// Review Leave (Change Status)
const reviewLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reviewNotes } = req.body;
        const reviewer = req.employee;

        if (!['Approved', 'Rejected', 'Need More Info'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const leave = await LeaveRequest.findById(id).populate('employee');
        if (!leave) return res.status(404).json({ message: 'Leave not found' });

        if (reviewer.role === 'HR' && leave.employee.role !== 'Employee') {
            return res.status(403).json({ message: 'HR can only review Normal Employee leaves' });
        }
        
        if (leave.employee._id.toString() === reviewer._id.toString()) {
            return res.status(403).json({ message: 'You cannot review your own leave request' });
        }

        const previousStatus = leave.status;
        
        // Update leave
        leave.status = status;
        leave.reviewedBy = reviewer._id;
        leave.reviewNotes = reviewNotes || '';
        await leave.save();

        // Create Status History
        await LeaveStatusHistory.create({
            leaveRequest: leave._id,
            changedBy: reviewer._id,
            previousStatus,
            newStatus: status,
            notes: reviewNotes
        });

        // Add System Message to thread
        await LeaveMessage.create({
            leaveRequest: leave._id,
            sender: reviewer._id,
            message: `Status changed from ${previousStatus} to ${status}. ${reviewNotes ? 'Note: ' + reviewNotes : ''}`,
            isSystemMessage: true
        });

        // Notify Employee
        await Notification.create({
            recipient: leave.employee._id,
            title: `Leave Request ${status}`,
            message: `Your leave request for ${new Date(leave.startDate).toLocaleDateString()} has been marked as ${status}.`,
            link: `/dashboard/leaves/${leave._id}`
        });

        await ActivityLog.create({
            employee: reviewer._id,
            action: 'REVIEWED_LEAVE',
            module: 'LEAVE_MANAGEMENT',
            details: `Updated leave status to ${status} for ${leave.employee.employeeId}`
        });

        res.status(200).json({ message: 'Leave reviewed successfully', leave });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error reviewing leave' });
    }
};

// Add message to thread
const addLeaveMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const sender = req.employee;

        const leave = await LeaveRequest.findById(id).populate('employee');
        if (!leave) return res.status(404).json({ message: 'Leave not found' });

        // Access check to prevent unauthorized messaging
        if (sender.role !== 'CEO' && leave.employee._id.toString() !== sender._id.toString()) {
            if (sender.role === 'HR') {
                if (leave.employee.role !== 'Employee') {
                    return res.status(403).json({ message: 'Access denied: HR can only message on Normal Employee leaves' });
                }
            } else {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        const newMessage = await LeaveMessage.create({
            leaveRequest: id,
            sender: sender._id,
            message,
            isSystemMessage: false
        });

        await newMessage.populate('sender', 'name role employeeId');

        // Notification routing for message
        if (sender._id.toString() === leave.employee._id.toString()) {
            // Employee sent message -> Notify Admin who reviewed it, or CEO/HR if pending
            const notifyRoles = ['CEO'];
            if (leave.employee.role !== 'HR' && leave.employee.role !== 'CEO') notifyRoles.push('HR');
            
            let query = leave.reviewedBy 
                ? { _id: leave.reviewedBy } 
                : { role: { $in: notifyRoles }, status: 'Active' };

            const notifyAdmins = await Employee.find(query);
            
            const numNotes = notifyAdmins.map(admin => ({
                recipient: admin._id,
                title: 'New Leave Message',
                message: `${sender.name} sent a message regarding leave.`,
                link: `/admin/leaves/${leave._id}`
            }));
            await Notification.insertMany(numNotes);
            
        } else {
            // Admin sent message -> Notify Employee
            await Notification.create({
                recipient: leave.employee._id,
                title: 'New Message on Leave Request',
                message: `${sender.name} (${sender.role}) replied to your leave request.`,
                link: `/dashboard/leaves/${leave._id}`
            });
        }

        res.status(201).json({ message: 'Message added', chatMessage: newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message' });
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    getLeaveDetails,
    reviewLeave,
    addLeaveMessage
};
