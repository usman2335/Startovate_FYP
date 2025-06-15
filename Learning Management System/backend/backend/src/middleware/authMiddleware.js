const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
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
    req.user = typeof decoded.id === "object" ? decoded.id : decoded;
    console.log("User authenticated:", req.user);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = protect;
