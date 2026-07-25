const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ---- GET /api/products ----
router.get('/', async (req, res, next) => {
  try {
    const { category, tag, q } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (tag) {
      filter.tags = tag;
    }
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { material: { $regex: q, $options: 'i' } },
      ];
    }

    const list = await Product.find(filter).lean();
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
