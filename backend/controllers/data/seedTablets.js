// data/seedTablets.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../../config/db');
const Tablet = require('../../models/Tablet');
const tabData = require('./tabData'); // This file should export a flat array

// Debug: Check if tabData is an array
console.log("Is tabData an array?", Array.isArray(tabData));
console.log("Tablet Data Sample:", tabData.slice(0, 2)); // Show first two entries for verification

async function seedTablets() {
  try {
    // Remove existing tablet documents
    await Tablet.deleteMany({});
    // Insert the new tablet data
    await Tablet.insertMany(tabData);
    console.log('Tablet data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding tablet data:', err);
    process.exit(1);
  }
}

// Wait for the DB connection to be established before seeding
connectDB()
  .then(() => {
    seedTablets();
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
