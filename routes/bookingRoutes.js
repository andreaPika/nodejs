const express = require('express');
const Booking = require('../models/booking'); // Import the Booking model
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const Appointment = require('../models/appointment');

router.get('/company/:id/availability', authenticate, async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);
      res.json(company.availableDates);
    } catch (err) {
      res.status(500).json({ error: 'Errore nel recupero delle disponibilità aziendali.' });
    }
  });

  router.post('/', authenticate, async (req, res) => {
    try {
        console.log(req.body)
      const { userId, companyId, appointmentDateTime, details, title } = req.body;
      const appointments = new Appointment({
        user: userId,
        company: companyId,
        date: new Date(`${appointmentDateTime}`),
        details: details,
        title: title,
        status: 'pending'
      });
      await appointments.save();
      res.status(201).json({ message: 'Prenotazione inviata per approvazione.' });
    } catch (err) {
      res.status(500).json({ error: 'Errore nella creazione della prenotazione.' });
    }
  });

  router.post('/booking/:id/status', authenticate, async (req, res) => {
    try {
      const appointments = await Appointment.findById(req.params.id);
      const { status } = req.body;
      appointments.status = status;
      await appointments.save();
      res.json({ message: `Prenotazione ${status}` });
      
      // Notifica via email o WebSocket qui (opzionale)
    } catch (err) {
      res.status(500).json({ error: 'Errore nell\'aggiornamento dello stato della prenotazione.' });
    }
  });


    // Get appointments for a user
    router.get('/appointments/user/:userId', authenticate, async (req, res) => {
        try {
        const userId = req.params.userId;
        const appointments = await Appointment.find({ user: userId }).populate('company', 'name address phoneNumber');
        res.status(200).json(appointments);
        } catch (err) {
        res.status(500).json({ error: 'Errore durante il recupero degli appuntamenti per l\'utente.' });
        }
    });

    // Get appointments for a company
    router.get('/appointments/company/:companyId', authenticate, async (req, res) => {
        try {
        const companyId = req.params.companyId;

        const appointments = await Appointment.find({ company: companyId }).populate('user', 'firstName lastName');
        res.status(200).json(appointments);
        } catch (err) {
        res.status(500).json({ error: 'Errore durante il recupero degli appuntamenti per l\'azienda.' });
        }
    });

module.exports = router;