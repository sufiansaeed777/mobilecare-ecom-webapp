// Comprehensive seed file for all device types
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import all models
const Phone = require('./models/Phone');
const Tablet = require('./models/Tablet');
const Watch = require('./models/Watch');
const Console = require('./models/Console');

// Import all data files
const phoneData = require('./controllers/data/phoneData');
const tabletData = require('./controllers/data/tabData');
const watchData = require('./controllers/data/watchData');
const consoleData = require('./controllers/data/consoleData');

async function seedAllDevices() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Seed Phones
    console.log('\n--- Seeding Phones ---');
    await Phone.deleteMany({});
    const phonesInserted = await Phone.insertMany(phoneData);
    console.log(`✓ Successfully inserted ${phonesInserted.length} phones`);

    // Seed Tablets
    console.log('\n--- Seeding Tablets ---');
    await Tablet.deleteMany({});
    const tabletsInserted = await Tablet.insertMany(tabletData);
    console.log(`✓ Successfully inserted ${tabletsInserted.length} tablets`);

    // Seed Watches
    console.log('\n--- Seeding Watches ---');
    await Watch.deleteMany({});
    const watchesInserted = await Watch.insertMany(watchData);
    console.log(`✓ Successfully inserted ${watchesInserted.length} watches`);

    // Seed Consoles
    console.log('\n--- Seeding Consoles ---');
    await Console.deleteMany({});
    const consolesInserted = await Console.insertMany(consoleData);
    console.log(`✓ Successfully inserted ${consolesInserted.length} consoles`);

    // Summary
    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
    console.log(`Total devices seeded: ${phonesInserted.length + tabletsInserted.length + watchesInserted.length + consolesInserted.length}`);
    console.log('- Phones:', phonesInserted.length);
    console.log('- Tablets:', tabletsInserted.length);
    console.log('- Watches:', watchesInserted.length);
    console.log('- Consoles:', consolesInserted.length);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding devices:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAllDevices();