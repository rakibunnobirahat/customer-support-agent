const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ---- GET /api/products ----
router.get('/', async (req, res, next) => {
  try {
    const { category, tag, q } = req.query;
    const filter = {};

    if (category) {
      filter['category.slug'] = category;
    }

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } }
      ];
    }

    // Simulate 'tags' based on raw Manfare data
    if (tag === 'bestseller') {
      filter['review.totalReview'] = { $gt: 0 };
    }
    if (tag === 'new-arrival') {
      // Products created in the last 90 days, or just highest IDs.
      // Since it's raw data, we can just sort by ID desc and limit if we wanted, 
      // but let's just let it pull recent ones. 
      // A simple approximation is getting everything and sorting.
      // For now, no strict filter on new-arrival, just sorting handles it.
    }

    // Sort by id descending (newest first)
    const list = await Product.find(filter).sort({ id: -1 }).lean();
    return res.json(list);
  } catch (error) {
    next(error);
  }
});

// ---- GET /api/products/:slug ----
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
