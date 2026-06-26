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
    if (student) filter.student = student;
    if (status) filter.status = status;

    const records = await Attendance.find(filter)
      .populate('student', 'name email')
      .populate('session', 'title date time');

    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { markAttendance, getAttendance };