const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  combinations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Combination" }
  ],
  schools: [
    { type: String } // You can change to school IDs if you create a School model later
  ],
  jobs: [
    { type: String } // Jobs that the program can lead to
  ]
}, { timestamps: true });

module.exports = mongoose.model("Program", programSchema);