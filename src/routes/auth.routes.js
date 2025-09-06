const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

// Local Auth
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

// Google Auth
router.post('/google', authCtrl.google);

// Guest login
// router.post('/guest', authCtrl.guest);

// Password reset
router.post('/forgot', authCtrl.forgot);
router.post('/reset/:token', authCtrl.reset);

module.exports = router;
