const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const Product = require('../models/Product');

// Force IPv4 and Google DNS for Atlas connectivity
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const initialProducts = [
  {
    slug: 'chronograph-elite-black',
    name: 'Chronograph Elite Black',
    category: 'watches',
    price: 349.99,
    originalPrice: 449.99,
    discount: 22,
    rating: 4.8,
    reviewCount: 124,
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
    ],
    colors: ['Black', 'Silver', 'Gold'],
    sizes: ['40mm', '42mm', '44mm'],
    description: 'Precision-crafted chronograph with Japanese quartz movement, sapphire crystal glass, and genuine Italian leather strap. Water-resistant to 100 meters.',
    features: ['Japanese Quartz Movement', 'Sapphire Crystal', 'Italian Leather', '100m Water Resistant'],
    inStock: true,
    stockCount: 15,
    sku: 'WCH-001-BLK',
    tags: ['bestseller', 'new-arrival'],
    material: 'Stainless Steel',
  },
  {
    slug: 'minimalist-rose-gold',
    name: 'Minimalist Rose Gold',
    category: 'watches',
    price: 279.99,
    rating: 4.6,
    reviewCount: 87,
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    ],
    colors: ['Rose Gold', 'Silver'],
    sizes: ['38mm', '40mm'],
    description: 'Elegant minimalist timepiece with rose gold PVD coating, mesh bracelet, and Swiss movement. The perfect dress watch.',
    features: ['Swiss Movement', 'PVD Coating', 'Mesh Bracelet', '50m Water Resistant'],
    inStock: true,
    stockCount: 23,
    sku: 'WCH-002-RG',
    tags: ['trending'],
    material: 'Rose Gold PVD Steel',
  },
  {
    slug: 'diver-automatic-blue',
    name: 'Diver Automatic Blue',
    category: 'watches',
    price: 599.99,
    originalPrice: 749.99,
    discount: 20,
    rating: 4.9,
    reviewCount: 203,
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    ],
    colors: ['Blue', 'Black', 'Green'],
    sizes: ['42mm', '44mm'],
    description: 'Professional dive watch with automatic movement, rotating bezel, and luminous dial. Built for deep-sea exploration.',
    features: ['Automatic Movement', 'Rotating Bezel', 'Luminous Dial', '300m Water Resistant'],
    inStock: true,
    stockCount: 8,
    sku: 'WCH-003-BLU',
    tags: ['bestseller'],
    material: 'Titanium',
  },
  {
    slug: 'carbon-fiber-wallet',
    name: 'Carbon Fiber Slim Wallet',
    category: 'accessories',
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    rating: 4.7,
    reviewCount: 312,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    ],
    colors: ['Black', 'Navy'],
    sizes: ['One Size'],
    description: 'Ultra-slim RFID-blocking wallet crafted from genuine carbon fiber and full-grain leather. Holds 8 cards with quick-access slot.',
    features: ['RFID Blocking', 'Carbon Fiber', 'Full-Grain Leather', '8 Card Slots'],
    inStock: true,
    stockCount: 45,
    sku: 'ACC-001-BLK',
    tags: ['bestseller'],
    material: 'Carbon Fiber & Leather',
  },
  {
    slug: 'beard-grooming-kit',
    name: 'Premium Beard Grooming Kit',
    category: 'grooming',
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    rating: 4.9,
    reviewCount: 267,
    images: [
      'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&q=80',
      'https://images.unsplash.com/photo-1621607505833-64e5e0e26f28?w=800&q=80',
    ],
    colors: ['Natural'],
    sizes: ['Full Kit'],
    description: 'Complete beard care set: oil, balm, wooden comb, boar bristle brush, and scissors in a handcrafted wooden box.',
    features: ['Natural Ingredients', 'Wooden Box', 'Boar Bristle Brush', '5-Piece Set'],
    inStock: true,
    stockCount: 35,
    sku: 'GRM-001-NAT',
    tags: ['bestseller', 'trending'],
    material: 'Natural Oils & Wood',
  },
  {
    slug: 'merino-wool-sweater',
    name: 'Merino Wool Crew Sweater',
    category: 'clothing',
    price: 129.99,
    originalPrice: 169.99,
    discount: 24,
    rating: 4.6,
    reviewCount: 145,
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80',
    ],
    colors: ['Charcoal', 'Navy', 'Burgundy', 'Forest Green'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Extra-fine merino wool crew neck sweater. Naturally temperature-regulating, breathable, and machine washable.',
    features: ['100% Merino Wool', 'Machine Washable', 'Temperature Regulating', 'Anti-Odor'],
    inStock: true,
    stockCount: 40,
    sku: 'CLT-001-CHR',
    tags: ['trending'],
    material: 'Merino Wool',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Seed: Connected to MongoDB.');

    // Clear old products
    await Product.deleteMany({});
    console.log('Seed: Cleared old products.');

    // Insert new
    await Product.insertMany(initialProducts);
    console.log('Seed: Successfully seeded products!');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}

seed();
