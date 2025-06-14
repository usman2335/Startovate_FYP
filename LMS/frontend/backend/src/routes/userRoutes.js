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
router.delete("/:id", protect, deleteUser);

// // ✅ Protected Route: Get currently logged-in user
//router.get("/me", protect, getUser);

// // ✅ Admin/Superadmin Protected User Management Routes
// router.post("/", protect, createUser); // Create user (admin or student)
// router.get("/", protect, getUsers); // Get all users
// router.get("/:id", protect, getUserById); // Get specific user
// router.put("/:id", protect, updateUser); // Update user
// router.delete("/:id", protect, deleteUser); // Delete user

module.exports = router;
