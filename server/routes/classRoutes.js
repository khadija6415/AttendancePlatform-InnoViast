const express = require('express');
const router = express.Router();
const { createClass, getClasses } = require('../controllers/classController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Only Admin/Instructor can create a class
router.post('/', protect, authorizeRoles('admin', 'instructor'), createClass);

// Anyone logged in can view classes
router.get('/', protect, getClasses);

module.exports = router;