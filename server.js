const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const store = require("./store");

// Mongoose Models
const Customer = require("./models/Customer");
const Order = require("./models/Order");
const Policy = require("./models/Policy");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ---- GET /api/customer?email= ----
app.get("/api/customer", async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.json({ found: false });

    // Case-insensitive exact match search on email
    const customer = await Customer.findOne({
      email: { $regex: new RegExp(`^${email.trim()}$`, "i") },
    })
      .select("-_id -__v")
      .lean();

    if (!customer) return res.json({ found: false });
    return res.json({ found: true, customer });
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/order?orderId=&customerId= ----
// customerId is optional and scopes the lookup — prevents cross-customer data leakage.
app.get("/api/order", async (req, res, next) => {
  try {
    const { orderId, customerId } = req.query;
    if (!orderId) return res.json({ found: false });

    const query = { orderId };
    if (customerId) query.customerId = customerId;

    const order = await Order.findOne(query).select("-_id -__v").lean();

    if (!order) return res.json({ found: false });
    return res.json({ found: true, order });
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/orders-by-customer?customerId= ----
app.get("/api/orders-by-customer", async (req, res, next) => {
  try {
    const { customerId } = req.query;
    if (!customerId) return res.json({ found: false, orders: [] });

    const list = await Order.find({ customerId }).select("-_id -__v").lean();

    if (list.length === 0) return res.json({ found: false, orders: [] });
    return res.json({ found: true, orders: list });
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/policy?topic= ----
app.get("/api/policy", async (req, res, next) => {
  try {
    const { topic } = req.query;

    if (!topic) {
      const allPolicies = await Policy.find().select("topic -_id").lean();
      const availableTopics = allPolicies.map((p) => p.topic);
      return res.json({ found: false, availableTopics });
    }

    const policy = await Policy.findOne({
      topic: { $regex: new RegExp(`^${topic.trim()}$`, "i") },
    })
      .select("-_id -__v")
      .lean();

    if (!policy) {
      const allPolicies = await Policy.find().select("topic -_id").lean();
      const availableTopics = allPolicies.map((p) => p.topic);
      return res.json({ found: false, availableTopics });
    }

    return res.json({ found: true, topic: policy.topic, text: policy.text });
  } catch (error) {
    next(error);
  }
});

// ---- POST /api/ticket ----
app.post("/api/ticket", async (req, res, next) => {
  try {
    const { customerId, orderId, category, reason, summary, sessionId } = req.body;
    if (!category || !summary) {
      return res.status(400).json({ error: "category and summary are required" });
    }

    const ticket = await store.createTicket({
      customerId,
      orderId,
      category,
      reason,
      summary,
      sessionId,
    });

    return res.json({ created: true, ticket });
  } catch (error) {
    next(error);
  }
});

// ---- PATCH /api/ticket/:ticketId ----
app.patch("/api/ticket/:ticketId", async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "status is required" });
    }

    const ticket = await store.updateTicketStatus(ticketId, status);
    if (!ticket) {
      return res.status(404).json({ found: false, error: "Ticket not found" });
    }

    return res.json({ updated: true, ticket });
  } catch (error) {
    next(error);
  }
});

// ---- POST /api/log ----
app.post("/api/log", async (req, res, next) => {
  try {
    if (!req.body.sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }
    const entry = await store.logTurn(req.body);
    return res.json({ logged: true, entry });
  } catch (error) {
    next(error);
  }
});

// ---- Debug Endpoints ----
app.get("/api/_debug/tickets", async (req, res, next) => {
  try {
    const tickets = await store.getAllTickets();
    return res.json(tickets);
  } catch (error) {
    next(error);
  }
});

app.get("/api/_debug/conversation/:sessionId", async (req, res, next) => {
  try {
    const logs = await store.getConversation(req.params.sessionId);
    return res.json(logs);
  } catch (error) {
    next(error);
  }
});

app.post("/api/_debug/reset", async (req, res, next) => {
  try {
    await store.reset();
    return res.json({ reset: true });
  } catch (error) {
    next(error);
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

// Global Error Handler (MUST be defined after all routes)
app.use((err, req, res, next) => {
  console.error("API Error:", err.message);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => console.log(`Mock CS API listening on :${PORT}`));

module.exports = app;