const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostelController");
const upload = require("../middlewares/upload.middleware");
const auth = require("../middlewares/auth.middleware");

/**
 * @openapi
 * tags:
 *   - name: Hostels
 *     description: Hostel listing management (create, update, view, admin review)
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Pricing:
 *       type: object
 *       properties:
 *         type: { type: string, enum: [daily, weekly, monthly] }
 *         price: { type: number, example: 8000 }
 *         securityDeposit: { type: number, example: 15000 }
 *         offer: { type: string, example: "10% OFF" }
 *
 *     Room:
 *       type: object
 *       properties:
 *         roomNo: { type: string, example: "101" }
 *         noOfBeds: { type: integer, example: 2 }
 *         details: { type: string, example: "AC + Attached Bathroom" }
 *
 *     Location:
 *       type: object
 *       properties:
 *         area: { type: string, example: "Dharampeth" }
 *         landmark: { type: string, example: "Near Medical College" }
 *         fullAddress: { type: string, example: "123, Green Valley Road, Nagpur - 440010" }
 *
 *     Contact:
 *       type: object
 *       properties:
 *         phone: { type: string, example: "9876543210" }
 *         whatsapp: { type: string, example: "9876543210" }
 *
 *     HostelInput:
 *       type: object
 *       required: [name, hostelType]
 *       properties:
 *         name: { type: string, example: "Scholars Den Boys Hostel" }
 *         hostelType: { type: string, enum: [Boys Hostel, Girls Hostel, PG] }
 *         description: { type: string, example: "A well-maintained boys hostel with modern amenities" }
 *         pricing:
 *           type: array
 *           items: { $ref: "#/components/schemas/Pricing" }
 *         rooms:
 *           type: array
 *           items: { $ref: "#/components/schemas/Room" }
 *         facilities:
 *           type: array
 *           items: { type: string, example: "Wifi" }
 *         rules:
 *           type: array
 *           items: { type: string, example: "No smoking inside rooms" }
 *         location: { $ref: "#/components/schemas/Location" }
 *         contact: { $ref: "#/components/schemas/Contact" }
 *
 *     HostelResponse:
 *       type: object
 *       properties:
 *         status: { type: integer, example: 200 }
 *         success: { type: boolean, example: true }
 *         message: { type: string, example: "Hostel created" }
 *         data:
 *           $ref: "#/components/schemas/HostelInput"
 */

/**
 * @openapi
 * /api/hostels:
 *   post:
 *     tags: [Hostels]
 *     summary: Create a new hostel listing (Provider side - hostel_owner)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/HostelInput'
 *               - type: object
 *                 properties:
 *                   photos:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: binary
 *     responses:
 *       201:
 *         description: Hostel created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/HostelResponse"
 */
router.post("/", auth, upload.array("photos", 5), hostelController.createHostel);

/**
 * @openapi
 * /api/hostels:
 *   get:
 *     tags: [Hostels]
 *     summary: Get all hostel listings (Admin + Public view)
 *     responses:
 *       200:
 *         description: List of hostels
 */
router.get("/", hostelController.getHostels);

/**
 * @openapi
 * /api/hostels/{id}:
 *   get:
 *     tags: [Hostels]
 *     summary: Get hostel details by ID (Guest/Admin/Provider)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Hostel details
 */
router.get("/:id", hostelController.getHostelById);

/**
 * @openapi
 * /api/hostels/{id}:
 *   put:
 *     tags: [Hostels]
 *     summary: Update hostel listing (Provider - only owner can update)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: "#/components/schemas/HostelInput"
 *               - type: object
 *                 properties:
 *                   photos:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: binary
 *     responses:
 *       200:
 *         description: Hostel updated
 */
router.put("/:id", auth, upload.array("photos", 5), hostelController.updateHostel);

module.exports = router;
