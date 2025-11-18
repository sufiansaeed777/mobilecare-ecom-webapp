// routes/tabletRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllTablets, 
  createTablet, 
  getTabletById, 
  updateTablet, 
  deleteTablet, 
  getTabletRepairs 
} = require('../controllers/tabletController');

// GET all tablets
router.get('/', getAllTablets);

// GET repairs for a tablet by brand and model
router.get('/repairs', getTabletRepairs);

// (Optional) GET a single tablet by ID
router.get('/:id', getTabletById);

// (Optional) CREATE a new tablet
router.post('/', createTablet);

// (Optional) UPDATE a tablet by ID
router.put('/:id', updateTablet);

// (Optional) DELETE a tablet by ID
router.delete('/:id', deleteTablet);

module.exports = router;