const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/tiffin.controller");
const upload = require("../middlewares/upload.middleware");
const auth = require("../middlewares/auth.middleware");

/**
 * @openapi
 * tags:
 *   - name: Tiffins
 *     description: Tiffin management (drafts, photos, submit, fetch)
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     TiffinInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         foodType:
 *           type: string
 *           enum: [veg, non-veg, both]
 *         whatsIncluded:
 *           type: array
 *           items:
 *             type: string
 *         orderType:
 *           type: array
 *           items:
 *             type: string
 *             enum: [dining, delivery]
 *         pricing:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [dining, delivery]
 *               duration:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *               price:
 *                 type: number
 *     TiffinResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *         message:
 *           type: string
 */

/**
 * @openapi
 * /api/tiffins/drafts:
 *   post:
 *     tags: [Tiffins]
 *     summary: Save a new draft tiffin
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
// router.post("/drafts", auth, ctrl.saveDraft);

router.post("/drafts", auth, ctrl.saveDraft);

/**
 * @openapi
 * /api/tiffins/drafts/{draftId}:
 *   put:
 *     tags: [Tiffins]
 *     summary: Update a draft
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: draftId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TiffinInput'
 *     responses:
 *       200:
 *         description: Draft updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TiffinResponse'
 */
// router.put("/drafts/:draftId", auth, ctrl.updateDraft);
router.put("/drafts/:draftId", auth, ctrl.updateDraft);

/**
 * @openapi
 * /api/tiffins/drafts/{draftId}/photos:
 *   post:
 *     tags: [Tiffins]
 *     summary: Upload photos for a draft (multipart/form-data)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: draftId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TiffinResponse'
 */
// router.post("/drafts/:draftId/photos", auth, upload.array("photos", 8), ctrl.uploadPhotos);

router.post("/drafts/:draftId/photos", auth, upload.array("photos", 8), ctrl.uploadPhotos);

/**
 * @openapi
 * /api/tiffins/drafts/{draftId}/preview:
 *   get:
 *     tags: [Tiffins]
 *     summary: Preview draft
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: draftId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Draft preview
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TiffinResponse'
 */
// router.get("/drafts/:draftId/preview", auth, ctrl.previewDraft);
router.get("/drafts/:draftId/preview", auth, ctrl.previewDraft);

/**
 * @openapi
 * /api/tiffins/drafts/{draftId}/submit:
 *   post:
 *     tags: [Tiffins]
 *     summary: Submit a draft (mark as submitted)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: draftId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Draft submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TiffinResponse'
 */
// router.post("/drafts/:draftId/submit", auth, ctrl.submitDraft);
router.post("/drafts/:draftId/submit", auth, ctrl.submitDraft);

/**
 * @openapi
 * /api/tiffins/{id}:
 *   get:
 *     tags: [Tiffins]
 *     summary: Get a single tiffin (draft or published)
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
 *         description: Tiffin fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TiffinResponse'
 */
// router.get("/:id", auth, ctrl.getTiffin);

router.get("/:id", ctrl.getTiffin);

module.exports = router;
