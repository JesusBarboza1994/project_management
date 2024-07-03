const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String }, // Almacena el token JWT aquí
  tokenCreatedAt: { type: Date }, // Almacena la fecha de creación del token aquí
  tokenExpiresAt: { type: Date }, // Almacena la fecha de expiración del token aquí
  user_type: { 
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  collaborations:{ 
    type: [
      {
        project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
        permission: {
          type: String,
          enum: ['view', 'edit', 'admin', "owner"], // Puedes agregar más roles si es necesario
          default: 'view',
        },
        favorite: { type: Boolean, default: false }
      },
    ], 
    default: []
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
