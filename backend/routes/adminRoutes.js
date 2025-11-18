// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const phoneController = require('../controllers/phoneController');
const tabletController = require('../controllers/tabletController');
const watchController = require('../controllers/watchController');
const consoleController = require('../controllers/consoleController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Models
const Phone = require('../models/Phone');
const Tablet = require('../models/Tablet');
const Watch = require('../models/Watch');
const Console = require('../models/Console');

// Public routes
router.post('/login', adminController.login);

// Protected routes - require auth
router.get('/dashboard-stats', auth, adminController.getDashboardStats);
router.get('/settings', auth, adminController.getSettings);
router.put('/settings', auth, adminController.updateSettings);

// Image upload
router.post('/upload-image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Device routes
// Phones
router.get('/phones', auth, phoneController.getPhones);
router.post('/phones', auth, phoneController.createPhone);
router.get('/phones/:id', auth, phoneController.getPhoneById);
router.put('/phones/:id', auth, phoneController.updatePhone);
router.delete('/phones/:id', auth, phoneController.deletePhone);

// Tablets
router.get('/tablets', auth, tabletController.getTablets);
router.post('/tablets', auth, tabletController.createTablet);
router.get('/tablets/:id', auth, tabletController.getTabletById);
router.put('/tablets/:id', auth, tabletController.updateTablet);
router.delete('/tablets/:id', auth, tabletController.deleteTablet);

// Watches
router.get('/watches', auth, watchController.getWatches);
router.post('/watches', auth, watchController.createWatch);
router.get('/watches/:id', auth, watchController.getWatchById);
router.put('/watches/:id', auth, watchController.updateWatch);
router.delete('/watches/:id', auth, watchController.deleteWatch);

// Consoles
router.get('/consoles', auth, consoleController.getConsoles);
router.post('/consoles', auth, consoleController.createConsole);
router.get('/consoles/:id', auth, consoleController.getConsoleById);
router.put('/consoles/:id', auth, consoleController.updateConsole);
router.delete('/consoles/:id', auth, consoleController.deleteConsole);

// Repairs - Updated for embedded repairs
router.get('/devices/:deviceId/repairs', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    let device = null;
    let repairs = [];
    
    // Try to find the device in each collection
    device = await Phone.findById(deviceId);
    if (!device) device = await Tablet.findById(deviceId);
    if (!device) device = await Watch.findById(deviceId);
    if (!device) device = await Console.findById(deviceId);
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Return the repairs array from the device
    repairs = device.repairs || [];
    res.json(repairs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/repairs', auth, async (req, res) => {
  try {
    const { repair, price, description, deviceId } = req.body;
    
    // Find which type of device this is
    let device = await Phone.findById(deviceId);
    let Model = Phone;
    
    if (!device) {
      device = await Tablet.findById(deviceId);
      Model = Tablet;
    }
    if (!device) {
      device = await Watch.findById(deviceId);
      Model = Watch;
    }
    if (!device) {
      device = await Console.findById(deviceId);
      Model = Console;
    }
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Add the repair to the device's repairs array
    // Clean the price - remove pound sign if present
    const cleanPrice = price && !price.toLowerCase().includes('quote') 
      ? price.toString().replace(/[£,]/g, '') 
      : price;
      
    const newRepair = {
      repair,
      price: cleanPrice,
      ...(description && { description })
    };
    
    device.repairs.push(newRepair);
    await device.save();
    
    // Return the newly created repair with its ID
    const addedRepair = device.repairs[device.repairs.length - 1];
    res.status(201).json(addedRepair);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/repairs/:id', auth, async (req, res) => {
  try {
    const { repair, price, description } = req.body;
    const repairId = req.params.id;
    
    // We need to find the device that contains this repair
    let device = null;
    let Model = null;
    
    // Check all device types
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
        Model = type.model;
        break;
      }
    }
    
    if (!device) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    
    // Find and update the specific repair
    const repairIndex = device.repairs.findIndex(r => r._id.toString() === repairId);
    if (repairIndex === -1) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    
    // Update the repair
    // Clean the price - remove pound sign if present
    const cleanPrice = price && !price.toLowerCase().includes('quote') 
      ? price.toString().replace(/[£,]/g, '') 
      : price;
      
    device.repairs[repairIndex].repair = repair || device.repairs[repairIndex].repair;
    device.repairs[repairIndex].price = cleanPrice || device.repairs[repairIndex].price;
    if (description !== undefined) {
      device.repairs[repairIndex].description = description;
    }
    
    await device.save();
    
    // Update phoneData.js if it's a phone
    if (Model === Phone) {
      const phoneController = require('../controllers/phoneController');
      await phoneController.updatePhoneDataFile();
    }
    
    res.json(device.repairs[repairIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/repairs/:id', auth, async (req, res) => {
  try {
    const repairId = req.params.id;
    
    // Find the device that contains this repair
    let device = null;
    let Model = null;
    
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
        Model = type.model;
        break;
      }
    }
    
    if (!device) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    
    // Remove the repair
    device.repairs.pull(repairId);
    await device.save();
    
    // Update phoneData.js if it's a phone
    if (Model === Phone) {
      const phoneController = require('../controllers/phoneController');
      await phoneController.updatePhoneDataFile();
    }
    
    res.json({ message: 'Repair removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;