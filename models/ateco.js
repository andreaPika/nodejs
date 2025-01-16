const mongoose = require('mongoose');

const atecoSchema = new mongoose.Schema({
        CODICE: { type: String, required: true },
        DESCRIZIONE: { type: String, required: true },
        TS_RECORD_INS: { type: Date, required: true },
  })
  
  module.exports = mongoose.model('Ateco', atecoSchema);