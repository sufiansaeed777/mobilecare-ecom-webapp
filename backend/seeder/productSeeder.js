// seeders/productSeeder.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = {
  watches: [
    {
      name: 'Apple Watch SE 44mm - Gold Aluminum',
      brand: 'Apple',
      category: 'watches',
      price: 180,
      condition: 'Good',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'In Stock',
      quantity: 3,
      image: '/images/buy/apple_watch_se.avif',
      description: 'GPS model, includes sports band. Some light scratches on screen, not affecting functionality.',
      keyFeatures: ['Large Retina OLED display', 'Fall detection', 'Swimproof'],
      color: 'Gold Aluminum',
      caseSize: '44mm',
      isActive: true
    },
    {
      name: 'Samsung Galaxy Watch 4 40mm - Black',
      brand: 'Samsung',
      category: 'watches',
      price: 150,
      condition: 'Excellent',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'In Stock',
      quantity: 5,
      image: '/images/buy/galaxy_watch_4.avif',
      description: 'Sleek design with advanced health tracking features.',
      keyFeatures: ['BioActive Sensor', 'Wear OS Powered by Samsung', 'ECG monitoring'],
      color: 'Black',
      caseSize: '40mm',
      isActive: true
    },
    {
      name: 'Apple Watch Series 8 45mm - Midnight',
      brand: 'Apple',
      category: 'watches',
      price: 380,
      condition: 'Excellent',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'Low Stock',
      quantity: 1,
      image: '/images/buy/apple_watch_s8.avif',
      description: 'Latest features including temperature sensing and crash detection. Includes original box and charger.',
      keyFeatures: ['Temperature sensing', 'Crash detection', 'Always-On Retina display', 'Blood oxygen app'],
      color: 'Midnight',
      caseSize: '45mm',
      isActive: true
    },
    {
      name: 'Garmin Venu 2 - Granite Blue',
      brand: 'Garmin',
      category: 'watches',
      price: 250,
      condition: 'Very Good',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'In Stock',
      quantity: 2,
      image: '/images/buy/garmin_venu_2.avif',
      description: 'GPS smartwatch with advanced health monitoring and fitness features.',
      keyFeatures: ['AMOLED display', 'Health Snapshot', 'Body Battery energy', 'Sleep score'],
      color: 'Granite Blue',
      caseSize: '45mm',
      isActive: true
    }
  ]
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mobile-care');
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({ category: 'watches' });
    console.log('Cleared existing watch products');
    
    // Insert new products
    const allProducts = [...products.watches];
    const result = await Product.insertMany(allProducts);
    console.log(`Inserted ${result.length} products`);
    
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();