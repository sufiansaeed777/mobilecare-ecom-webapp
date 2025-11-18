// data/seedPhones.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../../../config/db');
const Phone = require('../../../models/Phone');
const phoneData = require('./phoneData'); // This file should export your JSON array of phone objects

connectDB();

async function seedPhones() {
  try {
    // Clear out any existing phone documents
    await Phone.deleteMany({});
    
    // Insert the new phone data
    await Phone.insertMany(phoneData);

    console.log('Phone data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding phone data:', err);
    process.exit(1);
  }
}

seedPhones();
