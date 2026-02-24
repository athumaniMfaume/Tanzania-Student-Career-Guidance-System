const mongoose = require("mongoose");

const combinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  subjects: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Subject" }
  ],
  programs: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Program" }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Combination", combinationSchema);