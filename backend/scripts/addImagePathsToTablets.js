// scripts/addImagePathsToTablets.js
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

// Complete tablet image mappings based on your file structure
const tabletImageMappings = {
    // Apple iPads - 2nd to 10th Gen
    'IPad 2th Gen (A1397, A1396, A1395)': '/images/tablet/ipad2thgen.jpg',
    'IPad 3th Gen (A1430, A1416, A1403)': '/images/tablet/ipad3rdgen.jpeg',
    'IPad 4th Gen (A1460, A1459, A1458)': '/images/tablet/ipad4thgen.jpg',
    'IPad 5th Gen': '/images/tablet/ipad5thgen.webp',
    'IPad 6th Gen (A1893-A1954)': '/images/tablet/ipad6thgen.jpg',
    'IPad 7th Gen': '/images/tablet/ipad7thgen.webp',
    'IPad 8th Gen (A2270, A2428, A2429, A2430)': '/images/tablet/ipad8thgen.webp',
    'IPad 9th Gen (A2602, A2604, A2603)': '/images/tablet/ipad9thgen.webp',
    'IPad 10th Gen (A2696-A2757-A2777)': '/images/tablet/ipad10thgen.webp',
    
    // iPad Pro Series
    'IPad Pro 9.7 (A1673-A1674-A1675)': '/images/tablet/ipadpro9.7.jpg',
    'IPad Pro 10.5 (A1701 – A1709)': '/images/tablet/ipadpro10.5.jpg',
    'IPad Pro 11': '/images/tablet/ipadpro11.jpg',
    'IPad Pro 11 2nd Gen (A2228-A2068-A2230)': '/images/tablet/ipadpro112ndgen.webp',
    'IPad 12.9 1ST Gen (A1584, A1652)': '/images/tablet/ipad12.91stgen.jpg',
    'IPad Pro 12.9 2nd Gen (A1670, A1671)': '/images/tablet/ipadpro12.92ndgen.webp',
    'IPad Pro 12.9 3rd Gen (A1876, A2014, A1895, A1983)': '/images/tablet/ipadpro12.93rdgen.jpg',
    'IPad Pro 12.9″ 4th Gen (A2229, A2069, A2232, A2233)': '/images/tablet/ipadpro12.94thgen.jpg',
    'IPad Pro 12.9 5th Gen (A2378-A2461-A2379-A2462)': '/images/tablet/ipadpro12.95thgen.jpg',
    
    // iPad Air Series
    'iPad Air 5th Gen (A2588, A2589, A2591)': '/images/tablet/ipadair5thgen.webp',
    'iPad Air 4th Gen (A2316, A2324, A2325, A2072)': '/images/tablet/ipadair5thgen.webp', // Note: might be duplicate image
    'iPad Air 3rd Gen (A2152, A2153, A2123)': '/images/tablet/ipadair5thgen.webp', // Note: might be duplicate image
    'iPad Air 2 (A1566, A1567)': '/images/tablet/ipadair2.webp',
    'iPad Air (A1474, A1475)': '/images/tablet/ipadair.png',
    
    // iPad Mini Series
    'IPad Mini 6 (A1474-A1475-A1476)': '/images/tablet/ipadmini6.webp',
    'IPad Mini 5 (A2133-A2124-A2126)': '/images/tablet/ipadmini5.webp',
    'IPad Mini 4 (A1538-A1550)': '/images/tablet/ipadmini4.webp',
    'IPad Mini 3 (A1599, A1600)': '/images/tablet/ipadmini3.webp',
    'IPad Mini 1 & 2 (A1489, A1490, A1432, A1454)': '/images/tablet/ipadmini2.jpg',
    
    // Samsung Tablets
    'Samsung Galaxy Tab S7': '/images/tablet/samsunggalaxya7.webp',
    'Samsung Tab A9 Plus': '/images/tablet/samsunggalaxya8.jpg',
    'Samsung Galaxy Tab A8': '/images/tablet/samsunggalaxya8.jpg',
    'Samsung Tab A7': '/images/tablet/samsunggalaxytaba7.webp',
    'Samsung Tab A7 Lite': '/images/tablet/samsunggalaxytaba7lite.webp',
    'SAMSUNG TAB A6 2019': '/images/tablet/samsunggalaxytaba6.jpg',
    'SAMSUNG TAB A6 T285': '/images/tablet/samsunggalaxytaba6.jpg',
    'SAMSUNG TAB A6 T295': '/images/tablet/samsunggalaxytaba6.jpg',
    'SAMSUNG TAB A6 T585': '/images/tablet/samsunggalaxytaba6.jpg',
    'Samsung Tab S6 Lite': '/images/tablet/samsunggalaxytabs6.webp',
};

async function migrate() {
    try {
        await connectToDb();
        
        // Use the raw MongoDB collection to bypass Mongoose validation
        const db = mongoose.connection.db;
        const tabletsCollection = db.collection('tablets');
        
        // Get all tablets using raw MongoDB
        const tablets = await tabletsCollection.find({}).toArray();
        console.log(`✔ Found ${tablets.length} tablet documents`);
        
        let updatedCount = 0;
        let priceFixCount = 0;
        
        for (const tablet of tablets) {
            let needsUpdate = false;
            const updates = {};
            
            // Fix prices - convert strings to numbers
            if (tablet.repairs && Array.isArray(tablet.repairs)) {
                const fixedRepairs = tablet.repairs.map(repair => {
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
                const repairsChanged = JSON.stringify(fixedRepairs) !== JSON.stringify(tablet.repairs);
                if (repairsChanged) {
                    updates.repairs = fixedRepairs;
                    needsUpdate = true;
                }
            }
            
            // Update image path if needed
            const imagePath = tabletImageMappings[tablet.model];
            if (imagePath && tablet.image !== imagePath) {
                updates.image = imagePath;
                needsUpdate = true;
                console.log(`✓ Updating image for ${tablet.brand} ${tablet.model}`);
            } else if (!imagePath) {
                console.log(`✗ No image mapping found for ${tablet.brand} ${tablet.model}`);
            }
            
            // Apply updates if needed
            if (needsUpdate) {
                await tabletsCollection.updateOne(
                    { _id: tablet._id },
                    { $set: updates }
                );
                updatedCount++;
            }
        }
        
        console.log('\n=== Tablet Migration Complete ===');
        console.log(`Total tablets processed: ${tablets.length}`);
        console.log(`Tablets updated: ${updatedCount}`);
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