// controllers/tabletController.js
const Tablet = require('../models/Tablet');

// Get all tablets
exports.getAllTablets = async (req, res) => {
  try {
    const tablets = await Tablet.find({});
    res.json(tablets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single tablet by ID
exports.getTabletById = async (req, res) => {
  try {
    const tablet = await Tablet.findById(req.params.id);
    if (!tablet) {
      return res.status(404).json({ message: 'Tablet not found' });
    }
    res.json(tablet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new tablet
exports.createTablet = async (req, res) => {
  try {
    const newTablet = new Tablet(req.body);
    const savedTablet = await newTablet.save();
    res.status(201).json(savedTablet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a tablet
exports.updateTablet = async (req, res) => {
  try {
    const updated = await Tablet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Tablet not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a tablet
exports.deleteTablet = async (req, res) => {
  try {
    const deleted = await Tablet.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Tablet not found' });
    }
    res.json({ message: 'Tablet deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get repairs for a specific tablet by brand and model
exports.getTabletRepairs = async (req, res) => {
  try {
    const { brand, model } = req.query;
    
    console.log('Getting repairs for tablet:', { brand, model });
    
    if (!brand || !model) {
      return res.status(400).json({ message: 'Brand and model are required' });
    }

    // Try exact match first
    let tablet = await Tablet.findOne({
      brand: brand,
      model: model
    });

    // If no exact match, try case-insensitive
    if (!tablet) {
      tablet = await Tablet.findOne({
        brand: new RegExp(`^${escapeRegExp(brand)}$`, 'i'),
        model: new RegExp(`^${escapeRegExp(model)}$`, 'i')
      });
    }

    // If still no match, try with more flexible matching
    if (!tablet) {
      // Handle cases where model might have slight variations
      const modelVariations = [
        model,
        model.toLowerCase(),
        model.replace(/\s+/g, ' ').trim(), // normalize spaces
        model.replace(/(\d+)th/gi, '$1th'),
        model.replace(/(\d+)st/gi, '$1st'),
        model.replace(/(\d+)nd/gi, '$1nd'),
        model.replace(/(\d+)rd/gi, '$1rd'),
      ];

      for (const variant of modelVariations) {
        tablet = await Tablet.findOne({
          brand: new RegExp(`^${escapeRegExp(brand)}$`, 'i'),
          model: new RegExp(`^${escapeRegExp(variant)}$`, 'i')
        });
        if (tablet) break;
      }
    }
    
    if (!tablet) {
      console.log('Tablet not found for:', { brand, model });
      // Return empty repairs array instead of 404 to prevent frontend errors
      return res.json([]);
    }
    
    console.log('Found tablet:', tablet.brand, tablet.model);
    res.json(tablet.repairs || []);
  } catch (err) {
    console.error('Error in getTabletRepairs:', err);
    res.status(500).json({ error: err.message });
  }
};

// Utility function to escape special regex characters
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};