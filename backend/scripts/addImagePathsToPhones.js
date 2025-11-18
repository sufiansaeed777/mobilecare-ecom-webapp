// scripts/addImagePathsToPhones.js
const connectDB = require('../config/db');
const Phone = require('../models/Phone');
require('dotenv').config();

// Complete image mapping with EXACT names from data file
const imageMapping = {
  'Apple': {
    // iPhone 16 Series
    'iPhone 16 pro max': '/images/I-Phones/I-Phones/iphone-16-pro-max.avif',
    'iPhone 16 pro': '/images/I-Phones/I-Phones/iphone-16-pro.avif',
    'iPhone 16 plus': '/images/I-Phones/I-Phones/iphone-16-plus.avif',
    'iPhone 16': '/images/I-Phones/I-Phones/iphone16_1.avif',
    
    // iPhone 15 Series
    'iPhone 15 pro max': '/images/I-Phones/I-Phones/iphone-15-pro-max.avif',
    'iPhone 15 pro': '/images/I-Phones/I-Phones/iphone-15-pro.avif',
    'iPhone 15 plus': '/images/I-Phones/I-Phones/iphone-15-plus.avif',
    'iPhone 15': '/images/I-Phones/I-Phones/IPHONE15.avif',
    
    // iPhone 14 Series
    'iPhone 14 pro max': '/images/I-Phones/I-Phones/IPHONE14PROMAX.avif',
    'iPhone 14 pro': '/images/I-Phones/I-Phones/iphone14pro.avif',
    'iPhone 14 plus': '/images/I-Phones/I-Phones/iphone-14.avif',
    'iPhone 14': '/images/I-Phones/I-Phones/iphone-14.avif',
    
    // iPhone 13 Series
    'iPhone 13 pro max': '/images/I-Phones/I-Phones/iphone-13-pro-max.avif',
    'iPhone 13 pro': '/images/I-Phones/I-Phones/iphone-13-pro.avif',
    'iPhone 13': '/images/I-Phones/I-Phones/IPHONE13.avif',
    'iPhone 13 mini': '/images/I-Phones/I-Phones/iphone-13-mini.avif',
    
    // iPhone SE
    'iPhone SE 3 (2022)': '/images/I-Phones/I-Phones/iphonese32022.avif',
    'iPhone SE (2nd generation)': '/images/I-Phones/I-Phones/IPHONESE22022.avif',
    
    // iPhone 12 Series
    'iPhone 12 pro max': '/images/I-Phones/I-Phones/IPHONE12PROMAX.avif',
    'iPhone 12 pro': '/images/I-Phones/I-Phones/iphone12pro.avif',
    'iPhone 12': '/images/I-Phones/I-Phones/iphone-12.avif',
    'iPhone 12 mini': '/images/I-Phones/I-Phones/iphone-12-mini.avif',
    
    // iPhone 11 Series
    'iPhone 11 pro max': '/images/I-Phones/I-Phones/iphone-11-pro-max.avif',
    'iPhone 11 pro': '/images/I-Phones/I-Phones/iphone11pro.avif',
    'iPhone 11': '/images/I-Phones/I-Phones/IPHONE11.avif',
    
    // iPhone X Series
    'iPhone X': '/images/I-Phones/I-Phones/iphone-x.avif',
    'iPhone XS Max': '/images/I-Phones/I-Phones/iphonexsmax.jpeg',
    'iPhone XS': '/images/I-Phones/I-Phones/IPHONEXS.avif',
    'iPhone XR': '/images/I-Phones/I-Phones/iphone-xr.avif',
    
    // iPhone 8 Series - Note lowercase 'plus'
    'iPhone 8 plus': '/images/I-Phones/I-Phones/iphone8plus.jpeg',
    'iPhone 8': '/images/I-Phones/I-Phones/iphone8.avif',
    
    // iPhone 7 Series
    'iPhone 7': '/images/I-Phones/I-Phones/iphone-7.avif',
    'iPhone 7 plus': '/images/I-Phones/I-Phones/iphone-7-plus.avif',
    
    // iPhone 6 Series
    'iPhone 6s plus': '/images/I-Phones/I-Phones/iphone-6s-plus.avif',
    'iPhone 6 plus': '/images/I-Phones/I-Phones/iphone-6s-plus.avif',
    'iPhone 6s': '/images/I-Phones/I-Phones/iphone-6.avif',
    'iPhone 6': '/images/I-Phones/I-Phones/iphone-6.avif',
    
    // iPhone 5 Series
    'iPhone 5c': '/images/I-Phones/I-Phones/iphone-5c.avif',
    // Note: iPhone 5s, iPhone 5, iPhone 4s, iPhone 4 have null images in data
  },
  
  'Samsung': {
    // S Series
    'Galaxy S24 Ultra': '/images/samsung/samsungs24ultra.avif',
    'Galaxy S24 Plus': '/images/samsung/samsungs24plus.avif',
    'Galaxy S24': '/images/samsung/samsungs24.avif',
    'Galaxy S23 Ultra': '/images/samsung/galaxys23ultra.avif',
    'Galaxy S23 Plus': '/images/samsung/galaxys23plus.avif',
    'Galaxy S23': '/images/samsung/galaxys23.avif',
    'Galaxy S22 Ultra': '/images/samsung/galaxys22ultra.avif',
    'Galaxy S22 Plus': '/images/samsung/galaxys22plus.avif',
    'Galaxy S22': '/images/samsung/galaxys22.avif',
    'Galaxy S21 Ultra': '/images/samsung/galaxys21ultra.avif',
    'Galaxy S21 FE': '/images/samsung/galaxys21fe.avif',
    'Galaxy S21 Plus': '/images/samsung/samsungs21plusnew.avif',
    'Galaxy S21': '/images/samsung/samsungs21.avif',
    'Galaxy S20 Ultra': '/images/samsung/galaxys20ultra.avif',
    'Galaxy S20 plus': '/images/samsung/samsungs20plus.avif', // lowercase 'plus'
    'Galaxy S20 fe': '/images/samsung/galaxys20fe.avif', // lowercase 'fe'
    'Galaxy S20': '/images/samsung/samsungs20plus.avif',
    'Galaxy S10 5g': '/images/samsung/galaxys10.avif', // lowercase 'g'
    'Galaxy S10 plus': '/images/samsung/galaxys10plus.avif', // lowercase 'plus'
    'Galaxy S10': '/images/samsung/galaxys10.avif',
    'Galaxy S10 e': '/images/samsung/galaxys10e.avif', // lowercase 'e'
    'Galaxy S10 lite': '/images/samsung/s10lite.jpeg', // lowercase 'lite'
    'Galaxy S9 plus': '/images/samsung/samsungs9plus.avif', // lowercase 'plus'
    'Galaxy S9': '/images/samsung/galaxys9.avif',
    'Galaxy S8 plus': '/images/samsung/galaxys8.avif', // lowercase 'plus'
    'Galaxy S8': '/images/samsung/galaxys8.avif',
    'Galaxy S7 edge': '/images/samsung/galaxys7edge.avif', // lowercase 'edge'
    'Galaxy S7': '/images/samsung/galaxys7.avif',
    'Galaxy S6': '/images/samsung/galaxys6.avif',
    'Galaxy S6 edge': '/images/samsung/galaxys6edge.avif', // lowercase 'edge'
    
    // Note Series - exact capitalization
    'Galaxy note 20 Ultra': '/images/samsung/galaxynote20ultra.jpg',
    'Galaxy note 20': '/images/samsung/galaxynote20.jpg',
    'Galaxy note 10 plus 5g': '/images/samsung/samsunggalaxynote10.avif',
    'Galaxy note 10 plus': '/images/samsung/samsunggalaxynote10.avif',
    'Galaxy note 10': '/images/samsung/samsunggalaxynote10.avif',
    'Galaxy note 10 lite': '/images/samsung/GALAXYNOTE10LITE.avif',
    'Galaxy note 9': '/images/samsung/galaxynote9.avif',
    'Galaxy note 8': '/images/samsung/GALAXYNOTE8.avif',
    
    // Z Series - exact naming
    'Samsung Z Flip 6': '/images/samsung/zflip6.jpg',
    'Samsung Z Flip 5': '/images/samsung/zflip5.jpg',
    'Samsung Z Flip 4': '/images/samsung/zflip4.webp',
    'Samsung Z Flip 3': '/images/samsung/zflip3.jpg',
    'Samsung Z Flip 2': '/images/samsung/zflip2.jpg', // Add if image exists
    'Samsung Z Flip 1': '/images/samsung/zflip1.jpg', // Add if image exists
    'Samsung Z Fold 6': '/images/samsung/zfold6.jpg',
    'Samsung Z Fold 5': '/images/samsung/zfold5.jpg',
    'Samsung Z Fold 4': '/images/samsung/zfold4.webp',
    'Samsung Z Fold 3': '/images/samsung/zfold3.jpg',
    'Samsung Z Fold 2': '/images/samsung/zfold2.jpg', // Add if image exists
    'Samsung Z Fold 1': '/images/samsung/zfold1.jpg', // Add if image exists
    
    // A Series - exact names from data
    'Samsung A73': '/images/samsung/samsunga73.avif',
    'Samsung A72': '/images/samsung/Samsung_Galaxy_A72_.avif',
    'Samsung A71': '/images/samsung/Samsung_Galaxy_A71_.avif',
    'Samsung A70': '/images/samsung/a70.webp',
    'Samsung A55': '/images/samsung/a55.jpeg',
    'Samsung A54': '/images/samsung/a54.jpg',
    'Samsung A53': '/images/samsung/a53.webp',
    'Samsung A52s 5G': '/images/samsung/a52s5g.avif',
    'Samsung A52 4G': '/images/samsung/a52_4g.avif',
    'Samsung A51 5G': '/images/samsung/SAMSUNGA51.avif',
    'Samsung A50': '/images/samsung/a50.avif',
    'Samsung A42 5G': '/images/samsung/a42_5f.avif',
    'Samsung A41': '/images/samsung/a41.jpg',
    'Samsung A40': '/images/samsung/a40.jpg',
    'Samsung A35': '/images/samsung/a35.jpeg',
    'Samsung A34 5G': '/images/samsung/a34_5g.avif',
    'Samsung A33': '/images/samsung/a33.webp',
    'Samsung Galaxy A32 5G': '/images/samsung/a32_5g.avif',
    'Samsung A32 4G': '/images/samsung/a32_4g.avif',
    'Samsung A31': '/images/samsung/a31.avif',
    'Samsung A30': '/images/samsung/a30.png',
    'Samsung A25': '/images/samsung/a25.webp',
    'Samsung A24': '/images/samsung/a24.webp',
    'Samsung A23': '/images/samsung/a23.jpg',
    'Samsung A22 5G': '/images/samsung/a22_5g.jpeg',
    'Samsung A22 4G': '/images/samsung/a22_4g.avif',
    'Samsung A21S': '/images/samsung/a21s.jpeg',
    'Samsung A20S': '/images/samsung/SAMSUNGA20S.avif',
    'Samsung A20E': '/images/samsung/SAMSUNGA20E.avif',
    'Samsung A20': '/images/samsung/SAMSUNGA20.avif',
    'Samsung A15 5G': '/images/samsung/SAMSUNGA155G.avif',
    'Samsung A15': '/images/samsung/SAMSUNGA15.avif',
    'Samsung A14': '/images/samsung/SAMSUNGA14.avif',
    'Samsung A13': '/images/samsung/SAMSUNGA13.avif',
    'Samsung A12': '/images/samsung/SAMSUNGA12.avif',
    'Samsung A11': '/images/samsung/SAMSUNGA11.avif',
    'Samsung A10S': '/images/samsung/SAMSUNGA10S.avif',
    'Samsung A10': '/images/samsung/SAMSUNGA10S.avif',
    // Note: Samsung A9, A8, A7, A6, A05 have null images in data
    
    // J Series
    'Samsung Galaxy J6': '/images/samsung/samsungj6.avif',
    'Samsung Galaxy J5 2017': '/images/samsung/galaxyj52017.avif',
    'Samsung Galaxy J5': '/images/samsung/galaxyj5.jpg',
    'Samsung Galaxy J4': '/images/samsung/j4.jpeg',
    'Samsung Galaxy J3 2017': '/images/samsung/SAMSUNGA32017.avif',
  },
  
  'Google Pixel': {
    'Pixel 9 pro xl': '/images/GOOGLEPIXEL/googlepixel9proxl.avif',
    'Pixel 9 pro': '/images/GOOGLEPIXEL/googlepixel9proxl.avif',
    'Pixel 8a': '/images/GOOGLEPIXEL/googlepixel8a.avif',
    'Pixel 8': '/images/GOOGLEPIXEL/google-pixel-8.avif',
    'Pixel 8 pro': '/images/GOOGLEPIXEL/GooglePixel8Pro.avif',
    'Pixel 6 pro': '/images/GOOGLEPIXEL/GooglePixel6Pro.avif',
    'Pixel 6a': '/images/GOOGLEPIXEL/GooglePixel6a.avif',
    'Pixel 6': '/images/GOOGLEPIXEL/googlepixel6.avif',
    'Pixel 5a': '/images/GOOGLEPIXEL/googlepixel5a.avif',
    'Pixel 5': '/images/GOOGLEPIXEL/googlepixel5.avif',
    'Pixel 4a': '/images/GOOGLEPIXEL/googlepixel4A.avif',
    'Pixel 4a 5g': '/images/GOOGLEPIXEL/googlepixel4a5gnew.avif',
    'Pixel 4 5g': '/images/GOOGLEPIXEL/googlepixel4a5gnew.avif', // Using same as 4a 5g
    'Pixel 4 xl': '/images/GOOGLEPIXEL/pixel4xl.avif',
    'Pixel 4': '/images/GOOGLEPIXEL/pixel4.avif',
    'Pixel 3a xl': '/images/GOOGLEPIXEL/GOOGLEPIXEL3AXL.avif',
    'Pixel 3a': '/images/GOOGLEPIXEL/googlepixel3a.avif',
    'Pixel 3 xl': '/images/GOOGLEPIXEL/GOOGLEPIXEL3AXL.avif',
    'Pixel 3': '/images/GOOGLEPIXEL/googlepixel3a.avif',
    'Pixel 2 xl': '/images/GOOGLEPIXEL/GOOGLEPIXEL2XL.avif',
    'Pixel 2': '/images/GOOGLEPIXEL/GOOGLEPIXEL2.avif',
    'Pixel 7': '/images/GOOGLEPIXEL/googlepixel7.avif',
    'Pixel 7 Pro': '/images/GOOGLEPIXEL/GooglePixel7Pro.avif',
    'Pixel 7a': '/images/GOOGLEPIXEL/googlepixel7a.avif',
  },
  
  'OnePlus': {
    'Oneplus Nord 5g': '/images/ONEPLUS/ONEPLUSNORD5G.avif',
    'Oneplus 8 pro': '/images/ONEPLUS/ONEPLUS8PRO.avif',
    'Oneplus 8t': '/images/ONEPLUS/oneplus8t.avif',
    'Oneplus 8': '/images/ONEPLUS/ONEPLUS8.avif',
    'Oneplus 7t pro 5g': '/images/ONEPLUS/ONEPLUS7TPRO5G.avif',
    'Oneplus 7t': '/images/ONEPLUS/ONEPLUS7T.avif',
    'Oneplus 7 pro': '/images/ONEPLUS/ONEPLUS7PRO.avif',
    'Oneplus 7': '/images/ONEPLUS/ONEPLUS7.avif',
    'Oneplus 6t Mclaren': '/images/ONEPLUS/oneplus6tmclaren.webp',
    'Oneplus 6t': '/images/ONEPLUS/ONEPLUS6T.avif',
    'Oneplus 6': '/images/ONEPLUS/ONEPLUS6.avif',
    'Oneplus 5t': '/images/ONEPLUS/ONEPLUS5T.avif',
    'Oneplus 5': '/images/ONEPLUS/oneplus5.jpeg',
    'Oneplus 3t': '/images/ONEPLUS/oneplus3t.webp',
    'Oneplus 3': '/images/ONEPLUS/oneplus3.webp',
    'Oneplus Nord': '/images/ONEPLUS/oneplusnord.avif',
    'Oneplus Nord n10 5g': '/images/ONEPLUS/n105g.avif',
    'Oneplus one': '/images/ONEPLUS/oneplus1.webp', // lowercase 'one'
  },
  
  'Huawei': {
    'Honor 200 Pro': '/images/HUAWEI/HUAWEI/hono200pro.avif',
    'Honor 200 Smart': '/images/HUAWEI/HUAWEI/HONOR200SMART.avif',
    'Honor 200 Lite': '/images/HUAWEI/HUAWEI/HONOR200LITE.avif',
    'Honor 90': '/images/HUAWEI/HUAWEI/honor90.avif',
    'Magic 6 Lite': '/images/HUAWEI/HUAWEI/magic6lite.avif',
    'Magic 5 Lite': '/images/HUAWEI/HUAWEI/magic-5-lite.avif',
    'P30 Pro': '/images/HUAWEI/HUAWEI/huaweip30pro.avif',
    'Honor 90 Lite': '/images/HUAWEI/HUAWEI/honor90lite.avif',
    'Honor 9x': '/images/HUAWEI/HUAWEI/honor9x.avif',
    'P30': '/images/HUAWEI/HUAWEI/huaweip30.avif',
    'P30 Lite': '/images/HUAWEI/HUAWEI/huaweip30lite.avif',
    'Mate 20 Pro': '/images/HUAWEI/HUAWEI/huaweimate20pro.avif', // Add if image exists
    'Mate 20': '/images/HUAWEI/HUAWEI/huaweimate20.avif',
    'P20 Pro': '/images/HUAWEI/HUAWEI/huaweip20pro.avif',
    'P20 Lite': '/images/HUAWEI/HUAWEI/huaweip20lite.avif',
    'P20': '/images/HUAWEI/HUAWEI/huaweip20.avif',
    'Y6': '/images/HUAWEI/HUAWEI/huaweiy6.avif',
    'Y9s': '/images/HUAWEI/HUAWEI/huaweiy9s.avif',
    'Y9se': '/images/HUAWEI/HUAWEI/HUAWEIY9SE.avif',
    'Y9a': '/images/HUAWEI/HUAWEI/huaweiy9a.avif',
    'Y70': '/images/HUAWEI/HUAWEI/huaweiy70.avif',
    'Y6 (2019)': '/images/HUAWEI/HUAWEI/HUAWEIY62019.avif',
    'Honor X6A': '/images/HUAWEI/HUAWEI/HONORX6A.avif',
    'Honor X7B': '/images/HUAWEI/HUAWEI/HONORX7B.avif',
    'Honor x9': '/images/HUAWEI/HUAWEI/honorx9.avif',
    'Honor 10': '/images/HUAWEI/HUAWEI/honor10.avif',
    'Honor Y7A': '/images/HUAWEI/HUAWEI/HUAWEIY7A.avif',
    'Honor Y8A': '/images/HUAWEI/HUAWEI/huaweiy7a.avif',
    'Honor Y8P': '/images/HUAWEI/HUAWEI/HUAWEIY8P.avif',
    'Y9': '/images/HUAWEI/HUAWEI/huaweiy9.avif',
    // Note: P Smart series, Honor X7A, X9A, X8A, X8, Y60, Y61, Nova 9se have null images
  },
  
  'Oppo': {
    'A96': '/images/oppo/oppoa96.avif',
    'A94 4g': '/images/oppo/oppoa944g.avif',
    'A77 5g': '/images/oppo/oppoa775g.avif',
    'A76': '/images/oppo/opppo_a76.avif',
    'A74 5g': '/images/oppo/oppoa745g.avif',
    'A74 4g': '/images/oppo/oppoa744gorignal.avif',
    'A73 5g': '/images/oppo/oppoa73_5g.jpeg',
    'A59': '/images/oppo/oppoa59.jpeg',
    'A72': '/images/oppo/oppoa72.avif',
    'A53': '/images/oppo/oppoa_53.jpeg',
    // Note: AX7, Realme 8 5g have null images
  },
  
  'Redmi': {
    'Note 13 4G': '/images/redmi/redmi/redmenote134g.avif',
    'Note 13 5G': '/images/redmi/redmi/redmenote135g.avif',
    'Note 10 s': '/images/redmi/redmi/redmenote10s.avif',
    'Note 12 pro 4G': '/images/redmi/redmi/redminote12.avif',
    'Note 11 pro': '/images/redmi/redmi/redmmenote11pro.avif',
    'Note 9': '/images/redmi/redmi/redminote9.avif',
    'Note 8': '/images/redmi/redmi/redminote8.avif',
    'Note 7': '/images/redmi/redmi/redminote7.avif',
    'Note 11': '/images/redmi/redmi/redminote11.avif',
    'Note 10 pro 4g': '/images/redmi/redmi/note10pro4g.jpeg',
  },
  
  'Motorola': {
    'Motorola G34': '/images/MOTROLA/MOTOG34.avif',
    'Motorola G62': '/images/MOTROLA/MOTOG62.avif',
    'Motorola G04': '/images/MOTROLA/motog04new.avif',
    'Motorola G84': '/images/MOTROLA/MOTOG84.avif',
    'Motorola G 5g (2024)': '/images/MOTROLA/motog5g2024.webp',
    'Motorola G54': '/images/MOTROLA/MOTOG54.avif',
    'Motorola E40': '/images/MOTROLA/MOTOE40.avif',
    'Motorola G7': '/images/MOTROLA/MOTOG7.avif',
    'Motorola G7 plus': '/images/MOTROLA/MOTOG7PLUS.avif',
    'Motorola G8': '/images/MOTROLA/MOTOG8.avif',
    'Motorola G8 plus': '/images/MOTROLA/motog8plus.jpeg',
    'Motorola G9': '/images/MOTROLA/MOTOG9.avif',
    'Motorola G9 play': '/images/MOTROLA/motog9play.avif',
    'Motorola E13': '/images/MOTROLA/MOTOE13.avif',
    'Motorola G9 plus': '/images/MOTROLA/motog9plus.avif',
    'Motorola G9 power': '/images/MOTROLA/motog9power.jpeg',
    'Motorola C': '/images/MOTROLA/motoc.jpeg',
    'Motorola E5': '/images/MOTROLA/motoe5.jpeg',
    'Motorola E5 play': '/images/MOTROLA/moto5play.jpeg',
    'Motorola E6': '/images/MOTROLA/motoe6plus.webp',
    'Motorola E6 plus': '/images/MOTROLA/motoe6plus.webp',
    'Motorola E14': '/images/MOTROLA/MOTOE14.avif',
    'Motorola G35': '/images/MOTROLA/motog35.webp',
    // Note: Many Motorola models have null images
  },
  
  'Nokia': {
    'Nokia 8.1': '/images/NOKIA/nokia8.1.avif',
    'Nokia 7.2': '/images/NOKIA/nokia7.2.avif',
    'Nokia 7.1': '/images/NOKIA/nokia7.1.avif',
    'Nokia 6.2': '/images/NOKIA/nokia6.2.avif',
    'Nokia 6.1': '/images/NOKIA/nokia6.1.avif',
    'Nokia 5.4': '/images/NOKIA/nokia5.4.avif',
    'Nokia 5.1 plus': '/images/NOKIA/nokia5.1plusnew.avif',
    'Nokia 5.1': '/images/NOKIA/nokia5.1.avif',
    'Nokia 4.2': '/images/NOKIA/nokia4.2.avif',
    'Nokia 3.4': '/images/NOKIA/nokia3.4.avif',
    'Nokia 3.2': '/images/NOKIA/nokia3.2.avif',
    'Nokia 3.1 plus': '/images/NOKIA/nokia3.1plus.avif',
    'Nokia 3': '/images/NOKIA/nokia3.avif',
    'Nokia 2.3': '/images/NOKIA/nokia2.3new.avif',
    'Nokia 2.2': '/images/NOKIA/nokia2.2.avif',
    'Nokia 2': '/images/NOKIA/nokia2.avif',
    'Nokia G22': '/images/NOKIA/NOKIAG22.avif',
    'Nokia G21': '/images/NOKIA/NOKIAG21.avif',
    'Nokia C30': '/images/NOKIA/NOKIAC30.avif',
    'Nokia C21 plus': '/images/NOKIA/NOKIAC21PLUS.avif',
    'Nokia C01 plus': '/images/NOKIA/NOKIAC01PLUS.avif',
    'Nokia C22': '/images/NOKIA/NOKIAC22.avif',
    'Nokia C32': '/images/NOKIA/NOKIAC32.avif',
    // Note: Nokia 7, 6, 5, 2.4, 1, x7, x6, x20 have null images
  }
};

async function addImagePaths() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');
    
    const phones = await Phone.find({});
    console.log(`Found ${phones.length} phones in database`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let alreadyHasImageCount = 0;
    
    for (const phone of phones) {
      // Skip if phone already has an image
      if (phone.image) {
        console.log(`✓ ${phone.brand} ${phone.model} already has image`);
        alreadyHasImageCount++;
        continue;
      }
      
      const brandMapping = imageMapping[phone.brand];
      
      if (brandMapping && brandMapping[phone.model]) {
        phone.image = brandMapping[phone.model];
        await phone.save();
        console.log(`✓ Updated ${phone.brand} ${phone.model} with image path`);
        updatedCount++;
      } else {
        console.log(`✗ No image mapping found for ${phone.brand} ${phone.model}`);
        skippedCount++;
      }
    }
    
    // Update phoneData.js
    const phoneController = require('../controllers/phoneController');
    await phoneController.updatePhoneDataFile();
    
    console.log('\n=== Migration Complete ===');
    console.log(`Total phones processed: ${phones.length}`);
    console.log(`Already had images: ${alreadyHasImageCount}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped (no image mapping): ${skippedCount}`);
    console.log('phoneData.js file has been updated');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
addImagePaths();