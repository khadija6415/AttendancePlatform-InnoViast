const express = require('express');
const router = express.Router();
const { signup, login, getStudents } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/students', protect, authorizeRoles('admin', 'instructor'), getStudents);

module.exports = router;