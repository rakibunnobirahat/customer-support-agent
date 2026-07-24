const mongoose = require("mongoose");

// strict: false allows dynamic log entry fields without breaking schema
const conversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("Conversation", conversationSchema);