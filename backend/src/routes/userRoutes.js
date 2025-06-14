const express = require("express");
const {
  signup,
  getUser,
  login,
  logout,
  markUserAsSubscribed,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleWare");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getUser", protect, getUser);
router.patch("/mark-subscribed", protect, markUserAsSubscribed);

module.exports = router;
