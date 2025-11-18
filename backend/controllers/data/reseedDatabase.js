// data/reseedDatabase.js
const fs = require('fs').promises;
const path = require('path');
const Phone = require('../models/Phone');

async function reseedFromFile() {
  try {
    // Read the phoneData.js file
    const phoneDataPath = path.join(__dirname, 'phoneData.js');
    delete require.cache[require.resolve(phoneDataPath)]; // Clear cache
    const phoneData = require(phoneDataPath);
    
    // Clear existing phones
    await Phone.deleteMany({});
    
    // Insert new phones
    if (Array.isArray(phoneData) && phoneData.length > 0) {
      await Phone.insertMany(phoneData);
      console.log('Database reseeded successfully from phoneData.js');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error reseeding database:', error);
    return false;
  }
}

module.exports = { reseedFromFile };