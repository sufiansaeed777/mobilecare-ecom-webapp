// backend/data/seedAdmin.js
const mongoose = require('mongoose');
const User = require('../../models/User');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }
    
    // Create new admin
    await User.create({
      username: 'admin',
      password: 'SunnyCare777',
      isAdmin: true
    });
    
    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();