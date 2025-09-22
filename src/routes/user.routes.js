const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const userCtrl = require('../controllers/user.controller');
const avatarUpload = require('../middlewares/avatarUpload.middleware');
// const profileUpload = require('../middlewares/profileUpload.middleware');

// helper to provide clear fallback if a controller method is missing.
const missingHandler = (name) => (req, res) =>
  res.status(501).json({ status: 501, success: false, message: `Handler ${name} not implemented` });

// map expected handlers with safe defaults
const createUser = userCtrl.createUser || missingHandler('createUser');
const getHostelOwners = userCtrl.getHostelOwners || missingHandler('getHostelOwners');
const getGuests = userCtrl.getGuests || missingHandler('getGuests');
const getTiffinProviders = userCtrl.getTiffinProviders || missingHandler('getTiffinProviders');

const getProfile = userCtrl.getProfile || missingHandler('getProfile');
const updateProfile = userCtrl.updateProfile || missingHandler('updateProfile');
const changePassword = userCtrl.changePassword || missingHandler('changePassword');
const uploadAvatar = userCtrl.uploadAvatar || missingHandler('uploadAvatar');
const uploadProfile = userCtrl.uploadProfile || missingHandler('uploadProfile');

const getUsers = userCtrl.getUsers || missingHandler('getUsers');
const getUserById = userCtrl.getUserById || missingHandler('getUserById');
const updateUser = userCtrl.updateUser || missingHandler('updateUser');
const uploadAvatarById = userCtrl.uploadAvatarById || missingHandler('uploadAvatarById');
const uploadProfileById = userCtrl.uploadProfileById || missingHandler('uploadProfileById');
const deleteUser = userCtrl.deleteUser || missingHandler('deleteUser');

// Admin/create and filtered lists (static routes must come first)
router.post('/', createUser);
router.get('/hostel-owners', getHostelOwners);
router.get('/guests', getGuests);
router.get('/tiffin-providers', getTiffinProviders);

// Current user endpoints
router.get('/me', getProfile);
router.put('/me', updateProfile);
router.post('/me/change-password', auth, userCtrl.changePassword);
router.post('/me/avatar', avatarUpload.single('avatar'), uploadAvatar);
// router.post('/me/profile', profileUpload.single('profile'), uploadProfile);

// Generic list
router.get('/', getUsers);

// Parameter routes — keep these last so static routes match first
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.post('/:id/avatar', avatarUpload.single('avatar'), uploadAvatarById);
// router.post('/:id/profile', profileUpload.single('profile'), uploadProfileById);
router.delete('/:id', deleteUser);

module.exports = router;