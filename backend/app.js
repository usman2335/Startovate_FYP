require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./src/config/db");

connectDB();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));

const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);
const canvasRoutes = require("./src/routes/canvasRoutes");
app.use("/api/canvas", canvasRoutes);
const templateRoutes = require("./src/routes/templateRoutes");
app.use("/api/template", templateRoutes);
const paymentRoutes = require("./src/routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
