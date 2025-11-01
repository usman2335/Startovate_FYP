const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const cookieHeader = req.header("Cookie");
  if (!cookieHeader)
    return res.status(401).json({ message: "Missing cookie header" });

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {});

  const token = cookies.token;
  if (!token)
    return res.status(401).json({ message: "Token not found in cookies" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("=== Auth Middleware Debug ===");
    console.log("Decoded token:", decoded);

    // Fetch user from database using the ID from token
    const user = await User.findById(decoded.id).select("-password");
    console.log("User found:", user);
    console.log("User ID:", user?._id);
    console.log("User ID type:", typeof user?._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    console.log("req.user set to:", req.user);
    console.log("req.user._id:", req.user._id);
    next();
  } catch (err) {
    console.log("JWT verification error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = protect;
