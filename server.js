const express = require("express");
const cors = require("cors");
const { customers, orders, policies } = require("./data");
const store = require("./store");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ---- GET /api/customer?email= ----
app.get("/api/customer", (req, res) => {
  const { email } = req.query;
  const customer = customers.find(
    (c) => email && c.email.toLowerCase() === String(email).toLowerCase()
  );
  if (!customer) return res.json({ found: false }); // not-found branch first
  return res.json({ found: true, customer });
});

// ---- GET /api/order?orderId=&customerId= ----
// customerId is optional and scopes the lookup — prevents cross-customer data leakage.
app.get("/api/order", (req, res) => {
  const { orderId, customerId } = req.query;
  const order = orders.find(
    (o) => o.orderId === orderId && (!customerId || o.customerId === customerId)
  );
  if (!order) return res.json({ found: false });
  return res.json({ found: true, order });
});

// ---- GET /api/orders-by-customer?customerId= ----
app.get("/api/orders-by-customer", (req, res) => {
  const { customerId } = req.query;
  const list = orders.filter((o) => o.customerId === customerId);
  if (list.length === 0) return res.json({ found: false, orders: [] });
  return res.json({ found: true, orders: list });
});

// ---- GET /api/policy?topic= ----
app.get("/api/policy", (req, res) => {
  const { topic } = req.query;
  const text = policies[topic];
  if (!text) return res.json({ found: false, availableTopics: Object.keys(policies) });
  return res.json({ found: true, topic, text });
});

// ---- POST /api/ticket ----
app.post("/api/ticket", (req, res) => {
  const { customerId, orderId, category, reason, summary, sessionId } = req.body;
  if (!category || !summary) {
    return res.status(400).json({ error: "category and summary are required" });
  }
  const ticket = store.createTicket({ customerId, orderId, category, reason, summary, sessionId });
  return res.json({ created: true, ticket });
});

// ---- POST /api/log ----
app.post("/api/log", (req, res) => {
  if (!req.body.sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }
  const entry = store.logTurn(req.body);
  return res.json({ logged: true, entry });
});

// ---- Debug endpoints ----
app.get("/api/_debug/tickets", (req, res) => res.json(store.getAllTickets()));
app.get("/api/_debug/conversation/:sessionId", (req, res) =>
  res.json(store.getConversation(req.params.sessionId))
);
app.post("/api/_debug/reset", (req, res) => {
  store.reset();
  res.json({ reset: true });
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Mock CS API listening on :${PORT}`));

module.exports = app;
