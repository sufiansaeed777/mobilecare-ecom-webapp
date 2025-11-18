// repairRoutes.js
const express = require('express');
const router = express.Router();
const Console = require('../models/Console');

router.get('/', async (req, res) => {
  const { brand, model } = req.query;
  console.log('Received query params - brand:', brand, 'model:', model);

  try {
    if (brand && model) {
      // Trim whitespace, case-insensitive match
      const doc = await Console.findOne({
        brand: new RegExp(`^${brand.trim()}$`, 'i'),
        model: new RegExp(`^${model.trim()}$`, 'i'),
      });
      console.log('Found document:', doc);
      if (!doc) {
        // No matching console, return empty array
        return res.json([]);
      }
      // Return the array of repairs
      return res.json(doc.repairs);
    }
    // If brand or model not provided, return empty
    return res.json([]);
  } catch (error) {
    console.error('Error in repairRoutes:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
