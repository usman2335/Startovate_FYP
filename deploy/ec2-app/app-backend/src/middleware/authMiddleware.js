const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token = req.header("Cookie");

  if (!token) {
    return res.status(404).json({ error: "Access denied. No token provided" });
  }

  const match = token.match(/token=([^;]*)/);
  if (!match) {
    return res.status(404).json({ error: "Access denied. Token not found" });
  }

  token = match[1]; // This is the correct token
  console.log(`Extracted token: ${token}`);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Fix here
    req.user = decoded;
    console.log("Decoded user:", decoded);
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = protect;
