const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/hostel.admin.controller");
const auth = require("../middlewares/auth.middleware");

/**
 * @openapi
 * tags:
 *   - name: Admin Hostels
 *     description: Admin management for approving/rejecting hostels
 */

/**
 * @openapi
 * /api/admin/hostels:
 *   get:
 *     tags: [Admin Hostels]
 *     summary: Get all hostels with pagination & filter
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
 *         description: Search by hostel name
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of hostels with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HostelResponse'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
router.get("/", auth, ctrl.getAllHostels);

/**
 * @openapi
 * /api/admin/hostels/{id}:
 *   get:
 *     tags: [Admin Hostels]
 *     summary: Get hostel details by ID
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
 *         description: Hostel details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HostelResponse'
 */
router.get("/:id", auth, ctrl.getHostelById);

/**
 * @openapi
 * /api/admin/hostels/{id}/approve:
 *   post:
 *     tags: [Admin Hostels]
 *     summary: Approve hostel (status → published)
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
 *         description: Hostel approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HostelResponse'
 */
router.post("/:id/approve", auth, ctrl.approveHostel);

/**
 * @openapi
 * /api/admin/hostels/{id}/reject:
 *   post:
 *     tags: [Admin Hostels]
 *     summary: Reject hostel (status → rejected)
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
 *         description: Hostel rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HostelResponse'
 */
router.post("/:id/reject", auth, ctrl.rejectHostel);

module.exports = router;
