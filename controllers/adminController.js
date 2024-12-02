const Admin = require('../models/admin');                             //this one handles the admin logic
const Assignment = require('../models/assignment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin Registration
exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

        const newAdmin = new Admin({ username, password });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Admin Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Assignments Tagged to Admin
exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({adminId: req.userId })
        if (!assignments || assignments.length === 0) {
            return res.status(404).json({ message: 'No assignments found for this admin.' });
        }
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Accept Assignment
exports.acceptAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        if (assignment.adminId.toString() !== req.userId)
            return res.status(403).json({ message: 'Unauthorized to modify this assignment' });

        assignment.status = 'Accepted';
        await assignment.save();
        res.status(200).json({ message: 'Assignment accepted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Reject Assignment
exports.rejectAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        if (assignment.adminId.toString() !== req.userId)
            return res.status(403).json({ message: 'Unauthorized to modify this assignment' });

        assignment.status = 'Rejected';
        await assignment.save();
        res.status(200).json({ message: 'Assignment rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};