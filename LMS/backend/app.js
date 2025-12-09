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
    origin: "https://lms-frontend-a3y.pages.dev", // frontend port (change if needed)
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);

const courseRoutes = require("./src/routes/courseRoutes");
app.use("/api/courses", courseRoutes);

// app.use("/api/courses/teachers/enrollements", courseRoutes);

const paymentRoutes = require("./src/routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

const enrollRoutes = require("./src/routes/enrollRoutes");
app.use("/api/enroll", enrollRoutes);

const feedbackRoutes = require("./src/routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("User Management API is running");
});

module.exports = app;
