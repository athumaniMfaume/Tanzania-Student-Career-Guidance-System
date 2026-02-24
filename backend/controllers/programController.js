const Program = require("../models/Program");

// Create Program (Admin only)
const createProgram = async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Programs
const getPrograms = async (req, res) => {
  try {
    const q = req.query.q;
    let filter = {};
    if (q) {
      const regex = new RegExp(q, "i");
      filter = { $or: [{ name: regex }, { description: regex }] };
    }

    const programs = await Program.find(filter).populate("combinations");
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single Program
const getProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate("combinations");
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Program (Admin only)
const updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated document
    );
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Program (Admin only)
const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProgram,
  getPrograms,
  getProgram,
  updateProgram,
  deleteProgram
};