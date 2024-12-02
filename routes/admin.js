const express = require('express');
const { register, login, getAssignments, acceptAssignment, rejectAssignment } = require('../controllers/adminController');
const { verifyToken } = require('../utils/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/assignments', verifyToken, getAssignments);
router.post('/assignments/:id/accept', verifyToken, acceptAssignment);
router.post('/assignments/:id/reject', verifyToken, rejectAssignment);

module.exports = router;