// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/me', auth, userCtrl.getProfile);
router.put('/me', auth, userCtrl.updateProfile);
router.post('/me/change-password', auth, userCtrl.changePassword);

module.exports = router;
