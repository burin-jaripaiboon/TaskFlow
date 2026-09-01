const express = require('express');
const router = express.Router();

const { register, login, getCurrentUsers } = require('../controllers/authController');

router.get('/users', getCurrentUsers);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
