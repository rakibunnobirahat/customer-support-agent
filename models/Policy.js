const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, unique: true, index: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Policy', policySchema);