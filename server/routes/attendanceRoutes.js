const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance } = require('../controllers/attendanceController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Only Admin/Instructor can mark attendance
router.post('/', protect, authorizeRoles('admin', 'instructor'), markAttendance);

// Anyone logged in can view attendance (with filters)
router.get('/', protect, getAttendance);

module.exports = router;