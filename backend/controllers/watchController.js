// controllers/watchController.js
const Watch = require('../models/Watch');

// Get all watches
exports.getAllWatches = async (req, res) => {
  try {
    const watches = await Watch.find({});
    res.json(watches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single watch by ID
exports.getWatchById = async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }
    res.json(watch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new watch
exports.createWatch = async (req, res) => {
  try {
    const newWatch = new Watch(req.body);
    const savedWatch = await newWatch.save();
    res.status(201).json(savedWatch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a watch
exports.updateWatch = async (req, res) => {
  try {
    const updated = await Watch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Watch not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a watch
exports.deleteWatch = async (req, res) => {
  try {
    const deleted = await Watch.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Watch not found' });
    }
    res.json({ message: 'Watch deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get repairs for a specific watch by brand and model
exports.getWatchRepairs = async (req, res) => {
  try {
    const { brand, model } = req.query;
    
    console.log('Getting repairs for watch:', { brand, model });
    
    if (!brand || !model) {
      return res.status(400).json({ message: 'Brand and model are required' });
    }

    // Try exact match first
    let watch = await Watch.findOne({
      brand: brand,
      model: model
    });

    // If no exact match, try case-insensitive
    if (!watch) {
      watch = await Watch.findOne({
        brand: new RegExp(`^${escapeRegExp(brand)}$`, 'i'),
        model: new RegExp(`^${escapeRegExp(model)}$`, 'i')
      });
    }

    // If still no match, try with more flexible matching
    if (!watch) {
      // Handle cases where model might have slight variations
      const modelVariations = [
        model,
        model.toLowerCase(),
        model.replace(/\s+/g, ' ').trim(), // normalize spaces
        model.replace(/(\d+)MM/gi, '$1mm'),
        model.replace(/(\d+)mm/gi, '$1MM'),
        model.replace(/series/gi, 'Series'),
        model.replace(/Series/gi, 'series'),
        model.replace(/ultra/gi, 'Ultra'),
        model.replace(/Ultra/gi, 'ultra'),
      ];

      for (const variant of modelVariations) {
        watch = await Watch.findOne({
          brand: new RegExp(`^${escapeRegExp(brand)}$`, 'i'),
          model: new RegExp(`^${escapeRegExp(variant)}$`, 'i')
        });
        if (watch) break;
      }
    }
    
    if (!watch) {
      console.log('Watch not found for:', { brand, model });
      // Return empty repairs array instead of 404 to prevent frontend errors
      return res.json([]);
    }
    
    console.log('Found watch:', watch.brand, watch.model);
    res.json(watch.repairs || []);
  } catch (err) {
    console.error('Error in getWatchRepairs:', err);
    res.status(500).json({ error: err.message });
  }
};

// Utility function to escape special regex characters
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};