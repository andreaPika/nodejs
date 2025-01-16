const mongoose = require('mongoose');

const companyBookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  phoneNumber: { type: String },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  availableDates: [{
    date: { type: Date, required: true },
    slots: [{ // gli orari disponibili per ogni data
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('CompanyBooking', companyBookingSchema);
