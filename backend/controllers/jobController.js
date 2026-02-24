const Job = require("../models/Job");

// Create Job (Admin only)
const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    // Populate relatedPrograms before sending response
    await job.populate("relatedPrograms", "name");
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Jobs
const getJobs = async (req, res) => {
  try {
    const q = req.query.q;
    let filter = {};
    if (q) {
      const regex = new RegExp(q, "i");
      filter = { $or: [{ title: regex }, { description: regex }] };
    }

    const jobs = await Job.find(filter).populate("relatedPrograms", "name");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single Job
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("relatedPrograms", "name");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Job (Admin only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" } // Mongoose 7+
    ).populate("relatedPrograms", "name");

    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Job (Admin only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob
};