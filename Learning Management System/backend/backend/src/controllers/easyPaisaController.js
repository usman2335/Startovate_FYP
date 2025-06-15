const multer = require("multer");
const path = require("path");
const EasypaisaPayment = require("../models/EasyPaisaPayment");

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
    const { fullName, transactionId } = req.body;
    const screenshotUrl = `/uploads/${req.file.filename}`;

    await EasypaisaPayment.create({
      userId: req.user._id,
      fullName,
      transactionId,
      screenshotUrl,
    });

    res.status(200).json({ message: "Submitted for verification" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submission failed" });
  }
};

module.exports = {
  upload,
  handleEasypaisaPayment,
};
