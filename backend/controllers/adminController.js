// controllers/adminController.js
const User = require('../models/User');
const Phone = require('../models/Phone');
const Tablet = require('../models/Tablet');
const Watch = require('../models/Watch');
const Setting = require('../models/Setting');
const Console = require('../models/Console');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if account is locked
    if (user.isLocked) {
      const lockTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({ 
        message: `Account is locked. Try again in ${lockTime} minutes.`,
        remainingAttempts: 0
      });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      await user.incLoginAttempts();
      
      // Fetch the updated user to get current attempt count
      const updatedUser = await User.findById(user._id);
      const remainingAttempts = Math.max(0, 5 - updatedUser.loginAttempts);
      
      if (updatedUser.isLocked) {
        return res.status(423).json({ 
          message: 'Too many failed attempts. Account is locked for 30 minutes.',
          remainingAttempts: 0
        });
      }
      
      return res.status(401).json({ 
        message: 'Invalid credentials',
        remainingAttempts
      });
    }
    
    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetAttempts();
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
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts from each collection
    const phoneCount = await Phone.countDocuments();
    const tabletCount = await Tablet.countDocuments();
    const watchCount = await Watch.countDocuments();
    const consoleCount = await Console.countDocuments();
    
    // Get all devices to count repairs and brands
    const phones = await Phone.find({});
    const tablets = await Tablet.find({});
    const watches = await Watch.find({});
    const consoles = await Console.find({});
    
    // Calculate total repairs from embedded repairs
    let totalRepairs = 0;
    const brands = new Set();
    const deviceTypes = new Set();
    
    // Process phones
    phones.forEach(phone => {
      totalRepairs += (phone.repairs?.length || 0);
      if (phone.brand) brands.add(phone.brand);
      deviceTypes.add('phone');
    });
    
    // Process tablets
    tablets.forEach(tablet => {
      totalRepairs += (tablet.repairs?.length || 0);
      if (tablet.brand) brands.add(tablet.brand);
      deviceTypes.add('tablet');
    });
    
    // Process watches
    watches.forEach(watch => {
      totalRepairs += (watch.repairs?.length || 0);
      if (watch.brand) brands.add(watch.brand);
      deviceTypes.add('watch');
    });
    
    // Process consoles
    consoles.forEach(console => {
      totalRepairs += (console.repairs?.length || 0);
      if (console.brand) brands.add(console.brand);
      deviceTypes.add('console');
    });
    
    const deviceCount = phoneCount + tabletCount + watchCount + consoleCount;
    
    res.json({
      deviceCount,
      repairCount: totalRepairs,
      categoryCount: deviceTypes.size,
      brandCount: brands.size
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Settings
exports.getSettings = async (req, res) => {
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
};

// Update Settings
exports.updateSettings = async (req, res) => {
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
};

