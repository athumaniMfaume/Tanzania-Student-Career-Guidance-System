const express = require("express");
const router = express.Router();
const {
  createProgram,
  getPrograms,
  getProgram,
  updateProgram,
  deleteProgram
} = require("../controllers/programController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin routes
router.post("/", protect, adminOnly, createProgram);
router.put("/:id", protect, adminOnly, updateProgram);
router.delete("/:id", protect, adminOnly, deleteProgram);

// Public routes (viewable by users)
router.get("/", protect, getPrograms);
router.get("/:id", protect, getProgram);

module.exports = router;