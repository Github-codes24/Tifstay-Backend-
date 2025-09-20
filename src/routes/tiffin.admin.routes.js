const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/tiffin.admin.controller");
const auth = require("../middlewares/auth.middleware");

/**
 * @openapi
 * tags:
 *   - name: Admin Tiffins
 *     description: Admin management for approving/rejecting tiffins
 */

/**
 * @openapi
 * /api/admin/tiffins:
 *   get:
 *     tags: [Admin Tiffins]
 *     summary: Get all tiffins with pagination & filter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default 1)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of items per page (default 10)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         description: Filter by status (draft, submitted, published, rejected, pending)
 *         required: false
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         description: Search by tiffin/restaurant name
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tiffins with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TiffinResponse'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
router.get("/", auth, ctrl.getAllTiffins);

/**
 * @openapi
 * /api/admin/tiffins/{id}:
 *   get:
 *     tags: [Admin Tiffins]
 *     summary: Get tiffin details by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tiffin details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TiffinResponse'
 */
router.get("/:id", auth, ctrl.getTiffinById);

/**
 * @openapi
 * /api/admin/tiffins/{id}/approve:
 *   post:
 *     tags: [Admin Tiffins]
 *     summary: Approve tiffin (status → published)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tiffin approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TiffinResponse'
 */
router.post("/:id/approve", auth, ctrl.approveTiffin);

/**
 * @openapi
 * /api/admin/tiffins/{id}/reject:
 *   post:
 *     tags: [Admin Tiffins]
 *     summary: Reject tiffin (status → rejected)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tiffin rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TiffinResponse'
 */
router.post("/:id/reject", auth, ctrl.rejectTiffin);

module.exports = router;
