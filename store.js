// Runtime store for tickets and conversation logs.
// In production this is a real DB (Mongo collections `tickets` / `conversations`).
// Kept separate from data.js so you can reset runtime state between test runs
// without touching seed data.

let tickets = [];
let conversations = [];
let ticketSeq = 1;

function createTicket({ customerId, orderId, category, reason, summary, sessionId }) {
  const ticket = {
    ticketId: `TCK-${1000 + ticketSeq++}`,
    customerId: customerId || null,
    orderId: orderId || null,
    category, // no_data_found | sensitive | explicit_human_request | tool_failure | low_confidence
    reason: reason || null,
    summary,
    sessionId,
    status: "pending_human",
    createdAt: new Date().toISOString(),
  };
  tickets.push(ticket);
  return ticket;
}

function logTurn(entry) {
  const withTimestamp = { ...entry, timestamp: new Date().toISOString() };
  conversations.push(withTimestamp);
  return withTimestamp;
}

function getConversation(sessionId) {
  return conversations.filter((c) => c.sessionId === sessionId);
}

function getAllTickets() {
  return tickets;
}

function reset() {
  tickets = [];
  conversations = [];
  ticketSeq = 1;
}

module.exports = { createTicket, logTurn, getConversation, getAllTickets, reset };
