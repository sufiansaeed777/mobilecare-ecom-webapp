// models/Watch.js
const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        enum: ['Apple', 'Samsung', 'Google', 'Huawei', 'Garmin', 'Fitbit', 'Amazfit', 'Fossil', 'Suunto']
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
watchSchema.index({ brand: 1, model: 1 }, { unique: true });

module.exports = mongoose.model('Watch', watchSchema);