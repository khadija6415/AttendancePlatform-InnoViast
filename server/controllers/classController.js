const Class = require('../models/Class');

// Create a new class/session
const createClass = async (req, res) => {
  try {
    const { title, date, time } = req.body;

    const newClass = await Class.create({
      title,
      date,
      time,
      instructor: req.user.id,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: 'Class created successfully',
      class: newClass,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all classes
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('instructor', 'name email');
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createClass, getClasses };