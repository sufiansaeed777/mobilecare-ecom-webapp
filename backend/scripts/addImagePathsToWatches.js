// scripts/addImagePathsToWatches.js
const mongoose = require('mongoose');
require('dotenv').config();

// Direct connection without using the connectDB helper
const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✔ Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

// Updated mappings with EXACT names from data file
const watchImageMappings = {
    // Apple Watches - exact names including "(First Instance)" and "(Second Instance)"
    'IWATCH SERIES 10 (46MM)': '/images/watches/iwatch_series10_46mm.jpg',
    'IWATCH SERIES 10 (42MM)': '/images/watches/iwatch_series10_42mm.jpg',
    'IWATCH SERIES ULTRA 2 2023 (49MM)': '/images/watches/iwatchseriesultra202349mm.jpg',
    'IWATCH SERIES ULTRA 2022 (49MM)': '/images/watches/iwatchseriesultra202249mm.jpg',
    'IWATCH SERIES 8 (45MM) (First Instance)': '/images/watches/iwatchseries845mm.jpg',
    'IWATCH SERIES 9 (41MM)': '/images/watches/iwatchseries941mm.jpg',
    'IWATCH SERIES 8 (45MM) (Second Instance)': '/images/watches/iwatchseries845mm.jpg',
    'IWATCH SERIES 8 (41MM)': '/images/watches/iwatchseries841mm.jpg',
    'IWATCH SERIES SE (44MM) 2ND GEN 2022': '/images/watches/iwatchseriesse44mm.jpg',
    'IWATCH SERIES SE (40MM) 2ND GEN 2022': '/images/watches/iwatchseriesse.jpeg',
    'IWATCH SERIES 7 (45MM)': '/images/watches/iwatchseries7.jpg',
    'IWATCH SERIES 7 (41MM)': '/images/watches/iwatchseries7.jpg',
    'IWATCH SERIES SE (44MM) (1st Gen - 2020)': '/images/watches/iwatchseriesse44mm.jpg',
    'IWATCH SERIES SE (40MM) (1st Gen - 2020)': '/images/watches/iwatchseriesse.jpeg',
    'IWATCH SERIES 6 (44MM)': '/images/watches/iwatchseries644mm.jpg',
    'IWATCH SERIES 6 (40MM)': '/images/watches/iwatchseries640mm.jpg',
    'IWATCH SERIES 5 (44MM)': '/images/watches/iwatchseries544mm.jpg',
    'IWATCH SERIES 5 (40MM)': '/images/watches/iwatchseries540mm.jpg',
    'IWATCH SERIES 4 (44MM)': '/images/watches/iwatchseries444mm.jpg',
    'IWATCH SERIES 4 (40MM)': '/images/watches/iwatchseries440mm.jpg',
    'IWATCH SERIES 3 (42MM)': '/images/watches/iwatchseries342mm.jpg',
    'IWATCH SERIES 3 (38MM)': '/images/watches/iwatchseries344mm.png',
    'IWATCH SERIES 3 (42MM) GPS + CELLULAR': '/images/watches/iwatchseries342mm.jpg',
    'IWATCH SERIES 3 38MM GPS + Cellular': '/images/watches/iwatchseries344mm.png',
    'IWATCH SERIES 2 (42MM)': '/images/watches/iwatchseries344mm.png',
    'IWATCH SERIES 2 (38MM)': '/images/watches/iwatchseries344mm.png',
    'IWATCH SERIES 1 (42MM)': '/images/watches/iwatchseries344mm.png',
    'IWATCH SERIES 1 (38MM)': '/images/watches/iwatchseries344mm.png',
};

async function migrate() {
    try {
        await connectToDb();
        
        // Use the raw MongoDB collection to bypass Mongoose validation
        const db = mongoose.connection.db;
        const watchesCollection = db.collection('watches');
        
        // Get all watches using raw MongoDB
        const watches = await watchesCollection.find({}).toArray();
        console.log(`✔ Found ${watches.length} watch documents`);
        
        let updatedCount = 0;
        let priceFixCount = 0;
        let typoFixCount = 0;
        let imageUpdateCount = 0;
        
        for (const watch of watches) {
            let needsUpdate = false;
            const updates = {};
            
            // Fix typo in repair names and convert prices
            if (watch.repairs && Array.isArray(watch.repairs)) {
                const fixedRepairs = watch.repairs.map(repair => {
                    let updatedRepair = { ...repair };
                    
                    // Fix typo: "Replacment" -> "Replacement"
                    if (repair.repair && repair.repair.includes('Replacment')) {
                        updatedRepair.repair = repair.repair.replace('Replacment', 'Replacement');
                        typoFixCount++;
                    }
                    
                    // Fix prices - convert strings to numbers
                    if (typeof repair.price === 'string') {
                        // Remove currency symbols and convert to number
                        const cleanPrice = repair.price.replace(/[^0-9.]/g, '');
                        let numPrice = parseFloat(cleanPrice);
                        
                        // Handle "Free" or invalid prices
                        if (isNaN(numPrice) || repair.price.toLowerCase() === 'free') {
                            numPrice = 0;
                        }
                        
                        priceFixCount++;
                        updatedRepair.price = numPrice;
                    }
                    
                    return updatedRepair;
                });
                
                // Check if any repairs were modified
                const repairsChanged = JSON.stringify(fixedRepairs) !== JSON.stringify(watch.repairs);
                if (repairsChanged) {
                    updates.repairs = fixedRepairs;
                    needsUpdate = true;
                }
            }
            
            // Update image path if needed
            const imagePath = watchImageMappings[watch.model];
            if (imagePath && (!watch.image || watch.image !== imagePath)) {
                updates.image = imagePath;
                needsUpdate = true;
                imageUpdateCount++;
                console.log(`✓ Updating image for ${watch.brand} ${watch.model}`);
            } else if (!imagePath) {
                console.log(`✗ No image mapping found for ${watch.brand} ${watch.model}`);
            } else if (watch.image === imagePath) {
                console.log(`✓ ${watch.brand} ${watch.model} already has correct image`);
            }
            
            // Apply updates if needed
            if (needsUpdate) {
                await watchesCollection.updateOne(
                    { _id: watch._id },
                    { $set: updates }
                );
                updatedCount++;
            }
        }
        
        // Update watchData.js file if you have a similar controller
        try {
            const watchController = require('../controllers/watchController');
            if (watchController.updateWatchDataFile) {
                await watchController.updateWatchDataFile();
                console.log('✓ watchData.js file has been updated');
            }
        } catch (error) {
            console.log('Note: No watchController.updateWatchDataFile found - you may need to update watchData.js manually');
        }
        
        console.log('\n=== Watch Migration Complete ===');
        console.log(`Total watches processed: ${watches.length}`);
        console.log(`Watches updated: ${updatedCount}`);
        console.log(`Images updated: ${imageUpdateCount}`);
        console.log(`Prices fixed: ${priceFixCount}`);
        console.log(`Typos fixed: ${typoFixCount}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

// Run the migration
migrate();