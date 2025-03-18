const express = require("express");
const { signup, getUser, login } = require("../controllers/userController");
const protect = require("../middleware/authMiddleWare");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getUser", protect, getUser);

module.exports = router;
