// controllers/phoneController.js
const Phone = require('../models/Phone');
const fs = require('fs').promises;
const path = require('path');

// Get all phones
exports.getAllPhones = async (req, res) => {
  try {
    const phones = await Phone.find({});
    res.json(phones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all phones for admin (includes full repair data)
exports.getPhones = async (req, res) => {
  try {
    const phones = await Phone.find({}).lean();
    // Add type field for admin compatibility
    const phonesWithType = phones.map(phone => ({
      ...phone,
      type: 'phone',
      name: `${phone.brand} ${phone.model}`
    }));
    res.json(phonesWithType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single phone by ID
exports.getPhoneById = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    res.json(phone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new phone
exports.createPhone = async (req, res) => {
  try {
    const newPhone = new Phone(req.body);
    const savedPhone = await newPhone.save();
    
    // Update the phoneData.js file
    await updatePhoneDataFile();
    
    res.status(201).json(savedPhone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a phone
exports.updatePhone = async (req, res) => {
  try {
    const updated = await Phone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    
    // Update the phoneData.js file
    await updatePhoneDataFile();
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a phone
exports.deletePhone = async (req, res) => {
  try {
    const deleted = await Phone.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    
    // Update the phoneData.js file
    await updatePhoneDataFile();
    
    res.json({ message: 'Phone deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insert many phones
exports.insertPhones = async (req, res) => {
  try {
    const inserted = await Phone.insertMany(req.body);
    
    // Update the phoneData.js file
    await updatePhoneDataFile();
    
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get repairs for a specific phone by brand and model
exports.getPhoneRepairs = async (req, res) => {
  try {
    const { brand, model } = req.query;
    
    console.log('Getting repairs for:', { brand, model });
    
    if (!brand || !model) {
      return res.status(400).json({ message: 'Brand and model are required' });
    }

    // Try exact match first
    let phone = await Phone.findOne({
      brand: brand,
      model: model
    });

    // If no exact match, try case-insensitive
    if (!phone) {
      phone = await Phone.findOne({
        brand: new RegExp(`^${escapeRegExp(brand)}$`, 'i'),
        model: new RegExp(`^${escapeRegExp(model)}$`, 'i')
      });
    }

    // If still no match, try with more flexible matching
    if (!phone) {
      // Handle cases where model might have slight variations
      const modelVariations = [
        model,
        model.toLowerCase(),
        model.replace(/\s+/g, ' ').trim(), // normalize spaces
        model.replace(/plus/i, 'Plus'),
        model.replace(/Plus/i, 'plus'),
        model.replace(/pro max/i, 'Pro Max'),
        model.replace(/Pro Max/i, 'pro max')
      ];

      for (const variant of modelVariations) {
        phone = await Phone.findOne({
          brand: new RegExp(`^${escapeRegExp(brand)}$`, 'i'),
          model: new RegExp(`^${escapeRegExp(variant)}$`, 'i')
        });
        if (phone) break;
      }
    }
    
    if (!phone) {
      console.log('Phone not found for:', { brand, model });
      // Return empty repairs array instead of 404 to prevent frontend errors
      return res.json([]);
    }
    
    console.log('Found phone:', phone.brand, phone.model);
    res.json(phone.repairs || []);
  } catch (err) {
    console.error('Error in getPhoneRepairs:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add a repair to a phone
exports.addPhoneRepair = async (req, res) => {
  try {
    const phoneId = req.params.deviceId || req.params.id;
    const phone = await Phone.findById(phoneId);
    
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    
    const newRepair = {
      repair: req.body.repair,
      price: req.body.price
    };
    
    phone.repairs.push(newRepair);
    await phone.save();
    
    // Update the phoneData.js file
    await updatePhoneDataFile();
    
    // Return the new repair with an ID
    const addedRepair = phone.repairs[phone.repairs.length - 1];
    res.status(201).json(addedRepair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a repair in a phone
exports.updatePhoneRepair = async (req, res) => {
  try {
    const { phoneId, repairId } = req.params;
    const phone = await Phone.findById(phoneId);
    
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    
    const repair = phone.repairs.id(repairId);
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    
    repair.repair = req.body.repair || repair.repair;
    repair.price = req.body.price || repair.price;
    
    await phone.save();
    
    // Update the phoneData.js file
    await updatePhoneDataFile();
    
    res.json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a repair from a phone
exports.deletePhoneRepair = async (req, res) => {
  try {
    const { phoneId, repairId } = req.params;
    const phone = await Phone.findById(phoneId);
    
    if (!phone) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    
    phone.repairs.pull(repairId);
    await phone.save();
    
    // Update the phoneData.js file
    await updatePhoneDataFile();
    
    res.json({ message: 'Repair deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Utility function to escape special regex characters
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};



// Update the phoneData.js file with current database data
async function updatePhoneDataFile() {
  try {
    const phones = await Phone.find({}).lean();
    const phoneDataPath = path.join(__dirname, '../data/phoneData.js');
    
    // Remove MongoDB-specific fields
    const cleanPhones = phones.map(phone => {
      const { _id, __v, createdAt, updatedAt, ...cleanPhone } = phone;
      // Clean up repairs array too
      if (cleanPhone.repairs) {
        cleanPhone.repairs = cleanPhone.repairs.map(repair => {
          const { _id, ...cleanRepair } = repair;
          return cleanRepair;
        });
      }
      return cleanPhone;
    });
    
    const fileContent = `module.exports = ${JSON.stringify(cleanPhones, null, 2)};`;
    
    await fs.writeFile(phoneDataPath, fileContent);
    console.log('phoneData.js file updated successfully');
    
  } catch (err) {
    console.error('Error updating phoneData.js:', err);
  }
}

// Export the function so it can be used in adminRoutes
exports.updatePhoneDataFile = updatePhoneDataFile;