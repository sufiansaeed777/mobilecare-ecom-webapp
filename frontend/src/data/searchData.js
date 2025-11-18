// src/data/searchData.js

// --- Helper to map brand display name to URL param ---
// (Needed by generateAllSearchableItems)
const getUrlParamForBrand = (brandName) => {
    const lower = brandName?.toLowerCase();
    switch (lower) {
      case 'apple': return 'iphone'; // Apple phones use 'iphone' in the URL
      case 'samsung': return 'samsung';
      case 'google pixel': return 'pixel';
      case 'oneplus': return 'oneplus';
      case 'huawei': return 'huawei';
      case 'nokia': return 'nokia';
      case 'motorola': return 'motorola';
      case 'oppo': return 'oppo';
      case 'xiaomi': return 'xiaomi';
      case 'ipad': return 'ipad';
      case 'iwatch': return 'iwatch';
      case 'xbox': return 'xbox';
      case 'playstation': return 'playstation';
      case 'nintendo': return 'nintendo';
      default: return brandName?.toLowerCase().replace(/\s+/g, '-') || 'unknown';
    }
  };
  // --- ---
  
  // --- Data Sources ---
  // (Devices with no image remain commented out.)
  const phoneBrandData = {
    iphone: [
      { name: 'iPhone 16 pro', image: '/images/I-Phones/I-Phones/iphone16_1.avif' },
      { name: 'iPhone 16 plus', image: '/images/I-Phones/I-Phones/iphone-16-plus.avif' },
      { name: 'iPhone 16', image: '/images/I-Phones/I-Phones/iphone16_1.avif' },
      { name: 'iPhone 15', image: '/images/I-Phones/I-Phones/iphone-15.avif' },
      { name: 'iPhone 15 plus', image: '/images/I-Phones/I-Phones/iphone-15-plus.avif' },
      { name: 'iPhone 15 pro max', image: '/images/I-Phones/I-Phones/iphone-15-pro-max.avif' },
      { name: 'iPhone 14 pro max', image: '/images/I-Phones/I-Phones/iphone14promax.avif' },
      { name: 'iPhone 14 pro', image: '/images/I-Phones/I-Phones/iphone14pro.avif' },
      { name: 'iPhone 14 plus', image: '/images/I-Phones/I-Phones/iphone-14.avif' },
      { name: 'iPhone 14', image: '/images/I-Phones/I-Phones/iphone-14.avif' },
      { name: 'iPhone 13 pro max', image: '/images/I-Phones/I-Phones/iphone-13-pro-max.avif' },
      { name: 'iPhone 13 pro', image: '/images/I-Phones/I-Phones/iphone-13-pro.avif' },
      { name: 'iPhone 13', image: '/images/I-Phones/I-Phones/iphone13.avif' },
      { name: 'iPhone 13 mini', image: '/images/I-Phones/I-Phones/iphone-13-mini.avif' },
      { name: 'iPhone 12 pro max', image: '/images/I-Phones/I-Phones/iphone12promax.avif' },
      { name: 'iPhone 12 pro', image: '/images/I-Phones/I-Phones/iphone12pro.avif' },
      { name: 'iPhone 12', image: '/images/I-Phones/I-Phones/iphone-12.avif' },
      { name: 'iPhone 12 mini', image: '/images/I-Phones/I-Phones/iphone-12-mini.avif' },
      { name: 'iPhone 11 pro max', image: '/images/I-Phones/I-Phones/iphone-11-pro-max.avif' },
      { name: 'iPhone 11 pro', image: '/images/I-Phones/I-Phones/iphone-11-pro.avif' },
      { name: 'iPhone 11', image: '/images/I-Phones/I-Phones/iphone-11-pro.avif' },
      // { name: 'iPhone SE 3 (2022)', image: '' }, // Commented out
      // { name: 'iPhone SE (2nd generation)', image: '' }, // Commented out
      // { name: 'iPhone XS max', image: '' }, // Commented out
      // { name: 'iPhone XS', image: '' }, // Commented out
      { name: 'iPhone XR', image: '/images/I-Phones/I-Phones/iphone-xr.avif' },
      // { name: 'iPhone 8 plus', image: '' }, // Commented out
      { name: 'iPhone 8', image: '/images/I-Phones/I-Phones/iphone8.avif' },
      { name: 'iPhone 7 plus', image: '/images/I-Phones/I-Phones/iphone-7-plus.avif' },
      { name: 'iPhone 6s plus', image: '/images/I-Phones/I-Phones/iphone-6s-plus.avif' },
      { name: 'iPhone 6 plus', image: '/images/I-Phones/I-Phones/iphone-6s-plus.avif' },
      { name: 'iPhone 6s', image: '/images/I-Phones/I-Phones/iphone-6.avif' },
      { name: 'iPhone 6', image: '/images/I-Phones/I-Phones/iphone-6.avif' },
      { name: 'iPhone 5c', image: '/images/I-Phones/I-Phones/iphone-5c.avif' },
      // { name: 'iPhone 5s', image: '' }, // Commented out
      // { name: 'iPhone 5', image: '' }, // Commented out
      // { name: 'iPhone 4s', image: '' }, // Commented out
      // { name: 'iPhone 4', image: '' }, // Commented out
      { name: 'iPhone 15 Pro', image: '/images/I-Phones/I-Phones/iphone-15-pro.avif' },
      { name: 'iPhone X', image: '/images/I-Phones/I-Phones/iphone-x.avif' },
    ],
    samsung: [
      { name: 'Galaxy S24 Ultra', image: '/images/samsung/samsungs24ultra.avif' },
      { name: 'Galaxy S24 Plus', image: '/images/samsung/samsungs24plus.avif' },
      { name: 'Galaxy S24', image: '/images/samsung/samsungs24.avif' },
      { name: 'Galaxy S23 Ultra', image: '/images/samsung/galaxys23ultra.avif' },
      { name: 'Galaxy S23 Plus', image: '/images/samsung/galaxys23plus.avif' },
      { name: 'Galaxy S23', image: '/images/samsung/galaxys23.avif' },
      { name: 'Galaxy S22 Ultra', image: '/images/samsung/galaxys22ultra.avif' },
      { name: 'Galaxy S22 Plus', image: '/images/samsung/galaxys22plus.avif' },
      { name: 'Galaxy S22', image: '/images/samsung/galaxys22.avif' },
      { name: 'Galaxy S21 Ultra', image: '/images/samsung/galaxys21ultra.avif' },
      { name: 'Galaxy S21 FE', image: '/images/samsung/galaxys21fe.avif' },
      { name: 'Galaxy S21 Plus', image: '/images/samsung/samsungs21plusnew.avif' },
      { name: 'Galaxy S21', image: '/images/samsung/samsungs21.avif' },
      { name: 'Galaxy S20 Ultra', image: '/images/samsung/galaxys20ultra.avif' },
      { name: 'Galaxy S20 plus', image: '/images/samsung/samsungs20plus.avif' },
      { name: 'Galaxy S20 fe', image: '/images/samsung/galaxys20fe.avif' },
      { name: 'Galaxy S20', image: '/images/samsung/samsungs20plus.avif' },
      { name: 'Galaxy S10 5g', image: '/images/samsung/galaxys10.avif' },
      { name: 'Galaxy S10 plus', image: '/images/samsung/galaxys10plus.avif' },
      { name: 'Galaxy S10', image: '/images/samsung/galaxys10.avif' },
      { name: 'Galaxy S10 e', image: '/images/samsung/galaxys10e.avif' },
      { name: 'Galaxy S10 lite', image: '/images/samsung/samsungs10litenew.avif' },
      { name: 'Galaxy S9 plus', image: '/images/samsung/samsungs9plus.avif' },
      { name: 'Galaxy S9', image: '/images/samsung/galaxys9.avif' },
      { name: 'Galaxy S8 plus', image: '/images/samsung/galaxys8.avif' },
      { name: 'Galaxy S8', image: '/images/samsung/galaxys8.avif' },
      { name: 'Galaxy S7 edge', image: '/images/samsung/galaxys7edge.avif' },
      { name: 'Galaxy S7', image: '/images/samsung/galaxys7.avif' },
      { name: 'Galaxy S6', image: '/images/samsung/galaxys6.avif' },
      // { name: 'Galaxy S6 edge', image: '' }, // Commented out
      { name: 'Galaxy note 20 Ultra', image: '/images/samsung/galaxynote20ultra.jpg' },
      { name: 'Galaxy note 20', image: '/images/samsung/galaxynote20.jpg' },
      { name: 'Galaxy note 10 plus 5g', image: '/images/samsung/samsunggalaxynote10.avif' },
      { name: 'Galaxy note 10 plus', image: '/images/samsung/samsunggalaxynote10.avif' },
      { name: 'Galaxy note 10', image: '/images/samsung/samsunggalaxynote10.avif' },
      // { name: 'Galaxy note 10 lite', image: '' }, // Commented out
      { name: 'Galaxy note 9', image: '/images/samsung/galaxynote9.avif' },
      // { name: 'Galaxy note 8', image: '' }, // Commented out
      { name: 'Samsung A73', image: '/images/samsung/a73.jpg' },
      { name: 'Samsung A72', image: '/images/samsung/a72.webp' },
      { name: 'Samsung A71', image: '/images/samsung/a71.webp' },
      { name: 'Samsung A70', image: '/images/samsung/a70.webp' },
      { name: 'Samsung A54', image: '/images/samsung/a54.jpg' },
      { name: 'Samsung A53', image: '/images/samsung/a53.webp' },
      { name: 'Samsung A51 5G', image: '/images/samsung/a51.jpg' },
      { name: 'Samsung A41', image: '/images/samsung/a41.jpg' },
      { name: 'Samsung A40', image: '/images/samsung/a40.jpg' },
      { name: 'Samsung A33', image: '/images/samsung/a33.webp' },
      { name: 'Samsung A30', image: '/images/samsung/a30.png' },
      { name: 'Samsung A25', image: '/images/samsung/a25.webp' },
      { name: 'Samsung A24', image: '/images/samsung/a24.webp' },
      { name: 'Samsung A23', image: '/images/samsung/a23.jpg' },
      { name: 'Samsung Galaxy J6', image: '/images/samsung/samsungj6.avif' },
      { name: 'Samsung Galaxy J5 2017', image: '/images/samsung/galaxyj52017.avif' },
      { name: 'Samsung Galaxy J5', image: '/images/samsung/galaxyj5.jpg' },
      { name: 'Samsung Z Flip 5', image: '/images/samsung/zflip5.jpg' },
      { name: 'Samsung Z Flip 4', image: '/images/samsung/zflip4.webp' },
      { name: 'Samsung Z Flip 3', image: '/images/samsung/zflip3.jpg' },
      { name: 'Samsung Z Fold 6', image: '/images/samsung/zfold6.jpg' },
      { name: 'Samsung Z Fold 5', image: '/images/samsung/zfold5.jpg' },
      { name: 'Samsung Z Fold 4', image: '/images/samsung/zfold4.webp' },
      { name: 'Samsung Z Fold 3', image: '/images/samsung/zfold3.jpg' },
    ],
    pixel: [
      { name: 'Pixel 9 pro xl', image: '/images/GOOGLEPIXEL/googlepixel9proxl.avif' },
      { name: 'Pixel 9 pro', image: '/images/GOOGLEPIXEL/googlepixel9proxl.avif' },
      { name: 'Pixel 8a', image: '/images/GOOGLEPIXEL/googlepixel8a.avif' },
      { name: 'Pixel 8', image: '/images/GOOGLEPIXEL/google-pixel-8.avif' },
      { name: 'Pixel 8 pro', image: '/images/GOOGLEPIXEL/GooglePixel8Pro.avif' },
      { name: 'Pixel 7', image: '/images/GOOGLEPIXEL/googlepixel7.avif' },
      { name: 'Pixel 7 Pro', image: '/images/GOOGLEPIXEL/GooglePixel7Pro.avif' },
      { name: 'Pixel 7a', image: '/images/GOOGLEPIXEL/googlepixel7a.avif' },
      { name: 'Pixel 6 pro', image: '/images/GOOGLEPIXEL/GooglePixel6Pro.avif' },
      { name: 'Pixel 6a', image: '/images/GOOGLEPIXEL/GooglePixel6a.avif' },
      { name: 'Pixel 6', image: '/images/GOOGLEPIXEL/googlepixel6.avif' },
      { name: 'Pixel 5a', image: '/images/GOOGLEPIXEL/googlepixel5a.avif' },
      { name: 'Pixel 5', image: '/images/GOOGLEPIXEL/googlepixel5.avif' },
      { name: 'Pixel 4a', image: '/images/GOOGLEPIXEL/googlepixel4A.avif' },
      { name: 'Pixel 4a 5g', image: '/images/GOOGLEPIXEL/googlepixel4a5gnew.avif' },
      // { name: 'Pixel 4 5g', image: '' }, // Commented out
      { name: 'Pixel 4 xl', image: '/images/GOOGLEPIXEL/pixel4xl.avif' },
      { name: 'Pixel 4', image: '/images/GOOGLEPIXEL/pixel4.avif' },
      { name: 'Pixel 3a xl', image: '/images/GOOGLEPIXEL/GOOGLEPIXEL3AXL.avif' },
      { name: 'Pixel 3a', image: '/images/GOOGLEPIXEL/pixel3.avif' },
      { name: 'Pixel 3 xl', image: '/images/GOOGLEPIXEL/GOOGLEPIXEL3AXL.avif' },
      { name: 'Pixel 3', image: '/images/GOOGLEPIXEL/pixel3.avif' },
      { name: 'Pixel 2 xl', image: '/images/GOOGLEPIXEL/GOOGLEPIXEL2XL.avif' },
      { name: 'Pixel 2', image: '/images/GOOGLEPIXEL/GOOGLEPIXEL2.avif' },
      { name: 'Pixel 9', image: '/images/GOOGLEPIXEL/googlepixel9.avif' },
    ],
    oneplus: [
      { name: 'Nord 5g', image: '/images/ONEPLUS/ONEPLUSNORD5G.avif' },
      { name: '8 pro', image: '/images/ONEPLUS/ONEPLUS8PRO.avif' },
      // { name: '8t', image: '' }, // Commented out
      { name: '8', image: '/images/ONEPLUS/ONEPLUS8.avif' },
      { name: '7t pro 5g', image: '/images/ONEPLUS/ONEPLUS7RPO5G.avif' },
      { name: '7t', image: '/images/ONEPLUS/ONEPLUS7T.avif' },
      { name: '7 pro', image: '/images/ONEPLUS/ONEPLUS7PRO.avif' },
      { name: '7', image: '/images/ONEPLUS/ONEPLUS7.avif' },
      // { name: '6t Mclaren', image: '' }, // Commented out
      { name: '6t', image: '/images/ONEPLUS/ONEPLUS6T.avif' },
      { name: '6', image: '/images/ONEPLUS/ONEPLUS6.avif' },
      { name: '5t', image: '/images/ONEPLUS/ONEPLUS5T.avif' },
      { name: '5', image: '/images/ONEPLUS/ONEPLUS5.avif' },
      { name: '3t', image: '/images/ONEPLUS/ONEPLUS3T.avif' },
      { name: '3', image: '/images/ONEPLUS/ONEPLUS3.avif' },
      { name: 'Nord', image: '/images/ONEPLUS/ONEPLUSNORD.avif' },
      { name: 'Nord n10 5g', image: '/images/ONEPLUS/ONEPLUSNORDN105G.avif' },
      { name: 'one', image: '/images/ONEPLUS/ONEPLUS.avif' },
    ],
    huawei: [
      { name: 'Honor 200 Pro', image: '/images/HUAWEI/HUAWEI/hono200pro.avif' },
      { name: 'Honor 200 Smart', image: '/images/HUAWEI/HUAWEI/honor200smart.avif' },
      { name: 'Honor 200 Lite', image: '/images/HUAWEI/HUAWEI/honor200lite.avif' },
      { name: 'Honor 90', image: '/images/HUAWEI/HUAWEI/honor90.avif' },
      { name: 'Magic 6 Lite', image: '/images/HUAWEI/HUAWEI/magic6lite.avif' },
      { name: 'Magic 5 Lite', image: '/images/HUAWEI/HUAWEI/magic-5-lite.avif' },
      { name: 'P30 Pro', image: '/images/HUAWEI/HUAWEI/huaweip30pro.avif' },
      { name: 'Honor 90 Lite', image: '/images/HUAWEI/HUAWEI/honor90lite.avif' },
      { name: 'Honor 9x', image: '/images/HUAWEI/HUAWEI/honor9x.avif' },
      { name: 'P30', image: '/images/HUAWEI/HUAWEI/huaweip30.avif' },
      { name: 'P30 Lite', image: '/images/HUAWEI/HUAWEI/huaweip30lite.avif' },
      // { name: 'Mate 20 Pro', image: '' }, // Commented out
      { name: 'Mate 20', image: '/images/HUAWEI/HUAWEI/huaweimate20.avif' },
      { name: 'P20 Pro', image: '/images/HUAWEI/HUAWEI/huaweip20pro.avif' },
      { name: 'P20 Lite', image: '/images/HUAWEI/HUAWEI/huaweip20lite.avif' },
      { name: 'P20', image: '/images/HUAWEI/HUAWEI/huaweip20.avif' },
      { name: 'Y6', image: '/images/HUAWEI/HUAWEI/huaweiy6.avif' },
      { name: 'Honor x8', image: '/images/HUAWEI/HUAWEI/honorx8.avif' },
      // { name: 'P Smart (2018)', image: '' }, // Commented out
      { name: 'Y61', image: '/images/HUAWEI/HUAWEI/huaweiy61.avif' },
      // { name: 'P Smart (2019)', image: '' }, // Commented out
      { name: 'Y9s', image: '/images/HUAWEI/HUAWEI/huaweiy9s.avif' },
      { name: 'Y9a', image: '/images/HUAWEI/HUAWEI/huaweiy9a.avif' },
      { name: 'Y70', image: '/images/HUAWEI/HUAWEI/huaweiy70.avif' },
      // { name: 'P Smart (2020)', image: '' }, // Commented out
      // { name: 'Honor X7A', image: '' }, // Commented out
      // { name: 'Honor X6A', image: '' }, // Commented out
      // { name: 'Honor X6B', image: '' }, // Commented out
      { name: 'Honor X8', image: '/images/HUAWEI/HUAWEI/honorx8.avif' },
      // { name: 'Honor X7B', image: '' }, // Commented out
      { name: 'Y9', image: '/images/HUAWEI/HUAWEI/huaweiy9.avif' },
      // { name: 'Honor Nova 9se', image: '' }, // Commented out
      { name: 'Honor 10', image: '/images/HUAWEI/HUAWEI/honor10.avif' },
      { name: 'Honor Y7A', image: '/images/HUAWEI/HUAWEI/huaweiy7a.avif' },
      // { name: 'Honor Y8A', image: '' }, // Commented out
      { name: 'Honor x9', image: '/images/HUAWEI/HUAWEI/honorx9.avif' },
      // { name: 'Honor Y60', image: '' }, // Commented out
      { name: 'Honor 9x Pro', image: '/images/HUAWEI/HUAWEI/honor9x.avif' },
      { name: 'Honor 7B', image: '/images/HUAWEI/HUAWEI/honor7b.avif' },
      { name: 'P50 Pro', image: '/images/HUAWEI/HUAWEI/huaweip50pro.avif' },
      { name: 'P60 Pro', image: '/images/HUAWEI/HUAWEI/huaweip60pro.avif' },
      { name: 'Honor 10 Lite', image: '/images/HUAWEI/HUAWEI/honor10lite.avif' },
      { name: 'Honor 8X', image: '/images/HUAWEI/HUAWEI/honor8x.avif' },
      { name: 'Huawei X9a', image: '/images/HUAWEI/HUAWEI/honorx9c.avif' },
      { name: 'Y70 Lite', image: '/images/HUAWEI/HUAWEI/huaweiy70lite.avif' },
    ],
    oppo: [
      { name: 'A96', image: '/images/oppo/oppoa96.avif' },
      { name: 'A94 4g', image: '/images/oppo/oppoa944g.avif' },
      { name: 'A77 5g', image: '/images/oppo/oppoa775g.avif' },
      { name: 'A76', image: '/images/oppo/oppoa76.avif' },
      { name: 'A74 5g', image: '/images/oppo/oppoa745g.avif' },
      { name: 'A74 4g', image: '/images/oppo/oppoa744gorignal.avif' },
      { name: 'A73 5g', image: '/images/oppo/oppoa735g.avif' },
      { name: 'A59', image: '/images/oppo/oppoa59.avif' },
      // { name: 'Realme 8 5g', image: '' }, // Commented out
      { name: 'A72', image: '/images/oppo/oppoa72.avif' },
      { name: 'A53', image: '/images/oppo/oppoa53v2.avif' },
      // { name: 'AX7', image: '' }, // Commented out
      { name: 'AX7 Pro', image: '/images/oppo/OppoAX7Pro.avif' },
      { name: 'A73', image: '/images/oppo/a73.jpg' },
      { name: 'A71', image: '/images/oppo/a71.webp' },
      { name: 'A41', image: '/images/oppo/a41.jpg' },
      { name: 'A40', image: '/images/oppo/a40.jpg' },
      { name: 'A51 5G', image: '/images/oppo/a51.jpg' },
    ],
    xiaomi: [
      { name: 'Note 13 4G', image: '/images/redmi/redmi/redmenote134g.avif' },
      { name: 'Note 13 5G', image: '/images/redmi/redmi/redmenote135g.avif' },
      { name: 'Note 10 s', image: '/images/redmi/redmi/redmenote10s.avif' },
      // { name: 'Note 12 pro 4G', image: '' }, // Commented out
      { name: 'Note 11 pro', image: '/images/redmi/redmi/redmmenote11pro.avif' },
      { name: 'Note 9', image: '/images/redmi/redmi/redminote9.avif' },
      { name: 'Note 8', image: '/images/redmi/redmi/xiominote8.avif' },
      { name: 'Note 7', image: '/images/redmi/redmi/redminote7.avif' },
      { name: 'Note 11', image: '/images/redmi/redmi/redminote11.avif' },
      { name: 'Note 11S', image: '/images/redmi/redmi/redminote11s.avif' },
      { name: 'Note 10 pro 4g', image: '/images/redmi/redmi/redminote10pro4g.avif' },
    ],
    motorola: [
      { name: 'Motorola G34', image: '/images/MOTROLA/MOTOG34.avif' },
      { name: 'Motorola G62', image: '/images/MOTROLA/MOTOG62.avif' },
      { name: 'Motorola G04', image: '/images/MOTROLA/MOTOG04.avif' },
      { name: 'Motorola G84', image: '/images/MOTROLA/MOTOG84.avif' },
      { name: 'Motorola G 5g (2024)', image: '/images/MOTROLA/MOTOG5G2024.avif' },
      { name: 'Motorola G54', image: '/images/MOTROLA/MOTOG54.avif' },
      { name: 'Motorola e20', image: '/images/MOTROLA/MOTOE20.avif' },
      // { name: 'Motorola G30', image: '' }, // Commented out
      { name: 'Motorola E40', image: '/images/MOTROLA/MOTOE40.avif' },
      { name: 'Motorola G7', image: '/images/MOTROLA/MOTOG7.avif' },
      { name: 'Motorola G7 plus', image: '/images/MOTROLA/MOTOG7PLUS.avif' },
      { name: 'Motorola G8', image: '/images/MOTROLA/MOTOG8.avif' },
      { name: 'Motorola G8 play', image: '/images/MOTROLA/MOTOG8PLAY.avif' },
      // { name: 'Motorola G8 plus', image: '' }, // Commented out
      // { name: 'Motorola G8 power', image: '' }, // Commented out
      { name: 'Motorola G9', image: '/images/MOTROLA/MOTOG9.avif' },
      { name: 'Motorola G9 play', image: '/images/MOTROLA/motog9play.avif' },
      { name: 'Motorola G9 plus', image: '/images/MOTROLA/motog9plus.avif' },
      // { name: 'Motorola G9 power', image: '' }, // Commented out
      // { name: 'Motorola C', image: '' }, // Commented out
      // { name: 'Motorola E5', image: '' }, // Commented out
      // { name: 'Motorola E5 play', image: '' }, // Commented out
      // { name: 'Motorola E5 go', image: '' }, // Commented out
      { name: 'Motorola E6', image: '/images/MOTROLA/MOTOE6.avif' },
      { name: 'Motorola E6 plus', image: '/images/MOTROLA/MOTOE6.avif' },
      // { name: 'Motorola E6s', image: '' }, // Commented out
      // { name: 'Motorola E7', image: '' }, // Commented out
      // { name: 'Motorola E7 plus', image: '' }, // Commented out
      // { name: 'Motorola E7 i', image: '' }, // Commented out
      // { name: 'Motorola G10', image: '' }, // Commented out
      // { name: 'Motorola G100', image: '' }, // Commented out
      // { name: 'Motorola G50', image: '' }, // Commented out
      // { name: 'Motorola G6 play', image: '' }, // Commented out
      // { name: 'Motorola G7 play', image: '' }, // Commented out
      { name: 'Motorola E13', image: '/images/MOTROLA/MOTOE13.avif' },
      // { name: 'Motorola E22', image: '' }, // Commented out
      // { name: 'Motorola G22', image: '' }, // Commented out
      // { name: 'Motorola G42', image: '' }, // Commented out
      // { name: 'Motorola G52', image: '' }, // Commented out
      // { name: 'Motorola G53', image: '' }, // Commented out
      // { name: 'Motorola G200', image: '' }, // Commented out
      // { name: 'Motorola G70', image: '' }, // Commented out
      // { name: 'Motorola G60 s', image: '' }, // Commented out
      // { name: 'Motorola G5 plus', image: '' }, // Commented out
      // { name: 'Motorola G 5g plus', image: '' }, // Commented out
      { name: 'Motorola E14', image: '/images/MOTROLA/MOTOE14.avif' },
      { name: 'Motorola G35', image: '/images/MOTROLA/motog35.avif' },
    ],
    nokia: [
      { name: 'Nokia 8.1', image: '/images/NOKIA/nokia8.1.avif' },
      { name: 'Nokia 7.2', image: '/images/NOKIA/nokia7.2.avif' },
      { name: 'Nokia 7.1', image: '/images/NOKIA/nokia7.1.avif' },
      // { name: 'Nokia 7', image: '' }, // Commented out
      { name: 'Nokia 6.2', image: '/images/NOKIA/nokia6.2.avif' },
      { name: 'Nokia 6.1', image: '/images/NOKIA/nokia6.1.avif' },
      // { name: 'Nokia 6', image: '' }, // Commented out
      { name: 'Nokia 5.4', image: '/images/NOKIA/nokia5.4.avif' },
      { name: 'Nokia 5.1 plus', image: '/images/NOKIA/nokia5.1plusnew.avif' },
      { name: 'Nokia 5.1', image: '/images/NOKIA/nokia5.1.avif' },
      // { name: 'Nokia 5', image: '' }, // Commented out
      { name: 'Nokia 4.2', image: '/images/NOKIA/nokia4.2.avif' },
      { name: 'Nokia 3.4', image: '/images/NOKIA/nokia3.4.avif' },
      { name: 'Nokia 3.2', image: '/images/NOKIA/nokia3.2.avif' },
      { name: 'Nokia 3.1 plus', image: '/images/NOKIA/nokia3.1plus.avif' },
      { name: 'Nokia 3', image: '/images/NOKIA/nokia3.avif' },
      // { name: 'Nokia 2.4', image: '/images/NOKIA/nokia2.4.avif' }, // Commented out
      { name: 'Nokia 2.3', image: '/images/NOKIA/nokia2.3new.avif' },
      { name: 'Nokia 2.2', image: '/images/NOKIA/nokia2.2.avif' },
      { name: 'Nokia 2', image: '/images/NOKIA/nokia2.avif' },
      // { name: 'Nokia 1', image: '' }, // Commented out
      { name: 'Nokia x7', image: '/images/NOKIA/NOKIAX7.avif' },
      { name: 'Nokia x6', image: '/images/NOKIA/nokiax6.avif' },
      { name: 'Nokia x20', image: '/images/NOKIA/NOKIAX20.avif' },
      { name: 'Nokia G50', image: '/images/NOKIA/NOKIAG50.avif' },
      { name: 'Nokia G22', image: '/images/NOKIA/NOKIAG22.avif' },
      { name: 'Nokia G21', image: '/images/NOKIA/NOKIAG21.avif' },
      { name: 'Nokia G10', image: '/images/NOKIA/NOKIAG10.avif' },
      { name: 'Nokia C30', image: '/images/NOKIA/NOKIAC30.avif' },
      { name: 'Nokia C21 plus', image: '/images/NOKIA/NOKIAC21PLUS.avif' },
      { name: 'Nokia C01 plus', image: '/images/NOKIA/NOKIAC01PLUS.avif' },
      { name: 'Nokia C22', image: '/images/NOKIA/NOKIAC22.avif' },
      { name: 'Nokia C32', image: '/images/NOKIA/NOKIAC32.avif' },
    ],
  };
  
  const tabletData = {
    ipad: [
      { name: "IPad 3th Gen (A1430, A1416, A1403)", image: '/images/tablet/ipad3rdgen.jpeg' },
      { name: "IPad 4th Gen (A1460, A1459, A1458)", image: '/images/tablet/ipad4thgen.jpg' },
      { name: "IPad 5th Gen", image: '/images/tablet/ipad5thgen.webp' },
      { name: "IPad 6th Gen (A1893-A1954)", image: '/images/tablet/ipad6thgen.jpg' },
      { name: "IPad 7th Gen", image: '/images/tablet/ipad7thgen.webp' },
      { name: "IPad 8th Gen (A2270, A2428, A2429, A2430)", image: '/images/tablet/ipad8thgen.webp' },
      { name: "IPad 9th Gen (A2602, A2604, A2603)", image: '/images/tablet/ipad9thgen.webp' },
      { name: "IPad 10th Gen (A2696-A2757-A2777)", image: '/images/tablet/ipad10thgen.webp' },
      { name: "IPad Pro 9.7 (A1673-A1674-A1675)", image: '/images/tablet/ipadpro9.7.jpg' },
      { name: "IPad Pro 10.5 (A1701 – A1709)", image: '/images/tablet/ipadpro10.5.jpg' },
      { name: "IPad Pro 11", image: '/images/tablet/ipadpro11.jpg' },
      { name: "IPad Pro 11 2nd Gen (A2228-A2068-A2230)", image: '/images/tablet/ipadpro112ndgen.webp' },
      { name: "IPad 12.9 1ST Gen (A1584, A1652)", image: '/images/tablet/ipadpro12.91stgen.jpg' },
      { name: "IPad Pro 12.9 2nd Gen (A1670, A1671)", image: '/images/tablet/ipadpro12.92ndgen.webp' },
      { name: "IPad Pro 12.9 3rd Gen (A1876, A2014, A1895, A1983)", image: '/images/tablet/ipadpro12.93rdgen.jpg' },
      { name: "IPad Pro 12.9″ 4th Gen (A2229, A2069, A2232, A2233)", image: '/images/tablet/ipadpro12.94thgen.jpg' },
      { name: "IPad Pro 12.9 5th Gen (A2378-A2461-A2379-A2462)", image: '/images/tablet/ipadpro12.95thgen.jpg' },
      { name: "iPad Air 5th Gen (A2588, A2589, A2591)", image: '/images/tablet/ipadair5thgen.webp' },
      // { name: "iPad Air 4th Gen (A2316, A2324, A2325, A2072)", image: '' },
      // { name: "iPad Air 3rd Gen (A2152, A2153, A2123)", image: '' },
      { name: "iPad Air 2 (A1566, A1567)", image: '/images/tablet/ipadair2.webp' },
      { name: "iPad Air (A1474, A1475)", image: '/images/tablet/ipadair.png' },
      { name: "IPad Mini 6 (A1474-A1475-A1476)", image: '/images/tablet/ipadmini6.webp' },
      { name: "IPad Mini 5 (A2133-A2124-A2126)", image: '/images/tablet/ipadmini5.webp' },
      { name: "IPad Mini 4 (A1538-A1550)", image: '/images/tablet/ipadmini4.webp' },
      { name: "IPad Mini 3 (A1599, A1600)", image: '/images/tablet/ipadmini3.webp' },
      { name: "IPad Mini 1 & 2 (A1489, A1490, A1432, A1454)", image: '/images/tablet/ipadmini1.jpg' },
    ],
    samsung: [
      // { name: "Samsung Galaxy Tab S7", image: '' },
      // { name: "Samsung Tab A9 Plus", image: '' },
      { name: "Samsung Galaxy Tab A8", image: '/images/tablet/samsunggalaxya8.jpg' },
      { name: "Samsung Tab A7", image: '/images/tablet/samsunggalaxytaba7.webp' },
      { name: "Samsung Tab A7 Lite", image: '/images/tablet/samsunggalaxytaba7lite.webp' },
      { name: "SAMSUNG TAB A6 2019", image: '/images/tablet/samsunggalaxytaba6.jpg' },
      // { name: "SAMSUNG TAB A6 T285", image: '' },
      // { name: "SAMSUNG TAB A6 T295", image: '' },
      // { name: "SAMSUNG TAB A6 T585", image: '' },
      { name: "Samsung Tab S6 Lite", image: '/images/tablet/samsunggalaxytabs6.webp' },
    ],
  };
  
  const consoleBrandData = {
    xbox: [
      { name: 'Xbox One', image: '/images/consoles/xbox_one.avif' },
      { name: 'Xbox series', image: '/images/consoles/xbox_series.avif' },
    ],
    playstation: [
      { name: 'PlayStation 4', image: '/images/consoles/ps4.avif' },
      { name: 'PlayStation 5', image: '/images/consoles/ps5.avif' },
    ],
    nintendo: [
      { name: 'Nintendo Switch', image: '/images/consoles/nintendo_switch.avif' },
    ],
  };
  
  const watchData = {
    iwatch: [
      // { name: "IWATCH SERIES 10 (46MM)", image: "" },
      // { name: "IWATCH SERIES 10 (42MM)", image: "" },
      { name: "IWATCH SERIES ULTRA 2 2023 (49MM)", image: "/images/watches/iwatchseriesultra2202349mm.jpg" },
      { name: "IWATCH SERIES ULTRA 2022 (49MM)", image: "/images/watches/iwatchseriesultra202249mm.jpg" },
      { name: "IWATCH SERIES 8 (45MM) (First Instance)", image: "/images/watches/iwatchseries845mm.jpg" },
      { name: "IWATCH SERIES 9 (41MM)", image: "/images/watches/iwatchseries941mm.jpg" },
      { name: "IWATCH SERIES 8 (45MM) (Second Instance)", image: "/images/watches/iwatchseries845mm.jpg" },
      { name: "IWATCH SERIES 8 (41MM)", image: "/images/watches/iwatchseries841mm.jpg" },
      { name: "IWATCH SERIES SE (44MM) 2ND GEN 2022", image: "/images/watches/iwatchseriesse44mm.jpg" },
      { name: "IWATCH SERIES SE (40MM) 2ND GEN 2022", image: "/images/watches/iwatchseriesse.jpeg" },
      { name: "IWATCH SERIES 7 (44MM)", image: "/images/watches/iwatchseries744mm.webp" },
      // { name: "IWATCH SERIES 7 (41MM)", image: "" },
      // { name: "IWATCH SERIES SE (44MM) (1st Gen - 2020)", image: "" },
      // { name: "IWATCH SERIES SE (40MM) (1st Gen - 2020)", image: "" },
      { name: "IWATCH SERIES 6 (44MM)", image: "/images/watches/iwatchseries644mm.png" },
      // { name: "IWATCH SERIES 6 (40MM)", image: "" },
      { name: "IWATCH SERIES 5 (44MM)", image: "/images/watches/iwatchseries544mm.jpg" },
      { name: "IWATCH SERIES 4 (44MM)", image: "/images/watches/iwatchseries444mm.jpg" },
      // { name: 'IWATCH SERIES 4 (40MM)', image: '' },
      // { name: 'IWATCH SERIES 3 (42MM)', image: '' },
      // { name: 'IWATCH SERIES 3 (38MM)', image: '' },
      // { name: 'IWATCH SERIES 3 (42MM) GPS + CELLULAR', image: '' },
      // { name: 'IWATCH SERIES 3 38MM GPS + Cellular', image: '' },
      // { name: 'IWATCH SERIES 2 (42MM)', image: '' },
      // { name: 'IWATCH SERIES 2 (38MM)', image: '' },
      // { name: 'IWATCH SERIES 1 (42MM)', image: '' },
      // { name: 'IWATCH SERIES 1 (38MM)', image: '' },
    ],
    samsung: [
      { name: "Samsung Galaxy Watch 6 Classic (47mm)", image: "/images/watches/galaxywatch6classic47.webp" },
      { name: "Samsung Galaxy Watch 6 (44mm)", image: "/images/watches/galaxywatch644.webp" },
      { name: "Samsung Galaxy Watch 5 Pro", image: "/images/watches/galaxy-watch5-pro.webp" },
      { name: "Samsung Galaxy Watch 5", image: "/images/watches/galaxywatch5.webp" },
    ],
  };
  
  // --- Function to Generate Searchable Items ---
  const generateAllSearchableItems = () => {
    const items = [];
    const addedItems = new Set();
  
    const addItem = (item) => {
      // Create a composite key using type and name.
      const key = `${item.type}:${item.name}`;
      if (
        item.name &&
        typeof item.name === 'string' &&
        item.name.trim() !== '' &&
        !addedItems.has(key)
      ) {
        items.push(item);
        addedItems.add(key);
      }
    };
  
    // 1. Static Pages
    addItem({ name: 'Home', type: 'Page', url: '/' });
    addItem({ name: 'About Us', type: 'Page', url: '/about' });
    addItem({ name: 'Our Location', type: 'Page', url: '/location' });
    addItem({ name: 'Contact Us', type: 'Page', url: '/contact' });
    addItem({ name: 'Book a Repair', type: 'Page', url: '/booking' });
    addItem({ name: 'Terms & Conditions', type: 'Page', url: '/terms' });
    addItem({ name: 'Privacy Policy', type: 'Page', url: '/privacy' });
    addItem({ name: 'Complaints', type: 'Page', url: '/complain' });
  
    // 2. Brands/Categories Specific Links
    // NOTE: Adjusted URLs to match your router paths.
    const brandMappings = {
      iphone: { name: 'iPhone Repairs', url: '/phone/iphone', type: 'phone' },
      samsung_phone: { name: 'Samsung Phone Repairs', url: '/phone/samsung', type: 'phone' },
      pixel: { name: 'Google Pixel Repairs', url: '/phone/pixel', type: 'phone' },
      oneplus: { name: 'OnePlus Repairs', url: '/phone/oneplus', type: 'phone' },
      huawei: { name: 'Huawei Repairs', url: '/phone/huawei', type: 'phone' },
      xiaomi: { name: 'Xiaomi/Redmi Repairs', url: '/phone/xiaomi', type: 'phone' },
      motorola: { name: 'Motorola Repairs', url: '/phone/motorola', type: 'phone' },
      nokia: { name: 'Nokia Repairs', url: '/phone/nokia', type: 'phone' },
      oppo: { name: 'Oppo Repairs', url: '/phone/oppo', type: 'phone' },
      ipad: { name: 'iPad Repairs', url: '/tablet/ipad', type: 'tablet' },
      samsung_tablet: { name: 'Samsung Tablet Repairs', url: '/tablet/samsung', type: 'tablet' },
      iwatch: { name: 'Apple Watch Repairs', url: '/watch/iwatch', type: 'watch' },
      samsung_watch: { name: 'Samsung Watch Repairs', url: '/watch/samsung', type: 'watch' },
      xbox: { name: 'Xbox Repairs', url: '/console/xbox', type: 'console' },
      playstation: { name: 'PlayStation Repairs', url: '/console/playstation', type: 'console' },
      nintendo: { name: 'Nintendo Repairs', url: '/console/nintendo', type: 'console' },
    };
  
    for (const key in brandMappings) {
      addItem({ name: brandMappings[key].name, type: 'Brand', url: brandMappings[key].url });
    }
  
    // 3. Specific Phone Models
    for (const [brandKey, models] of Object.entries(phoneBrandData)) {
      const targetUrlBrand = getUrlParamForBrand(brandKey);
      if (Array.isArray(models)) {
        models.forEach((model) => {
          if (model && model.name && model.name.trim()) {
            addItem({
              name: model.name,
              type: 'Phone',
              brand: brandKey,
              url: `/phone/${targetUrlBrand}?openModal=${encodeURIComponent(model.name)}`,
            });
          }
        });
      }
    }
  
    // 4. Tablet Models
    for (const [brandKey, models] of Object.entries(tabletData)) {
      const targetUrlBrand = getUrlParamForBrand(brandKey);
      if (Array.isArray(models)) {
        models.forEach((model) => {
          if (model && model.name && model.name.trim()) {
            addItem({
              name: model.name,
              type: 'Tablet',
              brand: brandKey,
              url: `/tablet/${targetUrlBrand}?openModal=${encodeURIComponent(model.name)}`,
            });
          }
        });
      }
    }
  
    // 5. Console Models
    for (const [brandKey, models] of Object.entries(consoleBrandData)) {
      const targetUrlBrand = getUrlParamForBrand(brandKey);
      if (Array.isArray(models)) {
        models.forEach((model) => {
          if (model && model.name && model.name.trim()) {
            addItem({
              name: model.name,
              type: 'Console',
              brand: brandKey,
              url: `/console/${targetUrlBrand}?openModal=${encodeURIComponent(model.name)}`,
            });
          }
        });
      }
    }
  
    // 6. Watch Models
    for (const [brandKey, models] of Object.entries(watchData)) {
      const targetUrlBrand = getUrlParamForBrand(brandKey);
      if (Array.isArray(models)) {
        models.forEach((model) => {
          if (model && model.name && model.name.trim()) {
            addItem({
              name: model.name,
              type: 'Watch',
              brand: brandKey,
              url: `/watch/${targetUrlBrand}?openModal=${encodeURIComponent(model.name)}`,
            });
          }
        });
      }
    }
  
    console.log(`Generated ${items.length} unique searchable items.`);
    return items;
  };
  
  // Generate the list once outside the component render cycle.
  const allSearchableItems = generateAllSearchableItems();
  
  // --- Exporting the searchable items ---
  export { allSearchableItems };
  