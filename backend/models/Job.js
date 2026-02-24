const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // e.g., Software Developer
  description: { type: String }, // job description
  relatedPrograms: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Program" } // link programs to this job
  ]
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);