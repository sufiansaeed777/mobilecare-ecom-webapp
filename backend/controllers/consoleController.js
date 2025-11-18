// controllers/consoleController.js
const Console = require('../models/Console');

// Get all consoles
exports.getAllConsoles = async (req, res) => {
  try {
    const consoles = await Console.find({});
    res.json(consoles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single console by ID
exports.getConsoleById = async (req, res) => {
  try {
    const console = await Console.findById(req.params.id);
    if (!console) {
      return res.status(404).json({ message: 'Console not found' });
    }
    res.json(console);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new console
exports.createConsole = async (req, res) => {
  try {
    const newConsole = new Console(req.body);
    const savedConsole = await newConsole.save();
    res.status(201).json(savedConsole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a console
exports.updateConsole = async (req, res) => {
  try {
    const updated = await Console.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Console not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a console
exports.deleteConsole = async (req, res) => {
  try {
    const deleted = await Console.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Console not found' });
    }
    res.json({ message: 'Console deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get repairs for a specific console by brand and model
exports.getConsoleRepairs = async (req, res) => {
  try {
    const { brand, model } = req.query;
    
    console.log('Getting repairs for console:', { brand, model });
    
    if (!brand || !model) {
      return res.status(400).json({ message: 'Brand and model are required' });
    }

    // Try exact match first
    let console = await Console.findOne({
      brand: brand,
      model: model
    });

    // If no exact match, try case-insensitive
    if (!console) {
      console = await Console.findOne({
        brand: new RegExp(`^${escapeRegExp(brand)}$`, 'i'),
        model: new RegExp(`^${escapeRegExp(model)}$`, 'i')
      });
    }

    // If still no match, try with more flexible matching
    if (!console) {
      // Handle cases where model might have slight variations
      const modelVariations = [
        model,
        model.toLowerCase(),
        model.replace(/\s+/g, ' ').trim(), // normalize spaces
        model.replace(/playstation/gi, 'PlayStation'),
        model.replace(/PlayStation/gi, 'playstation'),
        model.replace(/xbox/gi, 'Xbox'),
        model.replace(/Xbox/gi, 'xbox'),
        model.replace(/switch/gi, 'Switch'),
        model.replace(/Switch/gi, 'switch'),
      ];

      for (const variant of modelVariations) {
        console = await Console.findOne({
          brand: new RegExp(`^${escapeRegExp(brand)}$`, 'i'),
          model: new RegExp(`^${escapeRegExp(variant)}$`, 'i')
        });
        if (console) break;
      }
    }
    
    if (!console) {
      console.log('Console not found for:', { brand, model });
      // Return empty repairs array instead of 404 to prevent frontend errors
      return res.json([]);
    }
    
    console.log('Found console:', console.brand, console.model);
    res.json(console.repairs || []);
  } catch (err) {
    console.error('Error in getConsoleRepairs:', err);
    res.status(500).json({ error: err.message });
  }
};

// Utility function to escape special regex characters
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};