const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

// Logged-in user routes
router.get('/me', auth, userCtrl.getProfile);
router.put('/me', auth, userCtrl.updateProfile);
router.post('/me/change-password', auth, userCtrl.changePassword);

// Admin routes (future: add role check middleware)
router.get('/', auth, userCtrl.getUsers);       // list all users
router.get('/:id', auth, userCtrl.getUserById); // get user by id
router.put('/:id', auth, userCtrl.updateUser);  // update user by id
router.delete('/:id', auth, userCtrl.deleteUser); // delete user by id

module.exports = router;
