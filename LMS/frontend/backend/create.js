const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
require("dotenv").config();

const createSuperadmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existing = await User.findOne({ email: "admin@example.com" });
    if (existing) {
      console.log("Superadmin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin", 10);

    const superadmin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "superadmin",
    });

    await superadmin.save();
    console.log("Superadmin created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating superadmin:", err);
    process.exit(1);
  }
};

createSuperadmin();
