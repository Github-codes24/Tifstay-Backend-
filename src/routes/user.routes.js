/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User profile and admin user management
 *
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 * /api/users/me:
 *   put:
 *     tags: [Users]
 *     summary: Update current authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               profile: { type: string }
 *               bank: { type: object }
 *               guest: { type: object }
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 * /api/users/me/change-password:
 *   post:
 *     tags: [Users]
 *     summary: Change password for current user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password changed
 *
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List users (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by id (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user by id (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated
 *
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user by id (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 */
 
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

// Logged-in user routes
router.get('/me', auth, userCtrl.getProfile);
router.put('/me', auth, userCtrl.updateProfile);
router.post('/me/change-password', auth, userCtrl.changePassword);

// Admin routes (future: add role check middleware)
router.post('/', userCtrl.createUser); // <-- create user (admin)
router.get('/', userCtrl.getUsers);       // list all users
router.get('/:id', userCtrl.getUserById); // get user by id
router.put('/:id', userCtrl.updateUser);  // update user by id
router.delete('/:id', userCtrl.deleteUser); // delete user by id

module.exports = router;
