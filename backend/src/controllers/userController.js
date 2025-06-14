const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      canvasId: user.canvasId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: "user", // Default to 'user' if not provided
      canvasId: null, // No canvas assigned at signup
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side access (XSS protection)
      secure: true, // HTTPS in production
      sameSite: "Strict", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true, // Use only in production with HTTPS
    sameSite: "Strict",
    expires: new Date(0), // Expire immediately
  });

  res.status(200).json({ message: "Logged out successfully" });
};

exports.getUser = async (req, res) => {
  try {
    // const user = req.user;
    const userId = req.user.id;
    const user = await User.findById(userId).select(
      "fullName email role isSubscribed"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isSubscribed: user.isSubscribed,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "500" + error.message });
  }
};

exports.updateHasCanvas = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { hasCanvas: true });
  } catch (error) {}
};

exports.markUserAsSubscribed = async (req, res) => {
  try {
    console.log("Marking user as subscribed called");
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isSubscribed: true },
      { new: true }
    );

    res.status(200).json({ message: "User marked as subscribed", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update subscription status" });
  }
};
