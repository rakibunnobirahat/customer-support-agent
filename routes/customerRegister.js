const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// ---- POST /api/customer/register ----
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and Email are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if customer exists
    const existing = await Customer.findOne({
      email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') },
    }).lean();

    if (existing) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
    }

    // Create new customer with auto generated ID
    const count = await Customer.countDocuments();
    const customerId = `CUST-${1001 + count}`;

    const newCustomer = await Customer.create({
      customerId,
      name,
      email: cleanEmail,
      phone: phone || '',
    });

    return res.json({ success: true, customer: newCustomer });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
