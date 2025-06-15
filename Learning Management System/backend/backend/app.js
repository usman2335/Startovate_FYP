require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./src/config/db");

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // frontend port (change if needed)
    credentials: true,
  })
);
app.use(express.json());

// Routes
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);

const courseRoutes = require("./src/routes/courseRoutes");
app.use("/api/courses", courseRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("User Management API is running");
});

module.exports = app;
