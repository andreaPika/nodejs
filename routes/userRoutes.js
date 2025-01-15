const express = require('express');
const User = require('../models/user');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all users
router.get('/', authenticate, async (req, res) => {
  try {
    const users = await User.find().populate('companyId');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Aggiorna il profilo dell'utente autenticato
router.put('/', authenticate, async (req, res) => {
  const { firstName, lastName, email,role, companyId, phoneNumber, address, dateOfBirth, gender } = req.body;
console.log(req.body);
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    // Aggiorna i campi
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (companyId) user.companyId = companyId;

    await user.save();
    res.json({ message: 'Profilo aggiornato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore del server' });
  }
});

module.exports = router;
