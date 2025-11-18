// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true,
        enum: ['Apple', 'Samsung', 'Google', 'Huawei', 'Garmin', 'Fitbit', 'Amazfit', 'Fossil', 'Suunto', 'Amazon', 'Sony', 'Nintendo', 'Microsoft', 'Dell', 'HP', 'Lenovo', 'Asus', 'Anker']
    },
    category: {
        type: String,
        required: true,
        enum: ['phones', 'tablets', 'laptops', 'watches', 'consoles', 'accessories']
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number // For showing discounts
    },
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Excellent', 'Very Good', 'Good', 'Fair'],
        default: 'New'
    },
    deviceType: {
        type: String,
        enum: ['New', 'Certified Pre-Owned', 'Refurbished'],
        default: 'New'
    },
    stockStatus: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock'],
        default: 'In Stock'
    },
    quantity: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: null
    },
    description: {
        type: String,
        required: false // Made optional as requested
    },
    keyFeatures: [{
        type: String
    }],
    // Specific fields for different categories
    storage: String,      // For phones, tablets, laptops, consoles
    ram: String,         // For laptops
    processor: String,   // For laptops
    color: String,       // For phones, tablets, watches
    caseSize: String,    // For watches
    compatibility: String, // For accessories
    capacity: String,    // For power banks
    isActive: {
        type: Boolean,
        default: true
    },
    isSpecialOffer: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ isSpecialOffer: 1 }); // Add index for special offers

module.exports = mongoose.model('Product', productSchema);