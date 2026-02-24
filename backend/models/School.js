const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String }, // city or region
  level: {
    type: String,
    enum: ["O-Level", "A-Level", "College"], // University does not need level
    required: function() {
      // Only required if not a University
      return !this.isUniversity;
    }
  },
  isUniversity: { type: Boolean, default: false }, // flag to identify university
  combinations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Combination" } // only for O-Level/A-Level
  ],
  programs: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Program" } // for College/University
  ]
}, { timestamps: true });

module.exports = mongoose.model("School", schoolSchema);