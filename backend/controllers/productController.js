// controllers/productController.js
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Get all products with optional filtering
exports.getAllProducts = async (req, res) => {
  try {
    const { category, brand, condition, minPrice, maxPrice, search, isActive } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (condition) filter.condition = condition;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get special offers
exports.getSpecialOffers = async (req, res) => {
  try {
    const specialOffers = await Product.find({ 
      isSpecialOffer: true,
      isActive: true,
      stockStatus: { $ne: 'Out of Stock' }
    })
    .sort({ createdAt: -1 });
    
    res.json(specialOffers);
  } catch (error) {
    console.error('Error fetching special offers:', error);
    res.status(500).json({ message: 'Failed to fetch special offers' });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ 
      category: category.toLowerCase(),
      isActive: true 
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    // Ensure price is a number
    if (req.body.price) {
      req.body.price = parseFloat(req.body.price);
    }
    
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    // Ensure price is a number if provided
    if (req.body.price) {
      req.body.price = parseFloat(req.body.price);
    }
    
    const updated = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product stock status
exports.updateProductStock = async (req, res) => {
  try {
    const { quantity, stockStatus } = req.body;
    
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { quantity, stockStatus },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product statistics (Admin dashboard)
exports.getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          inStock: {
            $sum: {
              $cond: [{ $eq: ['$stockStatus', 'In Stock'] }, 1, 0]
            }
          }
        }
      }
    ]);
    
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const specialOffers = await Product.countDocuments({ isSpecialOffer: true, isActive: true });
    
    res.json({
      totalProducts,
      activeProducts,
      specialOffers,
      categoryStats: stats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload product image
exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const productId = req.params.id;
    const imagePath = `/images/buy/${req.file.filename}`;

    const product = await Product.findByIdAndUpdate(
      productId,
      { image: imagePath },
      { new: true }
    );

    if (!product) {
      // Delete uploaded file if product not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ 
      message: 'Image uploaded successfully', 
      imagePath,
      product 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk update stock levels
exports.bulkUpdateStock = async (req, res) => {
  try {
    const updates = req.body.updates; // Array of { productId, quantity, stockStatus }
    
    const results = await Promise.all(
      updates.map(async (update) => {
        return await Product.findByIdAndUpdate(
          update.productId,
          { 
            quantity: update.quantity,
            stockStatus: update.stockStatus
          },
          { new: true }
        );
      })
    );

    res.json({ 
      message: 'Stock levels updated successfully',
      updated: results.length,
      products: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get low stock products
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    
    const lowStockProducts = await Product.find({
      $or: [
        { stockStatus: 'Low Stock' },
        { stockStatus: 'Out of Stock' },
        { quantity: { $lte: threshold } }
      ],
      isActive: true
    }).sort({ quantity: 1 });

    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export products to CSV
exports.exportProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).lean();
    
    // Convert to CSV format
    const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
    const csvStringifier = createCsvWriter({
      header: [
        { id: 'name', title: 'Name' },
        { id: 'brand', title: 'Brand' },
        { id: 'category', title: 'Category' },
        { id: 'price', title: 'Price' },
        { id: 'condition', title: 'Condition' },
        { id: 'deviceType', title: 'Device Type' },
        { id: 'stockStatus', title: 'Stock Status' },
        { id: 'quantity', title: 'Quantity' },
        { id: 'description', title: 'Description' },
        { id: 'keyFeatures', title: 'Key Features' },
        { id: 'storage', title: 'Storage' },
        { id: 'ram', title: 'RAM' },
        { id: 'color', title: 'Color' },
        { id: 'caseSize', title: 'Case Size' },
        { id: 'isSpecialOffer', title: 'Special Offer' }
      ]
    });

    // Transform data for CSV
    const csvData = products.map(product => ({
      ...product,
      keyFeatures: product.keyFeatures ? product.keyFeatures.join(';') : '',
      isSpecialOffer: product.isSpecialOffer ? 'Yes' : 'No'
    }));

    const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products-export.csv"');
    res.send(csvString);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Import products from CSV
exports.importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const csv = require('csv-parser');
    const results = [];
    
    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
          // Transform data
          const product = {
            ...data,
            price: parseFloat(data.price) || 0,
            quantity: parseInt(data.quantity) || 0,
            keyFeatures: data.keyFeatures ? data.keyFeatures.split(';').filter(f => f.trim()) : [],
            isActive: true,
            isSpecialOffer: data.isSpecialOffer === 'Yes' || data.isSpecialOffer === 'true'
          };
          results.push(product);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Validate and insert products
    const validProducts = results.filter(product => 
      product.name && product.brand && product.category && product.price
    );

    if (validProducts.length === 0) {
      return res.status(400).json({ message: 'No valid products found in CSV' });
    }

    // Insert products in batches
    const batchSize = 50;
    let imported = 0;
    
    for (let i = 0; i < validProducts.length; i += batchSize) {
      const batch = validProducts.slice(i, i + batchSize);
      await Product.insertMany(batch, { ordered: false }).catch(err => {
        console.error('Batch insert error:', err);
      });
      imported += batch.length;
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Import completed',
      total: results.length,
      imported: imported,
      skipped: results.length - imported
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};