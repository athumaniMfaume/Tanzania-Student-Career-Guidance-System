const express = require("express");
const router = express.Router();
const {
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool
} = require("../controllers/schoolController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only routes
router.post("/", protect, adminOnly, createSchool);
router.put("/:id", protect, adminOnly, updateSchool);
router.delete("/:id", protect, adminOnly, deleteSchool);

// Everyone can view
router.get("/", protect, getSchools);
router.get("/:id", protect, getSchool);

module.exports = router;