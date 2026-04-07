const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    User registration logic
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    User login and get JWT token
router.post('/login', login);

module.exports = router;