const express = require("express");
const {
  createSession,
  getSession,
} = require("../controllers/stripePaymentController");
const protect = require("../middleware/authMiddleware");

// const {
//   upload,
//   handleEasypaisaPayment,
// } = require("../controllers/easyPaisaController");

const router = express.Router();

router.post("/create-checkout-session", protect, createSession);
router.get("/session-status", protect, getSession);

// router.post(
//   "/easypaisa-submit",
//   protect,
//   upload.single("screenshot"),
//   handleEasypaisaPayment
// );

module.exports = router;
