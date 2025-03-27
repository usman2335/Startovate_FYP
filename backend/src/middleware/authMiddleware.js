const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token = req.header("Cookie");
  if (!token) {
    return res.status(404).json({ error: "Access denied. No token provided" });
  } //else {
  //   token = token.split(";")[0].replace("Bearer=", "");
  //   console.log(`token is:${token}`);
  // }

  const match = token.match(/token=([^;]*)/);
  if (!match) {
    return res.status(404).json({ error: "Access denied. Token not found" });
  }

  token = match[1]; // Extracted token value
  console.log(`Extracted token: ${token}`);

  try {
    const decoded = jwt.verify(
      token.replace("token=", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = protect;
