const mongoose = require('mongoose');

const atecoSchema = new mongoose.Schema({
        codice: { type: String, required: true },
        descrizione: { type: String, required: true },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Ateco', atecoSchema);