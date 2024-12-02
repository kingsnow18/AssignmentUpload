const User = require('../models/user');                            //handles the logic for each route
const Admin = require('../models/admin');                          //this one is for user    
const Assignment = require('../models/assignment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User Registration
exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// User Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Upload Assignment
exports.uploadAssignment = async (req, res) => {
    const { task, adminName } = req.body;  
    try {
        const admin = await Admin.findOne({ username: adminName });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const assignment = new Assignment({
            userId: req.userId,  
            task,
            adminId:admin._id,
        });

        await assignment.save();
        res.status(201).json({ message: 'Assignment uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get All Admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}, 'username');
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};