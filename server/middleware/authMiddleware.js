const Attendance = require('../models/Attendance');

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { student, session, status } = req.body;

    const attendance = await Attendance.create({
      student,
      session,
      status,
    });

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get attendance (with optional filters: date, class, student, status)
const getAttendance = async (req, res) => {
  try {
    const { session, student, status } = req.query;
    const filter = {};

    if (session) filter.session = session;
    if (status) filter.status = status;

    // Security: a student must only ever see their OWN attendance records,
    // regardless of what (if anything) the frontend sends.
    // Admins/Instructors may optionally filter by a specific student.
    if (req.user.role === 'student') {
      filter.student = req.user.id || req.user._id;
    } else if (student) {
      filter.student = student;
    }

    const records = await Attendance.find(filter)
      .populate('student', 'name email')
      .populate('session', 'title date time');

    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { markAttendance, getAttendance };