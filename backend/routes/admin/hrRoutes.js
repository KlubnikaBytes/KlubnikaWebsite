const express = require('express');
const router = express.Router();
const { getEmployees, createEmployee, updateEmployee, deleteEmployee, getMyProfile, updateMyProfile } = require('../../controllers/admin/hrController');
const { adminAuth, requireRole } = require('../../middleware/admin/authMiddleware');

// Profile routes — accessible to ANY authenticated employee/admin (not restricted to CEO/HR)
router.get('/profile/me', adminAuth, getMyProfile);
router.put('/profile/me', adminAuth, updateMyProfile);

// ----- Below routes: CEO and HR only -----
const hrOnlyRouter = express.Router();
hrOnlyRouter.use(adminAuth, requireRole(['CEO', 'HR']));

hrOnlyRouter.get('/employees', getEmployees);
hrOnlyRouter.post('/employees', createEmployee);
hrOnlyRouter.put('/employees/:id', updateEmployee);
// CEO and HR can remove employees (but not themselves)
hrOnlyRouter.delete('/employees/:id', requireRole(['CEO', 'HR']), deleteEmployee);

router.use('/', hrOnlyRouter);

module.exports = router;
