const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
    images: [{ type: String }],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    description: { type: String, required: true },
    features: [{ type: String }],
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    material: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
