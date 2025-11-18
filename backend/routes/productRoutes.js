// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getAllProducts, 
  getProductsByCategory,
  getSpecialOffers,
  createProduct, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  updateProductStock,
  getProductStats,
  uploadProductImage,
  bulkUpdateStock,
  getLowStockProducts,
  exportProducts,
  importProducts
} = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|avif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Configure multer for CSV uploads
const csvStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/temp/');
  },
  filename: function (req, file, cb) {
    cb(null, 'import-' + Date.now() + '.csv');
  }
});

const csvUpload = multer({
  storage: csvStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname).toLowerCase() === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Public routes - no authentication required
router.get('/', getAllProducts);
router.get('/special-offers', getSpecialOffers); // Add special offers route
router.get('/low-stock', getLowStockProducts); // Move this before parametric routes
router.get('/stats', getProductStats); // Move this before parametric routes
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Admin only routes - authentication required
router.use(authMiddleware); // All routes below this require authentication

// Product management
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Stock management
router.patch('/:id/stock', updateProductStock);
router.patch('/bulk-stock', bulkUpdateStock);

// Image upload
router.post('/:id/image', upload.single('image'), uploadProductImage);

// Import/Export
router.get('/export/csv', exportProducts);
router.post('/import/csv', csvUpload.single('csv'), importProducts);

module.exports = router;