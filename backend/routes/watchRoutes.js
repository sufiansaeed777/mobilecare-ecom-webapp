// routes/watchRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllWatches, 
  createWatch, 
  getWatchById, 
  updateWatch, 
  deleteWatch, 
  getWatchRepairs 
} = require('../controllers/watchController');

// GET all watches
router.get('/', getAllWatches);

// GET repairs for a watch by brand and model
router.get('/repairs', getWatchRepairs);

// (Optional) GET a single watch by ID
router.get('/:id', getWatchById);

// (Optional) CREATE a new watch
router.post('/', createWatch);

// (Optional) UPDATE a watch by ID
router.put('/:id', updateWatch);

// (Optional) DELETE a watch by ID
router.delete('/:id', deleteWatch);

module.exports = router;