// seeders/completeProductSeeder.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = {
  phones: [
    {
      name: 'iPhone 12 Pro 128GB - Space Gray',
      brand: 'Apple',
      category: 'phones',
      price: 450,
      condition: 'Excellent',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'In Stock',
      quantity: 5,
      image: '/images/buy/iphone_12_pro.avif',
      description: 'A-grade, fully tested with 12-month warranty. Unlocked. Minimal signs of use.',
      keyFeatures: ['A14 Bionic chip', 'Super Retina XDR display', 'Pro camera system', '5G capable'],
      storage: '128GB',
      color: 'Space Gray',
      isActive: true
    },
    {
      name: 'Samsung Galaxy S21 256GB - Phantom Black',
      brand: 'Samsung',
      category: 'phones',
      price: 380,
      condition: 'Good',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'Low Stock',
      quantity: 2,
      image: '/images/buy/galaxy_s21.avif',
      description: 'Minor wear, fully functional, 6-month warranty.',
      keyFeatures: ['Dynamic AMOLED 2X', '120Hz Display', 'Snapdragon 888'],
      storage: '256GB',
      color: 'Phantom Black',
      isActive: true
    },
    {
      name: 'Google Pixel 6 128GB - Stormy Black',
      brand: 'Google',
      category: 'phones',
      price: 320,
      condition: 'Excellent',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'In Stock',
      quantity: 4,
      image: '/images/buy/pixel_6.avif',
      description: 'Like new, original box, 12-month warranty.',
      keyFeatures: ['Google Tensor chip', '50 MP Main Camera', 'Magic Eraser'],
      storage: '128GB',
      color: 'Stormy Black',
      isActive: true
    }
  ],
  tablets: [
    {
      name: 'iPad Air 4 64GB - Sky Blue',
      brand: 'Apple',
      category: 'tablets',
      price: 350,
      condition: 'Very Good',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'In Stock',
      quantity: 3,
      image: '/images/buy/ipad_air_4.avif',
      description: 'Wi-Fi model, includes charger, 12-month warranty.',
      keyFeatures: ['A14 Bionic chip', '10.9-inch Liquid Retina display', 'Touch ID'],
      storage: '64GB',
      color: 'Sky Blue',
      isActive: true
    },
    {
      name: 'Samsung Galaxy Tab S7 128GB - Mystic Black',
      brand: 'Samsung',
      category: 'tablets',
      price: 420,
      condition: 'Excellent',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'In Stock',
      quantity: 2,
      image: '/images/buy/galaxy_tab_s7.avif',
      description: 'Includes S-Pen, minimal use, 12-month warranty.',
      keyFeatures: ['120Hz LTPS TFT display', 'Snapdragon 865+', 'S Pen included'],
      storage: '128GB',
      color: 'Mystic Black',
      isActive: true
    }
  ],
  laptops: [
    {
      name: 'MacBook Air M1 256GB SSD - Silver',
      brand: 'Apple',
      category: 'laptops',
      price: 750,
      condition: 'Excellent',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'Low Stock',
      quantity: 1,
      image: '/images/buy/macbook_air_m1.avif',
      description: '8-core CPU, low battery cycle count.',
      keyFeatures: ['Apple M1 chip', '18 hours battery life', 'Fanless design'],
      storage: '256GB SSD',
      ram: '8GB',
      color: 'Silver',
      isActive: true
    },
    {
      name: 'Dell XPS 13 512GB SSD - Silver',
      brand: 'Dell',
      category: 'laptops',
      price: 680,
      condition: 'Very Good',
      deviceType: 'Refurbished',
      stockStatus: 'In Stock',
      quantity: 2,
      image: '/images/buy/dell_xps_13.avif',
      description: 'Intel i7, 16GB RAM, InfinityEdge display.',
      keyFeatures: ['11th Gen Intel Core i7', '16GB RAM', 'InfinityEdge display'],
      storage: '512GB SSD',
      ram: '16GB',
      processor: 'Intel i7 11th Gen',
      color: 'Silver',
      isActive: true
    }
  ],
  consoles: [
    {
      name: 'PlayStation 5 Disc Edition',
      brand: 'Sony',
      category: 'consoles',
      price: 390,
      condition: 'Very Good',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'In Stock',
      quantity: 3,
      image: '/images/buy/ps5_disc.avif',
      description: 'Includes one DualSense controller and cables.',
      keyFeatures: ['Ultra-high speed SSD', 'Ray tracing', 'Haptic feedback'],
      storage: '825GB SSD',
      isActive: true
    },
    {
      name: 'Nintendo Switch OLED - White',
      brand: 'Nintendo',
      category: 'consoles',
      price: 280,
      condition: 'New',
      deviceType: 'New',
      stockStatus: 'In Stock',
      quantity: 5,
      image: '/images/buy/switch_oled.avif',
      description: 'Vibrant 7-inch OLED screen, enhanced audio.',
      keyFeatures: ['7-inch OLED screen', 'Enhanced audio', '64GB storage'],
      storage: '64GB',
      color: 'White',
      isActive: true
    }
  ],
  accessories: [
    {
      name: 'Apple AirPods Pro (1st Gen)',
      brand: 'Apple',
      category: 'accessories',
      price: 120,
      condition: 'Excellent',
      deviceType: 'Certified Pre-Owned',
      stockStatus: 'Low Stock',
      quantity: 2,
      image: '/images/buy/airpods_pro.avif',
      description: 'Cleaned and sanitized, includes MagSafe case.',
      keyFeatures: ['Active Noise Cancellation', 'Transparency mode', 'Spatial audio'],
      compatibility: 'iOS Devices',
      isActive: true
    },
    {
      name: 'Anker PowerCore 20000mAh Power Bank',
      brand: 'Anker',
      category: 'accessories',
      price: 35,
      condition: 'New',
      deviceType: 'New',
      stockStatus: 'In Stock',
      quantity: 10,
      image: '/images/buy/anker_powercore.avif',
      description: 'High-capacity portable charger.',
      keyFeatures: ['20000mAh capacity', 'PowerIQ technology', 'MultiProtect safety'],
      capacity: '20000mAh',
      isActive: true
    }
  ]
};

const seedAllProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mobile-care');
    console.log('Connected to MongoDB');
    
    // Clear all existing products
    await Product.deleteMany({});
    console.log('Cleared all existing products');
    
    // Combine all products
    const allProducts = [
      ...products.phones,
      ...products.tablets,
      ...products.laptops,
      ...products.watches,
      ...products.consoles,
      ...products.accessories
    ];
    
    // Insert all products
    const result = await Product.insertMany(allProducts);
    console.log(`Inserted ${result.length} products across all categories`);
    
    // Log category counts
    const categoryCounts = {};
    allProducts.forEach(product => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });
    
    console.log('\nProducts per category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });
    
    console.log('\nSeeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedAllProducts();