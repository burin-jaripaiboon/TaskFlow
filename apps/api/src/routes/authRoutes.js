const express = require('express');
const router = express.Router();

const { register, login, logout, renewTokens } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/renew', renewTokens);

module.exports = router;
