const express = require('express');
const {
    register,
    login,
    refreshAccessToken,
    logout,
} = require('../Controllers/auth.controller');
const authMiddleware = require('../Middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', authMiddleware, logout);

module.exports = router;
