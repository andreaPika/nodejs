const express = require('express');
const Company = require('../models/company');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all companies
router.get('/', authenticate, async (req, res) => {
  try {
    const companies = await Company.find().populate('users');
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la ricerca delle aziende.' });
  }
});

// Get companies
router.get('/:id', authenticate, async (req, res) => {
  try {
    const companies = await Company.findById(req.params.id).populate('users');
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la ricerca delle aziende.'  });
  }
});

// Add a new company
router.post('/', authenticate, async (req, res) => {
  const { name, address, phoneNumber, services, availability,location } = req.body;

  try {
    const newCompany = new Company({ name, address, phoneNumber, services, availability,location });
    await newCompany.save();
    res.status(201).json({ message: 'Company created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating company' });
  }
});

// Endpoint per cercare aziende
router.get('/search/:query', authenticate, async (req, res) => {
  try {
    const companies = await Company.find({
      name: { $regex: req.params.query, $options: 'i' }, // Ricerca case-insensitive
    }).populate('users');
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Errore durante la ricerca delle aziende.' });
  }
});

module.exports = router;
