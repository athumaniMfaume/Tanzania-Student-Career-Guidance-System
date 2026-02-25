const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // 1. Added path module

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const combinationRoutes = require("./routes/combinationRoutes");
const programRoutes = require("./routes/programRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const jobRoutes = require("./routes/jobRoutes");

dotenv.config();

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174", // Vite sometimes changes port
  "https://tanzania-student-career-guidance-system.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(null, false); // DO NOT throw error (this was crashing your server)
    }
  },
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/combinations", combinationRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/jobs", jobRoutes);

// --- 2. DEPLOYMENT LOGIC ---
// This serves the frontend build if we are in production
if (process.env.NODE_ENV === "production") {
  // Use 'dist' for Vite or 'build' for Create React App
  const frontendPath = path.join(__dirname, "../frontend/dist"); 
  
  app.use(express.static(frontendPath));

  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  // Local development root route
  app.get("/", (req, res) => {
    res.send("Career Guidance API Running (Development)");
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
