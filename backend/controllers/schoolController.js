const School = require("../models/School");

// Create School (Admin only)
const createSchool = async (req, res) => {
  try {
    const school = await School.create(req.body);
    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Schools
const getSchools = async (req, res) => {
  try {
    const q = req.query.q;
    let filter = {};
    if (q) {
      const regex = new RegExp(q, "i");
      filter = { $or: [{ name: regex }, { location: regex }] };
    }

    const schools = await School.find(filter)
      .populate("combinations")
      .populate("programs");
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single School
const getSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id)
      .populate("combinations")
      .populate("programs");
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update School (Admin only)
const updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("combinations")
      .populate("programs");

    if (!school) return res.status(404).json({ message: "School not found" });
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete School (Admin only)
const deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });
    res.json({ message: "School deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool
};