const express = require("express");
const router = express.Router();
const guestCtrl = require("../controllers/guest.controller");

/**
 * @openapi
 * tags:
 *   - name: Guest
 *     description: Guest search and filter for tiffins & hostels
 */

/**
 * @openapi
 * /api/guest/tiffins:
 *   get:
 *     tags: [Guest]
 *     summary: Search and filter tiffin services
 *     parameters:
 *       - name: search
 *         in: query
 *         schema: { type: string }
 *         example: "Maharashtrian"
 *       - name: rating
 *         in: query
 *         schema: { type: number }
 *         example: 4.5
 *       - name: cost
 *         in: query
 *         schema: { type: string, enum: [low, high] }
 *         example: low
 *       - name: foodType
 *         in: query
 *         schema: { type: string, enum: [veg, non-veg, both] }
 *         example: veg
 *     responses:
 *       200:
 *         description: Filtered tiffins list
 */
router.get("/tiffins", guestCtrl.getTiffins);

/**
 * @openapi
 * /api/guest/hostels:
 *   get:
 *     tags: [Guest]
 *     summary: Search and filter hostels
 *     parameters:
 *       - name: search
 *         in: query
 *         schema: { type: string }
 *         example: "Boys Hostel"
 *       - name: hostelType
 *         in: query
 *         schema: { type: string, enum: [Boys Hostel, Girls Hostel, PG] }
 *       - name: cost
 *         in: query
 *         schema: { type: string, enum: [low, high] }
 *     responses:
 *       200:
 *         description: Filtered hostels list
 */
router.get("/hostels", guestCtrl.getHostels);

module.exports = router;
