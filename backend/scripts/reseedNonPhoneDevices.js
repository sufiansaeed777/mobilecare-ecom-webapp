// Script to reseed tablets, watches, and consoles after schema fix
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Tablet = require('../models/Tablet');
const Watch = require('../models/Watch');
const Console = require('../models/Console');
const tabletData = require('../data/tabData');
const watchData = require('../data/watchData');
const consoleData = require('../data/consoleData');

async function reseedDevices() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Reseed Tablets
    console.log('\nReseeding Tablets...');
    await Tablet.deleteMany({});
    const tabletsInserted = await Tablet.insertMany(tabletData);
    console.log(`Successfully inserted ${tabletsInserted.length} tablets`);

    // Reseed Watches
    console.log('\nReseeding Watches...');
    await Watch.deleteMany({});
    const watchesInserted = await Watch.insertMany(watchData);
    console.log(`Successfully inserted ${watchesInserted.length} watches`);

    // Reseed Consoles
    console.log('\nReseeding Consoles...');
    await Console.deleteMany({});
    const consolesInserted = await Console.insertMany(consoleData);
    console.log(`Successfully inserted ${consolesInserted.length} consoles`);

    console.log('\nReseeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error reseeding devices:', error);
    process.exit(1);
  }
}

reseedDevices();