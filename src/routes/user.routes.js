const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user.controller');
const { auth } = require('../middlewares/auth.middleware');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', auth(), ctrl.me);
router.get('/', auth('admin'), ctrl.list);

module.exports = router;
