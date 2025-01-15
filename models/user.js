const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema utente
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    profilePicture: { type: String }, // URL o percorso immagine
    token: { type: String},
    role: {
      type: String,
      enum: ['professional', 'admin', 'client', 'company'],
      required: true,
    },
    roleCompany: {
      type: String,
      enum: ['manager', 'assistant', 'senior', 'junior'],
    },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // Se associato a un'azienda
  },
  { timestamps: true }
);

// Middleware per hash della password prima del salvataggio
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Metodo per comparare la password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
