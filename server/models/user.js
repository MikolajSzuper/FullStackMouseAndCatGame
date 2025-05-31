const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: String,
  stats: {
    games: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 }
  }
})

module.exports = mongoose.model('User', userSchema)