const express = require('express');
const router = express.Router();
const StoreSettings = require('../models/StoreSettings');

// GET /api/settings — returns current store settings (or defaults)
router.get('/', async (req, res, next) => {
  try {
    let settings = await StoreSettings.findById('main');
    if (!settings) {
      // Create the singleton with defaults on first access
      settings = await StoreSettings.create({ _id: 'main' });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// PUT /api/settings — update store settings
router.put('/', async (req, res, next) => {
  try {
    const settings = await StoreSettings.findByIdAndUpdate(
      'main',
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
