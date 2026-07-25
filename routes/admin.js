const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

// --- ANALYTICS ---
router.get('/analytics', async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await Customer.countDocuments();

    // Calculate total revenue from delivered/paid orders
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $in: ['Delivered', 'Shipped', 'Processing'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Get recent orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
});

// --- PRODUCTS ---
router.get('/products', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ id: -1 }).lean();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.post('/products', async (req, res, next) => {
  try {
    // Basic auto-increment logic for numeric id if not provided
    if (!req.body.id) {
      const highest = await Product.findOne().sort({ id: -1 });
      req.body.id = highest ? highest.id + 1 : 10000;
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { id: req.params.id }, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
});

// --- ORDERS ---
router.get('/orders', async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.put('/orders/:id', async (req, res, next) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// --- USERS ---
router.get('/users', async (req, res, next) => {
  try {
    const users = await Customer.find().sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
