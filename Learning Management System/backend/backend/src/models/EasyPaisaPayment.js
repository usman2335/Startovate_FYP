const mongoose = require("mongoose");

const easypaisaPaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: String,
  transactionId: String,
  screenshotUrl: String,
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model("EasypaisaPayment", easypaisaPaymentSchema);
