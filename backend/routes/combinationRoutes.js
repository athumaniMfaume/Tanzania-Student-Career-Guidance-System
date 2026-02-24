// routes/combinationRoutes.js
const express = require("express");
const router = express.Router();

const {
  createCombination,
  getCombinations,
  getCombination,
  updateCombination,
  deleteCombination
} = require("../controllers/combinationController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin only routes
router.post("/", protect, adminOnly, createCombination);
router.put("/:id", protect, adminOnly, updateCombination);
router.delete("/:id", protect, adminOnly, deleteCombination);

// Everyone can view
router.get("/", protect, getCombinations);
router.get("/:id", protect, getCombination);

module.exports = router;