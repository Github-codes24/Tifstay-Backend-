// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/google', authCtrl.google);
router.post('/forgot', authCtrl.forgot);
router.post('/reset/:token', authCtrl.reset);

module.exports = router;
