require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./src/config/db");

connectDB();
app.use(express.json());

const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

const port = 3000;

module.exports = app;
