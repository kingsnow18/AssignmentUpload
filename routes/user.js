const express = require('express');
const { register, login, uploadAssignment, getAdmins } = require('../controllers/userController');
const { verifyToken } = require('../utils/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/upload', verifyToken, uploadAssignment);
router.get('/admins', verifyToken, getAdmins);

module.exports = router;