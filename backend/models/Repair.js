// backend/models/Repair.js
const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema(
  {
    repair: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    // Optional: include device model and brand if needed
    model: {
      type: String,
    },
    brand: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Repair', repairSchema);
