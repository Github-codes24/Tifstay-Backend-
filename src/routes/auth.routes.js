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
 */
router.post('/register', authCtrl.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user (local)
 */
router.post('/login', authCtrl.login);

/**
 * @openapi
 * /api/auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Login/Register with Google
 */
router.post('/google', authCtrl.google);

/**
 * @openapi
 * /api/auth/apple:
 *   post:
 *     tags: [Auth]
 *     summary: Login/Register with Apple
 */
router.post('/apple', authCtrl.apple);

module.exports = router;
