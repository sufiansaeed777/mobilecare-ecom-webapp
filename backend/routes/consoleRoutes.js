// routes/consoleRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllConsoles, 
  createConsole, 
  getConsoleById, 
  updateConsole, 
  deleteConsole, 
  getConsoleRepairs 
} = require('../controllers/consoleController');

// GET all consoles
router.get('/', getAllConsoles);

// GET repairs for a console by brand and model
router.get('/repairs', getConsoleRepairs);

// (Optional) GET a single console by ID
router.get('/:id', getConsoleById);

// (Optional) CREATE a new console
router.post('/', createConsole);

// (Optional) UPDATE a console by ID
router.put('/:id', updateConsole);

// (Optional) DELETE a console by ID
router.delete('/:id', deleteConsole);

module.exports = router;