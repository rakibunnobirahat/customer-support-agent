const Ticket = require("./models/Ticket");
const Conversation = require("./models/Conversation");

// Creates ticket with auto-incrementing ID (TCK-1001, TCK-1002, etc.)
async function createTicket({ customerId, orderId, category, reason, summary, sessionId }) {
  const count = await Ticket.countDocuments();
  const ticketId = `TCK-${1001 + count}`;

  const ticket = await Ticket.create({
    ticketId,
    customerId: customerId || null,
    orderId: orderId || null,
    category,
    reason: reason || null,
    summary,
    sessionId,
    status: "pending_human",
  });

  const doc = ticket.toObject();
  delete doc._id;
  delete doc.__v;
  return doc;
}

// Logs conversation turn directly into MongoDB
async function logTurn(entry) {
  const log = await Conversation.create(entry);
  const doc = log.toObject();
  delete doc._id;
  delete doc.__v;
  return doc;
}

// Fetches logs for a given sessionId
async function getConversation(sessionId) {
  return await Conversation.find({ sessionId }).select("-_id -__v").lean();
}

// Fetches all tickets
async function getAllTickets() {
  return await Ticket.find().select("-_id -__v").lean();
}

// Updates ticket status (e.g. pending_human -> resolved)
async function updateTicketStatus(ticketId, status) {
  return await Ticket.findOneAndUpdate(
    { ticketId },
    { status },
    { new: true }
  )
    .select("-_id -__v")
    .lean();
}

// Resets runtime collections between test runs
async function reset() {
  await Ticket.deleteMany({});
  await Conversation.deleteMany({});
  return true;
}

module.exports = {
  createTicket,
  logTurn,
  getConversation,
  getAllTickets,
  updateTicketStatus,
  reset,
};