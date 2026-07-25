const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'main' }, // singleton document
  currency: {
    code: { type: String, default: 'BDT' },
    symbol: { type: String, default: 'Tk' },
    symbolPosition: { type: String, enum: ['before', 'after'], default: 'before' },
    name: { type: String, default: 'Bangladeshi Taka' },
  },
  storeName: { type: String, default: 'Manfare' },
  storeEmail: { type: String, default: '' },
  storePhone: { type: String, default: '+880 1606999615' },
}, { timestamps: true });

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
