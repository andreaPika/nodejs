const express = require('express');
const Company = require('../models/company');
const Ateco = require('../models/ateco');
const Typology = require('../models/typology');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all companies
router.get('/', authenticate, async (req, res) => {
  try {
    console.error('Handler /ateco chiamato');
    const companies = await Company.find().populate('users');
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la ricerca' });
  }
});

// Get companies
router.get('/:id', authenticate, async (req, res) => {
  try {
    const companies = await Company.findById(req.params.id).populate('users');
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la ricerca'  });
  }
});

// Add a new company
router.post('/', authenticate, async (req, res) => {
  const { name, address, phoneNumber, services, availability,location, typology, ateco } = req.body;

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

// Get all ateco
router.get('/ateco', authenticate, async (req, res) => {
  try {
    console.log('Richiesta ricevuta');
    const atecoCode = await Ateco.find();
    console.log('Risultati trovati:', atecoCode);
    res.status(200).json(atecoCode);
  } catch (error) {
    console.error('Errore durante la ricerca dei dati ateco:', error);
    res.status(500).json({ message: 'Errore durante la ricerca dei dati ateco.' });
  }
});

// Add ateco
router.post('/ateco', authenticate, async (req, res) => {
  const { codice, descrizione } = req.body;
  try {
    const newAteco = new Ateco({ codice, descrizione });
    await newAteco.save();
    res.status(201).json({ message: 'Ateco created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating ateco' });
  }
});

// Get all typology
router.get('/typology', authenticate, async (req, res) => {
  try {
    const typologyCompany = await Typology.find();
    res.status(200).json(typologyCompany);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la ricerca delle tipologie.' });
  }
});

// Add tipology
router.post('/typology', authenticate, async (req, res) => {
  const { codice, descrizione } = req.body;

  try {
    const newAteco = new Typology({ codice, descrizione });
    await newAteco.save();
    res.status(201).json({ message: 'Ateco created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating ateco' });
  }
});

module.exports = router;
