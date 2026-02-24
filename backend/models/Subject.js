const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  combinations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Combination" }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);