// data/seedConsoles.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../../config/db');
const Console = require('../../models/Console');
const consoleData = require('./consoleData');

connectDB();

async function seedConsoles() {
  try {
    // Clear existing
    await Console.deleteMany({});
    // Insert new data
    await Console.insertMany(consoleData);
    console.log('Console data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedConsoles();
