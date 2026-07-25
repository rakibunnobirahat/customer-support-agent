const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "unverified"], default: "pending" },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // Auto-expires after 5 mins
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", otpSchema);