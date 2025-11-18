// backend/scripts/updateAdminPassword.js
const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Update admin password
const updateAdminPassword = async () => {
  try {
    // Find the admin user
    const admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('Admin user not found. Please run seedAdmin.js first.');
      process.exit(1);
    }
    
    // Update password (will be hashed automatically)
    admin.password = 'SunnyCare777';
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    
    await admin.save();
    
    console.log('Admin password updated successfully to: SunnyCare777');
    console.log('Login attempts reset to 0');
    process.exit();
  } catch (error) {
    console.error('Error updating admin password:', error);
    process.exit(1);
  }
};

updateAdminPassword();