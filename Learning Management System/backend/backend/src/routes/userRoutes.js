const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  getUser,
  createUser,
  //getUsers,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// ✅ Public Authentication Routes
router.get("/", getAllUsers); // Get currently logged-in user
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

//delete
router.delete("/:id", deleteUser);
// updating user
router.put("/:id", updateUser);

//adding the superadmin
router.post("/createAdmin", createUser); // Create user (admin or student)

module.exports = router;
