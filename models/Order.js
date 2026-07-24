const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    sku: String,
    name: String,
    qty: Number,
    price: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, required: true, index: true },
    items: [itemSchema],
    status: { type: String, required: true },
    carrier: String,
    trackingNumber: String,
    shippedAt: String,
    estimatedDelivery: String,
    delayReason: String,
    returnReason: String,
    returnedAt: String,
    refundStatus: String,
    refundAmount: Number,
    cancelReason: String,
    cancelledAt: String,
    estimatedShipDate: String,
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);