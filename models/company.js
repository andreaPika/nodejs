const mongoose = require('mongoose');

// Schema azienda
const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],// Gli utenti associati all'azienda
    // Dettagli aziendali per le ditte
  services: { type: [String] },  // Solo per ditte: servizi offerti
  availability: { type: [String] }, // Solo per ditte: orari di disponibilità

  // Indirizzo dell'utente
  address: {
    street: { type: String},
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },

  // Localizzazione (latitudine, longitudine)
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: {
      type: [Number],
    },
  }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
