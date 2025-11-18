// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const nodemailer = require('nodemailer');
const checkoutNodeSdk = require('@paypal/checkout-server-sdk');
const { validateBookingData } = require('./middleware/validation');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- Basic Server Setup ---
// 1) Connect to MongoDB
connectDB();

// 2) Initialize Express
const app = express();

// 3) Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- Configure File Upload Middleware ---
const uploadDir = path.join(__dirname, 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: function (req, file, cb) {
    // Accept common image formats
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|tiff|tif)$/i;
    const allowedMimeTypes = /^image\/(jpeg|jpg|png|gif|webp|bmp|svg\+xml|x-icon|tiff)$/i;
    
    if (!file.originalname.match(allowedExtensions) || !file.mimetype.match(allowedMimeTypes)) {
      return cb(new Error('Only image files (jpg, jpeg, png, gif, webp, bmp, svg, ico, tiff) are allowed!'), false);
    }
    cb(null, true);
  }
});
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Admin Authentication Middleware ---
const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// --- Application Routes ---
// Add this section to your server.js file after line 73

// --- Application Routes ---
try {
  const phoneRoutes = require('./routes/phoneRoutes');
  const consoleRoutes = require('./routes/consoleRoutes');
  const repairRoutes = require('./routes/repairRoutes');
  const watchRoutes = require('./routes/watchRoutes');
  const tabletRoutes = require('./routes/tabletRoutes');
  const productRoutes = require('./routes/productRoutes'); // ADD THIS LINE

  app.use('/api/phones', phoneRoutes);
  app.use('/api/consoles', consoleRoutes);
  app.use('/api/repairs', repairRoutes);
  app.use('/api/watches', watchRoutes);
  app.use('/api/tablets', tabletRoutes);
  app.use('/api/products', productRoutes); // ADD THIS LINE
  
  console.log('Application routes mounted successfully.');
} catch (routeError) {
  console.error("Error mounting application routes:", routeError);
}

// Also add this after line 54 to serve static images
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// --- Import Models ---
const Setting = require('./models/Setting');
const Phone = require('./models/Phone');
const Tablet = require('./models/Tablet');
const Watch = require('./models/Watch');
const Console = require('./models/Console');
const Repair = require('./models/Repair');
const User = require('./models/User');

// Test route
app.get('/api', (req, res) => {
  res.json({ message: 'API Root - OK' });
});

// --- Environment-specific domains for redirects ---
const FRONTEND_DOMAIN_DEV = process.env.FRONTEND_DOMAIN_DEV || 'http://localhost:3000';
const FRONTEND_DOMAIN_PROD = process.env.FRONTEND_DOMAIN_PROD || 'https://mobilecare.org.uk';
const FRONTEND_DOMAIN = process.env.NODE_ENV === 'production' ? FRONTEND_DOMAIN_PROD : FRONTEND_DOMAIN_DEV;
console.log(`Using FRONTEND_DOMAIN: ${FRONTEND_DOMAIN} (NODE_ENV: ${process.env.NODE_ENV})`);

// ===================================
// ADMIN ROUTES
// ===================================

// Admin Login Route
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Add these routes to your server.js after the admin routes

// ===================================
// PHONE DATA SYNC ROUTES
// ===================================

