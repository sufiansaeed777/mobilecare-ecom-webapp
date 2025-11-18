// Script to clean repair prices - remove pound signs from numeric prices
const mongoose = require('mongoose');
const Phone = require('../models/Phone');
const Tablet = require('../models/Tablet');
const Watch = require('../models/Watch');
const Console = require('../models/Console');
require('dotenv').config();

const cleanPrices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const models = [
      { Model: Phone, name: 'Phone' },
      { Model: Tablet, name: 'Tablet' },
      { Model: Watch, name: 'Watch' },
      { Model: Console, name: 'Console' }
    ];

    for (const { Model, name } of models) {
      console.log(`\nProcessing ${name}s...`);
      const devices = await Model.find({});
      let updateCount = 0;

      for (const device of devices) {
        let needsUpdate = false;
        
        if (device.repairs && device.repairs.length > 0) {
          device.repairs.forEach((repair, index) => {
            if (repair.price && 
                !repair.price.toLowerCase().includes('quote') && 
                repair.price.includes('£')) {
              // Remove pound sign and any commas
              device.repairs[index].price = repair.price.replace(/[£,]/g, '');
              needsUpdate = true;
              console.log(`  Updated ${device.model} - ${repair.repair}: ${repair.price} -> ${device.repairs[index].price}`);
            }
          });
        }

        if (needsUpdate) {
          await device.save();
          updateCount++;
        }
      }

      console.log(`Updated ${updateCount} ${name}s`);
    }

    console.log('\nPrice cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

cleanPrices();