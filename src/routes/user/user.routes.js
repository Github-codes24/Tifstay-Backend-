const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
// const userCtrl = require('../../controllers/user/user.controller.js');
// const userCtrl = require('../../controllers/user/user.controller');
const userCtrl = require('../../controllers/User/user.controller');



/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User management & profile
 */

/**
 * @openapi
 * /users/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user (role-wise)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               profile:
 *                 type: string
 *                 enum: [guest, hostel_owner, tiffin_provider, admin]
 *               bank:
 *                 type: object
 *                 properties:
 *                   accountNumber: { type: string }
 *                   ifsc: { type: string }
 *               guest:
 *                 type: object
 *                 properties:
 *                   aadhaarNumber: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', userCtrl.register);

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get my profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched
 */
router.get('/me', auth, userCtrl.getProfile);

/**
 * @openapi
 * /users/me:
 *   put:
 *     tags: [Users]
 *     summary: Update my profile
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
 *               bank:
 *                 type: object
 *                 properties:
 *                   accountNumber: { type: string }
 *                   ifsc: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/me', auth, userCtrl.updateProfile);

/**
 * @openapi
 * /users/role/{role}:
 *   get:
 *     tags: [Users]
 *     summary: Get users by role
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [guest, hostel_owner, tiffin_provider, admin]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/role/:role', userCtrl.getUsersByRole);

module.exports = router;
