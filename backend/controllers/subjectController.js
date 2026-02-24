const Subject = require("../models/Subject");
const Combination = require("../models/Combination");

// Create Subject (Admin only)
exports.createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Subjects (Everyone)
exports.getSubjects = async (req, res) => {
  try {
    const q = req.query.q;
    let filter = {};
    if (q) {
      const regex = new RegExp(q, "i");
      filter = { $or: [{ name: regex }, { description: regex }] };
    }

    const subjects = await Subject.find(filter).populate("combinations");
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Subject
exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("combinations");

    if (!subject)
      return res.status(404).json({ message: "Subject not found" });

    // If subject.combinations is empty (not denormalized), find combinations that reference this subject
    if (!subject.combinations || subject.combinations.length === 0) {
      try {
        const combos = await Combination.find({ subjects: subject._id }).populate("subjects programs");
        // Return subject with found combinations
        return res.json({
          _id: subject._id,
          name: subject.name,
          description: subject.description,
          combinations: combos,
          createdAt: subject.createdAt,
          updatedAt: subject.updatedAt
        });
      } catch (comboErr) {
        console.error("Error fetching combinations:", comboErr);
        return res.json(subject);
      }
    }

    res.json(subject);
  } catch (error) {
    console.error("Error in getSubject:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update Subject (Admin)
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Subject (Admin)
exports.deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};