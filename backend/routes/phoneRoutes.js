// routes/phoneRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllPhones,
  insertPhones,
  getPhoneById,
  updatePhone,
  deletePhone,
  getPhoneRepairs,
} = require('../controllers/phoneController');

// GET all phones
router.get('/', getAllPhones);

// POST batch insert phones
router.post('/batchInsert', insertPhones);

// GET repairs for a phone by brand and model
router.get('/repairs', getPhoneRepairs);

// (Optional) GET a single phone by ID
router.get('/:id', getPhoneById);

// (Optional) UPDATE a phone by ID
router.put('/:id', updatePhone);

// (Optional) DELETE a phone by ID
router.delete('/:id', deletePhone);

module.exports = router;
