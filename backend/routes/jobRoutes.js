const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob
} = require("../controllers/jobController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only routes
router.post("/", protect, adminOnly, createJob);
router.put("/:id", protect, adminOnly, updateJob);
router.delete("/:id", protect, adminOnly, deleteJob);

// Everyone can view jobs
router.get("/", protect, getJobs);
router.get("/:id", protect, getJob);

module.exports = router;