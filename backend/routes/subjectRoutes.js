const express = require("express");
const router = express.Router();

const {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject
} = require("../controllers/subjectController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createSubject);
router.get("/", protect, getSubjects);
router.get("/:id", protect, getSubject);
router.put("/:id", protect, adminOnly, updateSubject);
router.delete("/:id", protect, adminOnly, deleteSubject);

module.exports = router;