// Re-seed database from phoneData.js file
app.post('/api/admin/reseed-phones', authenticateAdmin, async (req, res) => {
  try {
    const { reseedFromFile } = require('./data/reseedDatabase');
    const success = await reseedFromFile();
    
    if (success) {
      res.json({ message: 'Database re-seeded successfully' });
    } else {
      res.status(500).json({ message: 'Failed to re-seed database' });
    }
  } catch (error) {
    console.error('Error re-seeding database:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get repairs for a specific device (handling embedded repairs)
app.get('/api/admin/devices/:deviceId/repairs', authenticateAdmin, async (req, res) => {
  try {
    const { deviceId } = req.params;
    let device = null;
    
    // Try to find the device in each collection
    device = await Phone.findById(deviceId);
    if (!device) device = await Tablet.findById(deviceId);
    if (!device) device = await Watch.findById(deviceId);
    if (!device) device = await Console.findById(deviceId);
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Ensure repairs have IDs for the frontend
    const repairsWithIds = (device.repairs || []).map(repair => ({
      _id: repair._id || repair.id,
      repair: repair.repair,
      price: repair.price,
      description: repair.description
    }));
    
    res.json(repairsWithIds);
  } catch (error) {
    console.error('Error getting repairs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new repair (for embedded structure)
app.post('/api/admin/repairs', authenticateAdmin, async (req, res) => {
  try {
    const { repair, price, description, deviceId } = req.body;
    
    // Find which type of device this is
    let device = await Phone.findById(deviceId);
    let deviceModel = 'Phone';
    
    if (!device) {
      device = await Tablet.findById(deviceId);
      deviceModel = 'Tablet';
    }
    if (!device) {
      device = await Watch.findById(deviceId);
      deviceModel = 'Watch';
    }
    if (!device) {
      device = await Console.findById(deviceId);
      deviceModel = 'Console';
    }
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Initialize repairs array if it doesn't exist
    if (!device.repairs) {
      device.repairs = [];
    }
    
    // Add the new repair
    const newRepair = {
      repair,
      price,
      ...(description && { description })
    };
    
    device.repairs.push(newRepair);
    await device.save();
    
    // If it's a phone, update the phoneData.js file
    if (deviceModel === 'Phone') {
      const phoneController = require('./controllers/phoneController');
      await phoneController.updatePhoneDataFile();
    }
    
    // Return the newly created repair with its ID
    const addedRepair = device.repairs[device.repairs.length - 1];
    res.status(201).json({
      _id: addedRepair._id,
      repair: addedRepair.repair,
      price: addedRepair.price,
      description: addedRepair.description
    });
  } catch (error) {
    console.error('Error creating repair:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a repair (for embedded structure)
app.put('/api/admin/repairs/:id', authenticateAdmin, async (req, res) => {
  try {
    const { repair, price, description } = req.body;
    const repairId = req.params.id;
    
    // Find the device containing this repair
    let device = null;
    let deviceModel = null;
    
    const deviceTypes = [
      { model: Phone, name: 'Phone' },
      { model: Tablet, name: 'Tablet' },
      { model: Watch, name: 'Watch' },
      { model: Console, name: 'Console' }
    ];
    
    for (const type of deviceTypes) {
      const foundDevice = await type.model.findOne({ 'repairs._id': repairId });
      if (foundDevice) {
        device = foundDevice;
        deviceModel = type.name;
        break;
      }
    }
    
    if (!device) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    
    // Find and update the specific repair
    const repairItem = device.repairs.id(repairId);
    if (!repairItem) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    
    // Update fields
    repairItem.repair = repair || repairItem.repair;
    repairItem.price = price || repairItem.price;
    if (description !== undefined) {
      repairItem.description = description;
    }
    
    await device.save();
    
    // If it's a phone, update the phoneData.js file
    if (deviceModel === 'Phone') {
      const phoneController = require('./controllers/phoneController');
      await phoneController.updatePhoneDataFile();
    }
    
    res.json({
      _id: repairItem._id,
      repair: repairItem.repair,
      price: repairItem.price,
      description: repairItem.description
    });
  } catch (error) {
    console.error('Error updating repair:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a repair (for embedded structure)
app.delete('/api/admin/repairs/:id', authenticateAdmin, async (req, res) => {
  try {
    const repairId = req.params.id;
    
    // Find the device containing this repair
    let device = null;
    let deviceModel = null;
    
    const deviceTypes = [
      { model: Phone, name: 'Phone' },
      { model: Tablet, name: 'Tablet' },
      { model: Watch, name: 'Watch' },
      { model: Console, name: 'Console' }
    ];
    
    for (const type of deviceTypes) {
      const foundDevice = await type.model.findOne({ 'repairs._id': repairId });
      if (foundDevice) {
        device = foundDevice;
        deviceModel = type.name;
        break;
      }
    }
    
    if (!device) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    
    // Remove the repair
    device.repairs.pull(repairId);
    await device.save();
    
    // If it's a phone, update the phoneData.js file
    if (deviceModel === 'Phone') {
      const phoneController = require('./controllers/phoneController');
      await phoneController.updatePhoneDataFile();
    }
    
    res.json({ message: 'Repair removed' });
  } catch (error) {
    console.error('Error deleting repair:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get Dashboard Stats
app.get('/api/admin/dashboard-stats', authenticateAdmin, async (req, res) => {
  try {
    const phoneCount = await Phone.countDocuments();
    const tabletCount = await Tablet.countDocuments();
    const watchCount = await Watch.countDocuments();
    const consoleCount = await Console.countDocuments();
    
    const repairCount = await Repair.countDocuments();
    
    const categories = new Set();
    
    const phoneCategories = await Phone.distinct('category');
    const tabletCategories = await Tablet.distinct('category');
    const watchCategories = await Watch.distinct('category');
    const consoleCategories = await Console.distinct('category');
    
    phoneCategories.forEach(cat => categories.add(cat));
    tabletCategories.forEach(cat => categories.add(cat));
    watchCategories.forEach(cat => categories.add(cat));
    consoleCategories.forEach(cat => categories.add(cat));
    
    const deviceCount = phoneCount + tabletCount + watchCount + consoleCount;
    const categoryCount = categories.size;
    
    res.json({
      deviceCount,
      repairCount,
      categoryCount
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Image Upload for Admin
app.post('/api/admin/upload-image', authenticateAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ 
    imageUrl,
    filename: req.file.filename,
    originalName: req.file.originalname
  });
});

// Settings Endpoints
app.get('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({
        siteName: 'Mobile Care',
        contactEmail: 'support@mobilecare.org.uk',
        contactPhone: '',
        address: '',
        logo: ''
      });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    const { siteName, contactEmail, contactPhone, address, logo } = req.body;
    
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({
        siteName,
        contactEmail,
        contactPhone,
        address,
        logo
      });
    } else {
      settings.siteName = siteName || settings.siteName;
      settings.contactEmail = contactEmail || settings.contactEmail;
      settings.contactPhone = contactPhone || settings.contactPhone;
      settings.address = address || settings.address;
      settings.logo = logo || settings.logo;
      
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ===================================
// REPAIR ENDPOINTS
// ===================================



// ===================================
// LEGACY PHONE ENDPOINTS (Keep for backward compatibility)
// ===================================

app.get('/api/admin/phones', authenticateAdmin, async (req, res) => {
  try {
    const phones = await Phone.find().sort({ name: 1 });
    res.json(phones);
  } catch (error) {
    console.error('Error getting phones:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/admin/phones', authenticateAdmin, async (req, res) => {
  try {
    const { name, category, description, image, featured, order } = req.body;
    
    const newPhone = new Phone({
      name,
      category,
      description,
      image,
      featured: featured || false,
      order: order || 0
    });
    
    await newPhone.save();
    res.status(201).json(newPhone);
  } catch (error) {
    console.error('Error creating phone:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/admin/phones/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, category, description, image, featured, order } = req.body;
    
    const phone = await Phone.findById(req.params.id);
    
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    
    phone.name = name || phone.name;
    phone.category = category || phone.category;
    phone.description = description || phone.description;
    phone.image = image || phone.image;
    phone.featured = featured !== undefined ? featured : phone.featured;
    phone.order = order !== undefined ? order : phone.order;
    
    await phone.save();
    res.json(phone);
  } catch (error) {
    console.error('Error updating phone:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/admin/phones/:id', authenticateAdmin, async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);
    
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    
    await Repair.deleteMany({ device: req.params.id });
    await phone.deleteOne();
    
    res.json({ message: 'Phone removed' });
  } catch (error) {
    console.error('Error deleting phone:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===================================
// END ADMIN ROUTES
// ===================================

// =============================
// Stripe: Create PaymentIntent Endpoint
// =============================
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.warn('Create PaymentIntent: Invalid amount received:', amount);
      return res.status(400).json({ error: 'Invalid or missing amount in request body (must be in pence/cents).' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(`Create PaymentIntent: Success for amount ${amount}, PI ID: ${paymentIntent.id}`);
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Create PaymentIntent Error:', error.message || error);
    res.status(500).json({ error: 'Failed to create payment intent.', details: error.message });
  }
});

// =============================
// Stripe: Create Checkout Session Endpoint
// =============================
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        console.error('Stripe Checkout: Missing or invalid cart items');
        return res.status(400).json({ error: 'Missing or invalid cart items in request body' });
    }

    console.log(`Stripe Checkout: Received ${cartItems.length} items.`);

    const line_items = cartItems.map(item => {
        const unitAmount = Math.round(item.cost * 100);
        if (!item.name || typeof item.cost !== 'number' || unitAmount <= 0) {
            console.error('Stripe Checkout: Invalid item data:', item);
            throw new Error(`Invalid item data found in cart: ${JSON.stringify(item)}`);
        }
        return {
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.name,
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity || 1,
        };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: line_items,
      success_url: `${FRONTEND_DOMAIN}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_DOMAIN}/payment?status=cancel`,
    });

    console.log('Stripe Checkout Session Created:', session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe Checkout Session:', error.message || error);
    res.status(500).json({ error: error.message || 'Failed to create Stripe Checkout session.' });
  }
});

// =============================
// PayPal: Create a PayPal Order Endpoint
// =============================
function paypalEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environmentMode = process.env.PAYPAL_MODE || 'sandbox';

  if (!clientId || !clientSecret) {
      console.error(`CRITICAL PAYPAL ERROR: Missing PayPal ${environmentMode === 'live' ? 'Live' : 'Sandbox'} Client ID or Secret in environment variables!`);
  }
   console.log(`PayPal Setup: Using ${environmentMode} environment.`);

  if (environmentMode === 'live') {
      return new checkoutNodeSdk.core.LiveEnvironment(clientId, clientSecret);
  } else {
      return new checkoutNodeSdk.core.SandboxEnvironment(clientId, clientSecret);
  }
}

function paypalClient() {
  return new checkoutNodeSdk.core.PayPalHttpClient(paypalEnvironment());
}

app.post('/api/create-paypal-order', async (req, res) => {
  try {
    const { totalPrice } = req.body;
    if (totalPrice === undefined || typeof totalPrice !== 'number' || totalPrice <= 0) {
        console.warn('Create PayPal Order: Invalid totalPrice received:', totalPrice);
        return res.status(400).json({ error: 'Missing or invalid totalPrice in request body' });
    }
    const amountValue = totalPrice.toFixed(2);

    const request = new checkoutNodeSdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: "GBP",
            value: amountValue,
          },
        },
      ],
       application_context: {
           return_url: `${FRONTEND_DOMAIN}/payment?status=success&source=paypal`,
           cancel_url: `${FRONTEND_DOMAIN}/payment?status=cancel&source=paypal`,
           brand_name: 'Mobile Care',
           shipping_preference: 'NO_SHIPPING',
           user_action: 'PAY_NOW',
       }
    });

    console.log(`Create PayPal Order: Requesting order for value ${amountValue}`);
    const order = await paypalClient().execute(request);
    console.log('Create PayPal Order: Success, Order ID:', order.result.id);

    const approvalLink = order.result.links.find(link => link.rel === "approve");
    if (approvalLink) {
      console.log('Create PayPal Order: Approval URL found:', approvalLink.href)
      res.json({ approvalUrl: approvalLink.href });
    } else {
       console.error('Create PayPal Order: No approval link found in PayPal response:', order.result.links);
       res.status(500).json({ error: 'Could not retrieve PayPal approval link.' });
    }
  } catch (e) {
    console.error('Create PayPal Order: Error executing request:', e.statusCode, e.message);
    if (e.result && e.result.details) {
        console.error('Create PayPal Order: Details:', JSON.stringify(e.result.details, null, 2));
    }
    const message = e.message || 'Failed to create PayPal order.';
    res.status(e.statusCode || 500).json({ error: message });
  }
});
// ===================================
// DEVICE MANAGEMENT ROUTES
// ===================================

// Get all devices
app.get('/api/admin/devices', authenticateAdmin, async (req, res) => {
  try {
    const phones = await Phone.find().sort({ brand: 1, model: 1 });
    const tablets = await Tablet.find().sort({ brand: 1, model: 1 });
    const watches = await Watch.find().sort({ brand: 1, model: 1 });
    const consoles = await Console.find().sort({ brand: 1, model: 1 });
    
    const devices = [
      ...phones.map(phone => ({
        ...phone.toObject(), 
        type: 'phone', 
        deviceType: 'Phone',
        repairsCount: phone.repairs?.length || 0
      })),
      ...tablets.map(tablet => ({
        ...tablet.toObject(), 
        type: 'tablet', 
        deviceType: 'Tablet',
        repairsCount: tablet.repairs?.length || 0
      })),
      ...watches.map(watch => ({
        ...watch.toObject(), 
        type: 'watch', 
        deviceType: 'Watch',
        repairsCount: watch.repairs?.length || 0
      })),
      ...consoles.map(console => ({
        ...console.toObject(), 
        type: 'console', 
        deviceType: 'Console',
        repairsCount: console.repairs?.length || 0
      }))
    ];
    
    res.json(devices);
  } catch (error) {
    console.error('Error getting all devices:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new device
app.post('/api/admin/devices', authenticateAdmin, async (req, res) => {
  try {
    const { brand, model, image, type, repairs } = req.body;
    
    // Validate required fields
    if (!brand || !model || !type) {
      return res.status(400).json({ message: 'Brand, model, and type are required' });
    }
    
    if (!repairs || repairs.length === 0) {
      return res.status(400).json({ message: 'At least one repair is required' });
    }
    
    let newDevice;
    const deviceData = {
      brand,
      model,
      image: image || null,
      repairs: repairs.map(r => ({
        repair: r.repair,
        price: r.price
      }))
    };
    
    switch(type) {
      case 'phone':
        newDevice = new Phone(deviceData);
        break;
      case 'tablet':
        newDevice = new Tablet(deviceData);
        break;
      case 'watch':
        newDevice = new Watch(deviceData);
        break;
      case 'console':
        newDevice = new Console(deviceData);
        break;
      default:
        return res.status(400).json({ message: 'Invalid device type' });
    }
    
    await newDevice.save();
    
    // If it's a phone, update the phoneData.js file asynchronously
    // Don't wait for reseed to complete to avoid timeout
    if (type === 'phone') {
      const phoneController = require('./controllers/phoneController');
      phoneController.updatePhoneDataFile().catch(err => {
        console.error('Error updating phone data file:', err);
      });
    }
    
    res.status(201).json({
      ...newDevice.toObject(), 
      type, 
      deviceType: type.charAt(0).toUpperCase() + type.slice(1)
    });
  } catch (error) {
    console.error('Error creating device:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A device with this brand and model already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a device
app.put('/api/admin/devices/:id', authenticateAdmin, async (req, res) => {
  try {
    const { brand, model, image, type, repairs } = req.body;
    
    let Model;
    switch(type) {
      case 'phone':
        Model = Phone;
        break;
      case 'tablet':
        Model = Tablet;
        break;
      case 'watch':
        Model = Watch;
        break;
      case 'console':
        Model = Console;
        break;
      default:
        return res.status(400).json({ message: 'Invalid device type' });
    }
    
    const device = await Model.findById(req.params.id);
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Update device fields
    device.brand = brand || device.brand;
    device.model = model || device.model;
    device.image = image !== undefined ? image : device.image;
    
    // Don't update repairs in device management - that's for repair management
    // Only update repairs if explicitly provided (for initial setup)
    if (repairs !== undefined && repairs.length > 0) {
      device.repairs = repairs.map(r => ({
        repair: r.repair,
        price: r.price
      }));
    }
    
    await device.save();
    
    // If it's a phone, update the phoneData.js file asynchronously
    // Don't wait for reseed to complete to avoid timeout
    if (type === 'phone') {
      const phoneController = require('./controllers/phoneController');
      phoneController.updatePhoneDataFile().catch(err => {
        console.error('Error updating phone data file:', err);
      });
    }
    
    res.json({
      ...device.toObject(), 
      type, 
      deviceType: type.charAt(0).toUpperCase() + type.slice(1)
    });
  } catch (error) {
    console.error('Error updating device:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    console.error('Device ID:', req.params.id);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A device with this brand and model already exists' });
    }
    
    // Send more detailed error message
    res.status(500).json({ 
      message: 'Server error updating device', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Delete a device
app.delete('/api/admin/devices/:id', authenticateAdmin, async (req, res) => {
  try {
    let device = await Phone.findById(req.params.id);
    let deviceType = 'phone';
    
    if (!device) {
      device = await Tablet.findById(req.params.id);
      deviceType = 'tablet';
    }
    
    if (!device) {
      device = await Watch.findById(req.params.id);
      deviceType = 'watch';
    }
    
    if (!device) {
      device = await Console.findById(req.params.id);
      deviceType = 'console';
    }
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Delete the device
    await device.deleteOne();
    
    // If it's a phone, update the phoneData.js file asynchronously
    // Don't wait for reseed to complete to avoid timeout
    if (deviceType === 'phone') {
      const phoneController = require('./controllers/phoneController');
      phoneController.updatePhoneDataFile().catch(err => {
        console.error('Error updating phone data file:', err);
      });
    }
    
    res.json({ message: 'Device removed successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all devices with proper image mapping
app.get('/api/admin/devices', authenticateAdmin, async (req, res) => {
  try {
    const phones = await Phone.find().sort({ brand: 1, model: 1 });
    const tablets = await Tablet.find().sort({ brand: 1, model: 1 });
    const watches = await Watch.find().sort({ brand: 1, model: 1 });
    const consoles = await Console.find().sort({ brand: 1, model: 1 });
    
    const devices = [
      ...phones.map(phone => ({
        ...phone.toObject(), 
        type: 'phone', 
        deviceType: 'Phone',
        // Include repairs count
        repairsCount: phone.repairs?.length || 0
      })),
      ...tablets.map(tablet => ({
        ...tablet.toObject(), 
        type: 'tablet', 
        deviceType: 'Tablet',
        repairsCount: tablet.repairs?.length || 0
      })),
      ...watches.map(watch => ({
        ...watch.toObject(), 
        type: 'watch', 
        deviceType: 'Watch',
        repairsCount: watch.repairs?.length || 0
      })),
      ...consoles.map(console => ({
        ...console.toObject(), 
        type: 'console', 
        deviceType: 'Console',
        repairsCount: console.repairs?.length || 0
      }))
    ];
    
    res.json(devices);
  } catch (error) {
    console.error('Error getting all devices:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============================
// Nodemailer: Send Email Setup & Endpoints
// =============================
if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("CRITICAL ERROR: Missing required SMTP environment variables (HOST, PORT, USER, PASS). Email functionality will fail.");
}

let transporter;
try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: (parseInt(process.env.SMTP_PORT, 10) === 465),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP Connection Error:', error);
        console.log('Email functionality will be disabled until SMTP issues are fixed.');
        transporter = null;
      } else {
        console.log('SMTP Connection Verified:', success);
      }
    });
} catch (smtpError) {
     console.error("Failed to create Nodemailer transporter:", smtpError);
     transporter = null;
}

// --- 1) Contact Endpoint ---
app.post('/api/contact', async (req, res) => {
  if (!transporter) {
    console.log('Email sending skipped - SMTP not configured properly');
    return res.json({ 
      success: true, 
      warning: 'Your message was received but email notifications are currently disabled. Our team has been notified of this issue.' 
    });
  }
  
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill out required fields.' });
    }

    const mailText = `
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      
      Message:
      ${message}
    `;
    
    const info = await transporter.sendMail({
      from: `"Mobile Care Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to the configured SMTP user email
      subject: `New Contact Form Message from ${name}`,
      text: mailText,
      replyTo: email
    });
    
    console.log('Contact email sent:', info.messageId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error sending contact email:', err);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
});

// --- 2) Send Confirmation Email (Booking Confirmation) ---
app.post('/api/send-confirmation-email', validateBookingData, async (req, res) => {
  if (!transporter) {
    console.log('Email sending skipped - SMTP not configured properly');
    return res.json({ 
      success: true, 
      warning: 'Your booking was received but email notifications are currently disabled. Please keep your booking reference number.' 
    });
  }
  
  try {
    console.log('Received /api/send-confirmation-email request body:', JSON.stringify(req.body, null, 2));
    const { bookingData, cartItems, totalPrice } = req.body;

    if (!bookingData?.name || !bookingData?.email || !bookingData?.address || !bookingData?.date || !bookingData?.time || !Array.isArray(cartItems) || cartItems.length === 0 || typeof totalPrice !== 'number') {
        console.error('Send Confirmation Email: Invalid data received.');
        return res.status(400).json({ error: 'Invalid or incomplete booking data provided.' });
    }

    const formattedDate = new Date(bookingData.date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formatPrice = (amount) => typeof amount === 'number' ? `£${amount.toFixed(2)}` : 'N/A';

    const mailText = `
      Booking Information:
      Name: ${bookingData.name}
      Email: ${bookingData.email}
      Phone: ${bookingData.phone || 'Not provided'}
      Address: ${bookingData.address}
      Date: ${formattedDate}
      Time: ${bookingData.time}
      
      Items:
      ${cartItems.map(item => `- ${item.name}: ${formatPrice(item.cost)}`).join('\n')}
      
      Total: ${formatPrice(totalPrice)}
    `;
    
    const htmlContent = `
      <h2>New Booking Information</h2>
      <p><strong>Name:</strong> ${bookingData.name}</p>
      <p><strong>Email:</strong> ${bookingData.email}</p>
      <p><strong>Phone:</strong> ${bookingData.phone || 'Not provided'}</p>
      <p><strong>Address:</strong> ${bookingData.address}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${bookingData.time}</p>
      
      <h3>Items:</h3>
      <ul>
        ${cartItems.map(item => `<li>${item.name}: ${formatPrice(item.cost)}</li>`).join('')}
      </ul>
      
      <p><strong>Total:</strong> ${formatPrice(totalPrice)}</p>
    `;

    const info = await transporter.sendMail({
      from: `"Mobile Care Booking" <${process.env.SMTP_USER}>`,
      to: 'support@mobilecare.org.uk',
      cc: bookingData.email,
      subject: `New Booking Confirmed - ${bookingData.name}`,
      text: mailText,
      html: htmlContent
    });

    console.log('Booking confirmation email sent successfully:', info.messageId);
    res.json({ success: true });

  } catch (err) {
    console.error('Error sending confirmation email:', err);
    res.status(500).json({
      error: 'Failed to process confirmation email request.',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
});

// --- 3) Complaint Endpoint ---
app.post('/api/complain', async (req, res) => {
  if (!transporter) {
    console.log('Email sending skipped - SMTP not configured properly');
    return res.json({ 
      success: true, 
      warning: 'Your complaint was received but email notifications are currently disabled. Our team will contact you directly.' 
    });
  }
  
  try {
    const { orderNumber, name, email, issueDetails } = req.body;
    if (!orderNumber || !name || !email || !issueDetails) {
      return res.status(400).json({ error: 'Please fill out all fields.' });
    }
    
    const complaintText = `
      Complaint Details:
      Order Number: ${orderNumber}
      Name: ${name}
      Email: ${email}
      
      Issue Details:
      ${issueDetails}
    `;
    
    const htmlContent = `
      <h2>Customer Complaint</h2>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      
      <h3>Issue Details:</h3>
      <p>${issueDetails}</p>
    `;
    
    const mailOptions = {
      from: `"Mobile Care Complaints" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to the configured SMTP user email
      subject: `Complaint - Order #${orderNumber}`,
      text: complaintText,
      html: htmlContent,
      replyTo: email
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Complaint email sent:', info.messageId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error sending complaint email:', err);
    res.status(500).json({ 
      error: 'Failed to send complaint',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
});

// --- 4) Send Payment Confirmation Email ---
app.post('/api/send-payment-confirmation', async (req, res) => {
  if (!transporter) {
    console.log('Payment email skipped - SMTP not configured properly');
    return res.json({ 
      success: true, 
      warning: 'Payment processed but email notifications are currently disabled.' 
    });
  }
  
  try {
    const { bookingData, cartItems, totalPrice, paymentMethod, transactionId } = req.body;
    
    if (!bookingData?.email || !cartItems || !totalPrice) {
      return res.status(400).json({ error: 'Missing required payment confirmation data' });
    }

    // Generate order number
    const orderNumber = `MC-${Date.now().toString(36).toUpperCase()}`;
    
    // Create detailed email content
    const itemsList = cartItems.map(item => 
      `- ${item.name}: £${item.cost?.toFixed(2) || '0.00'}`
    ).join('\n');
    
    const mailText = `
Order Confirmation - Mobile Care

Dear ${bookingData.name},

Thank you for your order! Your payment has been successfully processed.

ORDER DETAILS:
Order Number: ${orderNumber}
Transaction ID: ${transactionId || 'N/A'}
Payment Method: ${paymentMethod || 'Card'}
Total Amount: £${totalPrice.toFixed(2)}

ITEMS ORDERED:
${itemsList}

BOOKING INFORMATION:
Date: ${bookingData.date}
Time: ${bookingData.time}
Address: ${bookingData.address}
Phone: ${bookingData.phone}

WHAT'S NEXT?
Our technician will arrive at your location on the scheduled date and time.
Please ensure someone is available to receive our technician.

If you need to reschedule or have any questions, please contact us at:
Email: ${process.env.SMTP_USER}
Phone: +44 7123 456789

Thank you for choosing Mobile Care!

Best regards,
Mobile Care Team
    `;

    const mailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; }
    .items-list { list-style: none; padding: 0; }
    .items-list li { padding: 5px 0; border-bottom: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
    </div>
    <div class="content">
      <p>Dear ${bookingData.name},</p>
      <p>Your payment has been successfully processed. Here are your order details:</p>
      
      <div class="order-details">
        <h3>Order Information</h3>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Transaction ID:</strong> ${transactionId || 'N/A'}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod || 'Card'}</p>
        <p><strong>Total Amount:</strong> £${totalPrice.toFixed(2)}</p>
      </div>
      
      <div class="order-details">
        <h3>Items Ordered</h3>
        <ul class="items-list">
          ${cartItems.map(item => `<li>${item.name}: £${item.cost?.toFixed(2) || '0.00'}</li>`).join('')}
        </ul>
      </div>
      
      <div class="order-details">
        <h3>Appointment Details</h3>
        <p><strong>Date:</strong> ${bookingData.date}</p>
        <p><strong>Time:</strong> ${bookingData.time}</p>
        <p><strong>Address:</strong> ${bookingData.address}</p>
        <p><strong>Phone:</strong> ${bookingData.phone}</p>
      </div>
      
      <p><strong>What's Next?</strong><br>
      Our technician will arrive at your location on the scheduled date and time. 
      Please ensure someone is available to receive our technician.</p>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact us at:<br>
      Email: ${process.env.SMTP_USER}<br>
      Phone: +44 7123 456789</p>
      <p>&copy; 2024 Mobile Care. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
    
    // Send email to customer
    const customerEmail = await transporter.sendMail({
      from: `"Mobile Care" <${process.env.SMTP_USER}>`,
      to: bookingData.email,
      subject: `Order Confirmation - ${orderNumber}`,
      text: mailText,
      html: mailHtml
    });
    
    // Send copy to business
    const businessEmail = await transporter.sendMail({
      from: `"Mobile Care Orders" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Order Received - ${orderNumber}`,
      text: `New order received!\n\n${mailText}`,
      html: mailHtml,
      replyTo: bookingData.email
    });
    
    console.log('Payment confirmation emails sent:', {
      customer: customerEmail.messageId,
      business: businessEmail.messageId
    });
    
    res.json({ 
      success: true, 
      orderNumber,
      message: 'Payment confirmation email sent successfully' 
    });
    
  } catch (err) {
    console.error('Error sending payment confirmation email:', err);
    res.status(500).json({ 
      error: 'Failed to send confirmation email',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
});

// --- 5) Sell Device Email ---
app.post('/api/sell-device', async (req, res) => {
  if (!transporter) {
    console.log('Sell device email skipped - SMTP not configured properly');
    return res.json({ 
      success: true, 
      warning: 'Form submitted but email notifications are currently disabled.' 
    });
  }
  
  try {
    const { deviceInfo, customerInfo, description } = req.body;
    
    if (!customerInfo?.email || !customerInfo?.name || !deviceInfo) {
      return res.status(400).json({ error: 'Missing required information' });
    }

    const mailText = `
New Sell Device Request - Mobile Care

CUSTOMER INFORMATION:
Name: ${customerInfo.name}
Email: ${customerInfo.email}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}

DEVICE INFORMATION:
Category: ${deviceInfo.category}
Brand: ${deviceInfo.brand}
Model: ${deviceInfo.model}
Storage: ${deviceInfo.storage || 'Not specified'}
Condition: ${deviceInfo.condition}
Original Box: ${deviceInfo.originalBox}
Accessories: ${deviceInfo.accessories ? deviceInfo.accessories.join(', ') : 'None'}

DESCRIPTION:
${description || 'No additional description provided'}

Submitted at: ${new Date().toLocaleString()}
    `;

    const mailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .info-section { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
    .info-section h3 { color: #28a745; margin-top: 0; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Sell Device Request</h1>
    </div>
    <div class="content">
      <div class="info-section">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${customerInfo.name}</p>
        <p><strong>Email:</strong> ${customerInfo.email}</p>
        <p><strong>Phone:</strong> ${customerInfo.phone}</p>
        <p><strong>Address:</strong> ${customerInfo.address}</p>
      </div>
      
      <div class="info-section">
        <h3>Device Information</h3>
        <p><strong>Category:</strong> ${deviceInfo.category}</p>
        <p><strong>Brand:</strong> ${deviceInfo.brand}</p>
        <p><strong>Model:</strong> ${deviceInfo.model}</p>
        <p><strong>Storage:</strong> ${deviceInfo.storage || 'Not specified'}</p>
        <p><strong>Condition:</strong> ${deviceInfo.condition}</p>
        <p><strong>Original Box:</strong> ${deviceInfo.originalBox}</p>
        <p><strong>Accessories:</strong> ${deviceInfo.accessories ? deviceInfo.accessories.join(', ') : 'None'}</p>
      </div>
      
      <div class="info-section">
        <h3>Additional Description</h3>
        <p>${description || 'No additional description provided'}</p>
      </div>
      
      <div class="footer">
        <p>Submitted at: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Get settings for contact email
    const settings = await Setting.findOne() || { contactEmail: process.env.SMTP_USER };
    
    // Send email to shop owner
    await transporter.sendMail({
      from: `"Mobile Care - Sell Request" <${process.env.SMTP_USER}>`,
      to: settings.contactEmail || process.env.SMTP_USER,
      subject: `New Sell Device Request - ${deviceInfo.brand} ${deviceInfo.model}`,
      text: mailText,
      html: mailHtml
    });

    // Send confirmation to customer
    await transporter.sendMail({
      from: `"Mobile Care" <${process.env.SMTP_USER}>`,
      to: customerInfo.email,
      subject: 'We received your sell request - Mobile Care',
      text: `Dear ${customerInfo.name},\n\nThank you for your interest in selling your ${deviceInfo.brand} ${deviceInfo.model} to us. We have received your request and will contact you within 24 hours with our offer.\n\nBest regards,\nMobile Care Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Sell Request Received</h2>
          <p>Dear ${customerInfo.name},</p>
          <p>Thank you for your interest in selling your <strong>${deviceInfo.brand} ${deviceInfo.model}</strong> to us.</p>
          <p>We have received your request and will contact you within 24 hours with our offer.</p>
          <br>
          <p>Best regards,<br>Mobile Care Team</p>
        </div>
      `
    });

    console.log('Sell device emails sent successfully');
    res.json({ success: true, message: 'Your sell request has been submitted successfully!' });
  } catch (err) {
    console.error('Error sending sell device email:', err);
    res.status(500).json({ 
      error: 'Failed to send sell request',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
});

// --- 6) Trade-In Device Email ---
app.post('/api/trade-in-device', async (req, res) => {
  if (!transporter) {
    console.log('Trade-in email skipped - SMTP not configured properly');
    return res.json({ 
      success: true, 
      warning: 'Form submitted but email notifications are currently disabled.' 
    });
  }
  
  try {
    const { currentDevice, newDevice, customerInfo } = req.body;
    
    console.log('Trade-in request received:', JSON.stringify(req.body, null, 2));
    
    if (!customerInfo?.email || !customerInfo?.name || !currentDevice || !newDevice) {
      console.error('Missing required fields:', {
        hasEmail: !!customerInfo?.email,
        hasName: !!customerInfo?.name,
        hasCurrentDevice: !!currentDevice,
        hasNewDevice: !!newDevice
      });
      return res.status(400).json({ error: 'Missing required information' });
    }

    const mailText = `
New Trade-In Request - Mobile Care

CUSTOMER INFORMATION:
Name: ${customerInfo.name}
Email: ${customerInfo.email}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}

CURRENT DEVICE (Trading In):
Category: ${currentDevice.category}
Brand: ${currentDevice.brand}
Model: ${currentDevice.model}
Storage: ${currentDevice.storage || 'Not specified'}
Condition: ${currentDevice.condition}

DESIRED NEW DEVICE:
Category: ${newDevice.category}
Brand: ${newDevice.brand}
Model: ${newDevice.model}
Storage: ${newDevice.storage || 'Not specified'}

ADDITIONAL NOTES:
${customerInfo.notes || 'No additional notes provided'}

Submitted at: ${new Date().toLocaleString()}
    `;

    const mailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #17a2b8; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .info-section { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
    .info-section h3 { color: #17a2b8; margin-top: 0; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Trade-In Request</h1>
    </div>
    <div class="content">
      <div class="info-section">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${customerInfo.name}</p>
        <p><strong>Email:</strong> ${customerInfo.email}</p>
        <p><strong>Phone:</strong> ${customerInfo.phone}</p>
        <p><strong>Address:</strong> ${customerInfo.address}</p>
      </div>
      
      <div class="info-section">
        <h3>Current Device (Trading In)</h3>
        <p><strong>Category:</strong> ${currentDevice.category}</p>
        <p><strong>Brand:</strong> ${currentDevice.brand}</p>
        <p><strong>Model:</strong> ${currentDevice.model}</p>
        <p><strong>Storage:</strong> ${currentDevice.storage || 'Not specified'}</p>
        <p><strong>Condition:</strong> ${currentDevice.condition}</p>
      </div>
      
      <div class="info-section">
        <h3>Desired New Device</h3>
        <p><strong>Category:</strong> ${newDevice.category}</p>
        <p><strong>Brand:</strong> ${newDevice.brand}</p>
        <p><strong>Model:</strong> ${newDevice.model}</p>
        <p><strong>Storage:</strong> ${newDevice.storage || 'Not specified'}</p>
      </div>
      
      <div class="info-section">
        <h3>Additional Notes</h3>
        <p>${customerInfo.notes || 'No additional notes provided'}</p>
      </div>
      
      <div class="footer">
        <p>Submitted at: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Get settings for contact email
    const settings = await Setting.findOne() || { contactEmail: process.env.SMTP_USER };
    
    // Send email to shop owner
    await transporter.sendMail({
      from: `"Mobile Care - Trade-In Request" <${process.env.SMTP_USER}>`,
      to: settings.contactEmail || process.env.SMTP_USER,
      subject: `New Trade-In Request - ${currentDevice.brand} ${currentDevice.model} for ${newDevice.brand} ${newDevice.model}`,
      text: mailText,
      html: mailHtml
    });

    // Send confirmation to customer
    await transporter.sendMail({
      from: `"Mobile Care" <${process.env.SMTP_USER}>`,
      to: customerInfo.email,
      subject: 'We received your trade-in request - Mobile Care',
      text: `Dear ${customerInfo.name},\n\nThank you for your interest in trading in your ${currentDevice.brand} ${currentDevice.model} for a ${newDevice.brand} ${newDevice.model}. We have received your request and will contact you within 24 hours with our trade-in offer.\n\nBest regards,\nMobile Care Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #17a2b8;">Trade-In Request Received</h2>
          <p>Dear ${customerInfo.name},</p>
          <p>Thank you for your interest in trading in your <strong>${currentDevice.brand} ${currentDevice.model}</strong> for a <strong>${newDevice.brand} ${newDevice.model}</strong>.</p>
          <p>We have received your request and will contact you within 24 hours with our trade-in offer.</p>
          <br>
          <p>Best regards,<br>Mobile Care Team</p>
        </div>
      `
    });

    console.log('Trade-in emails sent successfully');
    res.json({ success: true, message: 'Your trade-in request has been submitted successfully!' });
  } catch (err) {
    console.error('Error sending trade-in email:', err);
    res.status(500).json({ 
      error: 'Failed to send trade-in request',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
});

// =============================
// Serve React Build in Production
// =============================
if (process.env.NODE_ENV === 'production') {
  console.log('Production mode detected: Serving static files from ../frontend/build');
  const buildPath = path.resolve(__dirname, '../frontend/build');
  console.log(`Build path resolved to: ${buildPath}`);

  if (fs.existsSync(buildPath)) {
      app.use(express.static(buildPath));

      app.get('*', (req, res) => {
        const indexPath = path.resolve(buildPath, 'index.html');
        console.log(`Serving index.html for route: ${req.originalUrl}`);
        res.sendFile(indexPath, (err) => {
            if (err) {
                 console.error('Error sending index.html:', err);
                 res.status(500).send(err);
            }
        });
      });
  } else {
       console.error(`Production mode: Build directory not found at ${buildPath}. Static files will not be served.`);
        app.get('*', (req, res) => {
             res.status(404).send('Frontend build not found. Check server configuration.');
         });
  }
} else {
   console.log(`Development mode detected (NODE_ENV=${process.env.NODE_ENV}). Static file serving for production is disabled.`);
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log(`API route not found: ${req.originalUrl}`);
  res.status(404).json({ message: 'API endpoint not found' });
});

// --- Error Handling Middleware (Place Last) ---
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err);
    const message = process.env.NODE_ENV === 'production' ? 'An internal server error occurred.' : err.message || 'Something broke!';
    const details = process.env.NODE_ENV === 'production' ? undefined : err.stack;
    res.status(err.status || 500).json({ error: message, details });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`-------------------------------------------------------`);
  console.log(`Server listening on port ${PORT}`);
  console.log(`Node environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend Domain for Redirects: ${FRONTEND_DOMAIN}`);
  console.log(`-------------------------------------------------------`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});