const multer = require("multer");
const path = require("path");
const EasypaisaPayment = require("../models/EasyPaisaPayment");
const StudentCourse = require("../models/StudentCourse");

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Easypaisa payment handler
const handleEasypaisaPayment = async (req, res) => {
  try {
    const { fullName, transactionId, courseId } = req.body;
    const screenshotUrl = `/uploads/${req.file.filename}`;
    if (!transactionId || !courseId || !req.file) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await EasypaisaPayment.create({
      userId: req.user._id,
      courseId,
      fullName,
      transactionId,
      screenshotUrl,
      isVerified: false,
    });

    res.status(200).json({ message: "Submitted for verification" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submission failed" });
  }
};

const getEasypaisaPayments = async (req, res) => {
  try {
    const pending = await EasypaisaPayment.find({ isVerified: false })
      .populate("userId", "name email")
      .populate("courseId", "title");

    res.status(200).json({ payments: pending });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending payments" });
  }
};

const approveEasypaisaPayment = async (req, res) => {
  try {
    const payment = await EasypaisaPayment.findById(req.params.paymentId);

    if (!payment) return res.status(404).json({ error: "Payment not found" });

    payment.isVerified = true;
    await payment.save();

    // Enroll the user
    await StudentCourse.create({
      student: payment.userId,
      course: payment.courseId,
      progress: 0,
      completed: false,
    });

    res.status(200).json({ message: "Payment approved and course enrolled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Approval failed" });
  }
};

module.exports = {
  upload,
  handleEasypaisaPayment,
  getEasypaisaPayments,
  approveEasypaisaPayment,
};
