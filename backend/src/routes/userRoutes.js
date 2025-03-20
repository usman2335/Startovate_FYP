const express = require("express");
const {
  signup,
  getUser,
  login,
  logout,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleWare");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getUser", protect, getUser);

module.exports = router;
