const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const userCtrl = require('../controllers/user.controller');

// Admin/create and filtered lists (static routes must come first)
router.post('/',  userCtrl.createUser); // create user (admin)
router.get('/hostel-owners',  userCtrl.getHostelOwners);
router.get('/guests',  userCtrl.getGuests);
router.get('/tiffin-providers',  userCtrl.getTiffinProviders);

// Logged-in user routes
// router.get('/me', userCtrl.getProfile);
// router.put('/me', userCtrl.updateProfile);
// router.post('/me/change-password', auth, userCtrl.changePassword);

// Generic list (all users) - keep before parameter routes
router.get('/', userCtrl.getUsers);

// Parameter routes — keep these last so static routes match first
router.get('/:id', userCtrl.getUserById);
router.put('/:id', userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router;
