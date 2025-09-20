// routes/hostelRoutes.js
const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostelController");
const upload = require("../middlewares/upload.middleware");
const auth = require("../middlewares/auth.middleware"); // require auth

// Create hostel with photo upload (auth required)
router.post("/",auth, upload.array("photos", 5), hostelController.createHostel);

// Get all hostels
router.get("/", hostelController.getHostels);

// Get hostel by ID
router.get("/:id", hostelController.getHostelById);

// Update hostel (auth required) — allow photos upload
router.put("/:id", auth, upload.array("photos", 5), hostelController.updateHostel);

module.exports = router;
