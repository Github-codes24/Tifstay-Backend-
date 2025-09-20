const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints (local, google, apple)
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register user (local)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, profile]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mohit Bhirani
 *               email:
 *                 type: string
 *                 example: mohit@example.com
 *               password:
 *                 type: string
 *                 example: Pass@123
 *               profile:
 *                 type: string
 *                 enum: [guest, hostel_owner, tiffin_provider, admin]
 *                 example: guest
 *               bank:
 *                 type: object
 *                 properties:
 *                   accountNumber: { type: string, example: "1234567890" }
 *                   ifsc: { type: string, example: "SBIN0001234" }
 *                   accountName: { type: string, example: "Mohit Bhirani" }
 *               guest:
 *                 type: object
 *                 properties:
 *                   aadhaarNumber: { type: string, example: "1234-5678-9012" }
 *     responses:
 *       201:
 *         description: Registered and returns JWT token
 */
router.post('/register', authCtrl.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user (local)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: mohit@example.com
 *               password:
 *                 type: string
 *                 example: Pass@123
 *     responses:
 *       200:
 *         description: Login success with JWT
 */
router.post('/login', authCtrl.login);

/**
 * @openapi
 * /api/auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Login/Register with Google
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID Token
 *                 example: eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...
 *     responses:
 *       200:
 *         description: Google login success
 */
router.post('/google', authCtrl.google);

/**
 * @openapi
 * /api/auth/apple:
 *   post:
 *     tags: [Auth]
 *     summary: Login/Register with Apple
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Apple ID Token
 *                 example: eyJraWQiOiJ... (JWT from Apple)
 *     responses:
 *       200:
 *         description: Apple login success
 */
router.post('/apple', authCtrl.apple);

module.exports = router;
