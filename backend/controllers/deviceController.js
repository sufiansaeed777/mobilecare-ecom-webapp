const Phone = require('../models/Phone');
const Tablet = require('../models/Tablet');
const Watch = require('../models/Watch');
const Console = require('../models/Console');

// Get all devices (combined)
exports.getAllDevices = async (req, res) => {
  try {
    // Fetch devices from all collections
    const phones = await Phone.find().sort({ name: 1 });
    const tablets = await Tablet.find().sort({ name: 1 });
    const watches = await Watch.find().sort({ name: 1 });
    const consoles = await Console.find().sort({ name: 1 });
    
    // Add type field to each device
    const devices = [
      ...phones.map(phone => ({...phone.toObject(), type: 'phone'})),
      ...tablets.map(tablet => ({...tablet.toObject(), type: 'tablet'})),
      ...watches.map(watch => ({...watch.toObject(), type: 'watch'})),
      ...consoles.map(console => ({...console.toObject(), type: 'console'}))
    ];
    
    res.json(devices);
  } catch (error) {
    console.error('Error getting all devices:', error);
    res.status(500).json({ message: 'Server error' });
  }
};