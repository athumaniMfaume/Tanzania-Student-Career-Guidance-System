const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const combinationRoutes = require("./routes/combinationRoutes");
const programRoutes = require("./routes/programRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const jobRoutes = require("./routes/jobRoutes");

dotenv.config();

const app = express();

// --- CORS ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174", // Vite dev port
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman / server-to-server
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, false); // Block other origins
  },
  credentials: true,
}));

app.use(express.json());

// --- MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/combinations", combinationRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/jobs", jobRoutes);

// --- Serve Frontend in Production ---
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  // Local dev root
  app.get("/", (req, res) => res.send("Career Guidance API Running (Development)"));
}

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));