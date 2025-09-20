const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/tiffin.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

/**
 * @openapi
 * tags:
 *   - name: Tiffins
 *     description: Manage Tiffin service listings (create, update, preview, submit, fetch)
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     MealPref:
 *       type: object
 *       properties:
 *         mealType:
 *           type: string
 *           example: Breakfast
 *         startTime:
 *           type: string
 *           example: "07:00 AM"
 *         endTime:
 *           type: string
 *           example: "09:00 AM"
 *
 *     Pricing:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [dining, delivery]
 *         duration:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *         price:
 *           type: number
 *           example: 1200
 *
 *     Location:
 *       type: object
 *       properties:
 *         area: { type: string, example: "Dharampeth" }
 *         landmark: { type: string, example: "Near Medical College" }
 *         fullAddress: { type: string, example: "123, Green Valley Road, Nagpur - 440010" }
 *         radiusKm: { type: number, example: 5 }
 *
 *     Contact:
 *       type: object
 *       properties:
 *         phone: { type: string, example: "9876543210" }
 *         whatsapp: { type: string, example: "9876543210" }
 *
 *     TiffinInput:
 *       type: object
 *       properties:
 *         name: { type: string, example: "Maharashtrian Ghar Ka Khana" }
 *         description: { type: string, example: "Authentic home-style cooking with fresh ingredients." }
 *         mealPreference:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/MealPref"
 *         foodType:
 *           type: string
 *           enum: [veg, non-veg, both]
 *           example: veg
 *         whatsIncluded:
 *           type: array
 *           items: { type: string, example: "2 Roti + 1 Sabzi + Dal + Rice" }
 *         orderType:
 *           type: array
 *           items: { type: string, enum: [dining, delivery] }
 *         pricing:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Pricing"
 *         offers: { type: string, example: "10% off on monthly subscription" }
 *         serviceFeatures:
 *           type: array
 *           items: { type: string, example: "Home-style cooking" }
 *         location: { $ref: "#/components/schemas/Location" }
 *         contact: { $ref: "#/components/schemas/Contact" }
 *
 *     TiffinResponse:
 *       type: object
 *       properties:
 *         status: { type: integer, example: 200 }
 *         success: { type: boolean, example: true }
 *         message: { type: string, example: "Tiffin created" }
 *         data:
 *           $ref: "#/components/schemas/TiffinInput"
 */

/**
 * @openapi
 * /api/tiffins/drafts:
 *   post:
 *     tags: [Tiffins]
 *     summary: Save a new draft tiffin service
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TiffinInput'
 *     responses:
 *       201:
 *         description: Draft saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TiffinResponse'
 */
router.post("/drafts", auth, ctrl.saveDraft);

/**
 * @openapi
 * /api/tiffins/drafts/{draftId}:
 *   put:
 *     tags: [Tiffins]
 *     summary: Update an existing draft
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: draftId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TiffinInput'
 *     responses:
 *       200:
 *         description: Draft updated
 */
router.put("/drafts/:draftId", auth, ctrl.updateDraft);

/**
 * @openapi
 * /api/tiffins/drafts/{draftId}/photos:
 *   post:
 *     tags: [Tiffins]
 *     summary: Upload photos for a draft
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: draftId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Photos uploaded
 */
router.post("/drafts/:draftId/photos", auth, upload.array("photos", 8), ctrl.uploadPhotos);

/**
 * @openapi
 * /api/tiffins/drafts/{draftId}/preview:
 *   get:
 *     tags: [Tiffins]
 *     summary: Preview draft before submitting
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: draftId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Draft preview
 */
router.get("/drafts/:draftId/preview", auth, ctrl.previewDraft);

/**
 * @openapi
 * /api/tiffins/drafts/{draftId}/submit:
 *   post:
 *     tags: [Tiffins]
 *     summary: Submit a draft to admin for review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: draftId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Draft submitted
 */
router.post("/drafts/:draftId/submit", auth, ctrl.submitDraft);

/**
 * @openapi
 * /api/tiffins/{id}:
 *   get:
 *     tags: [Tiffins]
 *     summary: Get a tiffin listing (draft, submitted, or published)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tiffin fetched
 */
router.get("/:id", auth, ctrl.getTiffin);

module.exports = router;
