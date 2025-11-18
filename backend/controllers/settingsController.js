// backend/controllers/settingsController.js
const Setting = require('../models/Setting');

// Get settings
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

// Update settings
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