const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Company = require('../models/company'); // Import the Company model
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrazione di un nuovo utente
 *     description: Crea un nuovo utente con ruolo specificato.
 *     parameters:
 *       - name: firstName
 *         in: body
 *         description: Nome dell'utente
 *         required: true
 *         type: string
 *       - name: lastName
 *         in: body
 *         description: Cognome dell'utente
 *         required: true
 *         type: string
 *       - name: email
 *         in: body
 *         description: Email dell'utente
 *         required: true
 *         type: string
 *       - name: password
 *         in: body
 *         description: Password dell'utente
 *         required: true
 *         type: string
 *       - name: role
 *         in: body
 *         description: Ruolo dell'utente (libero_professionista, azienda, utente_finale)
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Utente creato con successo
 *       400:
 *         description: Email già in uso
 *       500:
 *         description: Errore del server
 */
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role, companyId } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già in uso' });
    }

    // Check if the company exists
    const company = role === 'azienda' ? await Company.findById(companyId) : null;
    if (role === 'azienda' && !company) {
      return res.status(400).json({ message: 'Company not found' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      companyId: role === 'azienda' ? companyId : null,
    });

    await user.save();
   
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Add token to the user object
    user.token = token;

    // If role is 'azienda', add the user to the company's list of users
    if (role === 'azienda') {
      company.users.push(user._id);
      await company.save();
    }

    // Now send the response after all database operations are complete
    return res.status(201).json({ user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login dell'utente
 *     description: Autentica un utente con email e password.
 *     parameters:
 *       - name: email
 *         in: body
 *         description: Email dell'utente
 *         required: true
 *         type: string
 *       - name: password
 *         in: body
 *         description: Password dell'utente
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successo, il token JWT viene restituito
 *       400:
 *         description: Credenziali non valide
 *       500:
 *         description: Errore del server
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utente non trovato' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenziali non valide' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    user.token = token;
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cambiare la password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    // Trova l'utente
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    // Verifica la password corrente
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Password corrente errata' });
    }

    // Aggiorna la password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il cambio della password' });
  }
});

module.exports = router;
