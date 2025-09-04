// routes/hostelRoutes.js
const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostelController");
const upload = require("../middlewares/upload.middleware");

// Create hostel with photo upload
router.post("/", upload.array("photos", 5), hostelController.createHostel);

// Get all hostels
router.get("/", hostelController.getHostels);

// Get hostel by ID
router.get("/:id", hostelController.getHostelById);

module.exports = router;
