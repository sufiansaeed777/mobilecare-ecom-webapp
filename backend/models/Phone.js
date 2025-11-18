// models/Phone.js
const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  repair: { 
    type: String, 
    required: true 
  },
  price: { 
    type: String, 
    required: true 
  }
});

const phoneSchema = new mongoose.Schema({
  brand: { 
    type: String, 
    required: true,
    trim: true
  },
  model: { 
    type: String, 
    required: true,
    trim: true
  },
  image: { 
    type: String,
    default: null
  },
  repairs: {
    type: [repairSchema],
    default: []
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
phoneSchema.index({ brand: 1, model: 1 });

// Ensure brand and model combination is unique
phoneSchema.index({ brand: 1, model: 1 }, { unique: true });

module.exports = mongoose.model('Phone', phoneSchema);