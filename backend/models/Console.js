// models/Console.js
const mongoose = require('mongoose');

const consoleSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        enum: ['Xbox', 'PlayStation', 'Nintendo']
    },
    model: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    repairs: [{
        repair: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        description: String
    }]
}, {
    timestamps: true
});

// Create compound index for unique brand-model combination
consoleSchema.index({ brand: 1, model: 1 }, { unique: true });

module.exports = mongoose.model('Console', consoleSchema);