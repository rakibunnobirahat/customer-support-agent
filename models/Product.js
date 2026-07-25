const mongoose = require('mongoose');

// We use strict: false so MongoDB accepts the exact Manfare schema.
// We only define top-level fields needed for queries/indexing.
const productSchema = new mongoose.Schema(
  {
    id:               { type: Number, required: true, unique: true },
    slug:             { type: String, required: true, index: true },
    name:             { type: String, required: true },
    isLive:           { type: Boolean, default: true },
    status:           { type: String, default: 'active' },
    "category.slug":  { type: String, index: true },
  },
  { 
    strict: false,       // Save everything in the raw JSON
    timestamps: false    // Do not override Manfare's createdAt/updatedAt
  }
);

module.exports = mongoose.model('Product', productSchema);
