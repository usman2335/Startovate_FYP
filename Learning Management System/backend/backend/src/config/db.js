const mongoose = require("mongoose");
require("dotenv").config(); // Ensure dotenv is loaded

const connectDB = async () => {
  try {
    console.log("MongoDB URI from .env:", process.env.MONGO_URI); // Debug log

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined. Check your .env file.");
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(process.env.MONGO_URI);

    console.error(`Error for db : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
