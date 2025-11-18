// models/Tablet.js
const mongoose = require('mongoose');

const tabletSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        enum: ['Apple', 'Samsung', 'Microsoft', 'Amazon', 'Lenovo', 'Google', 'Huawei', 'OnePlus']
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
tabletSchema.index({ brand: 1, model: 1 }, { unique: true });

module.exports = mongoose.model('Tablet', tabletSchema);