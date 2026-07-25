const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, default: null, index: true },
    orderId: { type: String, default: null },
    category: { type: String, required: true },
    reason: { type: String, default: null },
    summary: { type: String, required: true },
    sessionId: { type: String, default: null },
    status: {
      type: String,
      default: "pending_human",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);