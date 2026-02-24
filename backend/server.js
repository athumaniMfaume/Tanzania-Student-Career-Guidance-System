const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const combinationRoutes = require("./routes/combinationRoutes");
const programRoutes = require("./routes/programRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const jobRoutes = require("./routes/jobRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/combinations", combinationRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.send("Career Guidance API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));