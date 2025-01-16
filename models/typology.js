const mongoose = require('mongoose');

const typologySchema = new mongoose.Schema({
    codice: { type: String, required: true },
    descrizione: { type: String, required: true },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Typology', typologySchema);