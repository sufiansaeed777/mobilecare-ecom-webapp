// data/seedWatches.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../../config/db');
const Watch = require('../../models/Watch'); // Make sure this file exists and exports a Mongoose model
const watchData = require('./watchData'); // This should be your JSON array of watch objects

connectDB();

async function seedWatches() {
  try {
    // Clear existing watch documents
    await Watch.deleteMany({});

    // Insert the new watch data
    await Watch.insertMany(watchData);

    console.log('Watch data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding watch data:', err);
    process.exit(1);
  }
}

seedWatches();
