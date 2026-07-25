const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Should be hashed in a real app
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      zipCode: { type: String },
      country: { type: String, default: 'Bangladesh' }
    },
    status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
