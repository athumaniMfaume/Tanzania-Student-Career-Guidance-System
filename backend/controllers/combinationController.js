// controllers/combinationController.js
const Combination = require("../models/Combination");

// Create combination
const createCombination = async (req, res) => {
  try {
    const combination = await Combination.create(req.body);
    res.status(201).json(combination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all combinations
const getCombinations = async (req, res) => {
  try {
    const q = req.query.q;
    const subjectId = req.query.subjectId;
    let filter = {};

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }

    if (subjectId) {
      // ensure we filter by subject membership
      filter = { ...filter, subjects: subjectId };
    }

    const combinations = await Combination.find(filter).populate("subjects programs");
    res.json(combinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single combination
const getCombination = async (req, res) => {
  try {
    const combination = await Combination.findById(req.params.id).populate("subjects programs");
    if (!combination)
      return res.status(404).json({ message: "Combination not found" });
    res.json(combination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update combination
const updateCombination = async (req, res) => {
  try {
    const combination = await Combination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // you can also use returnDocument: 'after'
    );
    if (!combination)
      return res.status(404).json({ message: "Combination not found" });
    res.json(combination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete combination
const deleteCombination = async (req, res) => {
  try {
    const combination = await Combination.findByIdAndDelete(req.params.id);
    if (!combination)
      return res.status(404).json({ message: "Combination not found" });
    res.json({ message: "Combination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCombination,
  getCombinations,
  getCombination,
  updateCombination,
  deleteCombination
};