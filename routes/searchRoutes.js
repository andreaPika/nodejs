const express = require('express');
const router = express.Router();
const Users = require('../models/user');
const { authenticate } = require('../middleware/authMiddleware');

// Endpoint con filtri
router.get('/ricerca', authenticate, async (req, res) => {
    const query = req.query.q || '';
    const firstName = req.query.nome || '';
    const lastName = req.query.cognome || '';
    const address = req.query.indirizzo || '';

    const filters = [];

    if (query) {
        filters.push({
            $or: [
                { firstName: { $regex: new RegExp(query, 'i') } },
                { lastName: { $regex: new RegExp(query, 'i') } },
            ],
        });
    }

    if (firstName) {
        filters.push({ firstName: { $regex: new RegExp(firstName, 'i') } });
    }

    if (lastName) {
        filters.push({ lastName: { $regex: new RegExp(lastName, 'i') } });
    }

    if (address) {
        filters.push({ address: { $regex: new RegExp(address, 'i') } });
    }

    try {
        const user = await Users.find(filters.length > 0 ? { $and: filters } : {});
        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
