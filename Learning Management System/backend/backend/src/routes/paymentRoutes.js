const express = require("express");
const {
  createSession,
  getSession,
} = require("../controllers/stripePaymentController");
const {
  upload,
  handleEasypaisaPayment,
  getEasypaisaPayments,
  approveEasypaisaPayment,
} = require("../controllers/easyPaisaController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-checkout-session", protect, createSession);
router.get("/session-status", protect, getSession);

router.post(
  "/easypaisa-submit",
  protect,
  upload.single("screenshot"),
  handleEasypaisaPayment
);

router.get("/easypaisa-pending", getEasypaisaPayments);
router.put("/easypaisa-approve/:paymentId", approveEasypaisaPayment);

module.exports = router;
