// scripts/addImagePathsToConsoles.js
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

const consoleImageMappings = {
    // Xbox - note the lowercase 'one' to match your database
    'Xbox one': '/images/consoles/xbox_one.avif',
    'Xbox One': '/images/consoles/xbox_one.avif',
    'Xbox series': '/images/consoles/xbox_series.avif',
    'Xbox Series S': '/images/consoles/xbox_series.avif',
    'Xbox Series X': '/images/consoles/xbox_series.avif',
    
    // PlayStation
    'PlayStation 4': '/images/consoles/ps4.avif',
    'PlayStation 5': '/images/consoles/ps5.avif',
    'PS4': '/images/consoles/ps4.avif',
    'PS5': '/images/consoles/ps5.avif',
    
    // Nintendo
    'Nintendo Switch': '/images/consoles/nintendo_switch.avif',
    'Switch': '/images/consoles/nintendo_switch.avif',
};

async function migrate() {
    try {
        await connectToDb();
        
        // Use the raw MongoDB collection to bypass Mongoose validation
        const db = mongoose.connection.db;
        const consolesCollection = db.collection('consoles');
        
        // Get all consoles using raw MongoDB
        const consoles = await consolesCollection.find({}).toArray();
        console.log(`✔ Found ${consoles.length} console documents`);
        
        let updatedCount = 0;
        let priceFixCount = 0;
        
        // Changed variable name from 'console' to 'consoleDoc' to avoid shadowing global console
        for (const consoleDoc of consoles) {
            let needsUpdate = false;
            const updates = {};
            
            // Fix prices - convert strings to numbers
            if (consoleDoc.repairs && Array.isArray(consoleDoc.repairs)) {
                const fixedRepairs = consoleDoc.repairs.map(repair => {
                    if (typeof repair.price === 'string') {
                        // Remove currency symbols and convert to number
                        const cleanPrice = repair.price.replace(/[^0-9.]/g, '');
                        let numPrice = parseFloat(cleanPrice);
                        
                        // Handle "Free" or invalid prices
                        if (isNaN(numPrice) || repair.price.toLowerCase() === 'free') {
                            numPrice = 0;
                        }
                        
                        priceFixCount++;
                        return { ...repair, price: numPrice };
                    }
                    return repair;
                });
                
                // Check if any repairs were modified
                const repairsChanged = JSON.stringify(fixedRepairs) !== JSON.stringify(consoleDoc.repairs);
                if (repairsChanged) {
                    updates.repairs = fixedRepairs;
                    needsUpdate = true;
                }
            }
            
            // Update image path if needed
            const imagePath = consoleImageMappings[consoleDoc.model];
            if (imagePath && consoleDoc.image !== imagePath) {
                updates.image = imagePath;
                needsUpdate = true;
                console.log(`✓ Updating image for ${consoleDoc.brand} ${consoleDoc.model}`);
            } else if (!imagePath) {
                console.log(`✗ No image mapping found for ${consoleDoc.brand} ${consoleDoc.model}`);
            } else {
                console.log(`- ${consoleDoc.brand} ${consoleDoc.model} already has correct image`);
            }
            
            // Apply updates if needed
            if (needsUpdate) {
                await consolesCollection.updateOne(
                    { _id: consoleDoc._id },
                    { $set: updates }
                );
                updatedCount++;
            }
        }
        
        console.log('\n=== Console Migration Complete ===');
        console.log(`Total consoles processed: ${consoles.length}`);
        console.log(`Consoles updated: ${updatedCount}`);
        console.log(`Prices fixed: ${priceFixCount}`);
        
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