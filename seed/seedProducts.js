const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

// Force IPv4 and Google DNS for Atlas connectivity
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

async function seed() {
  try {
    const jsonPath = path.join(__dirname, 'products.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ products.json not found in seed folder.');
      process.exit(1);
    }

    const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Filter to only live/active products
    const activeProducts = rawData.filter(p => p.isLive && p.status === 'active');

    console.log(`📦 Loaded ${activeProducts.length} active raw products.`);

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    await Product.deleteMany({});
    console.log('🗑️  Cleared old products.');

    await Product.insertMany(activeProducts);
    console.log(`🚀 Successfully seeded ${activeProducts.length} raw products in exact Manfare format!`);
    
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}

seed();
