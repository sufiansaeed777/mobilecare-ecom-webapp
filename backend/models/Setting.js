// backend/models/Setting.js
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    default: 'Mobile Care'
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);