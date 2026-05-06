const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  role: {
    type: String,
    enum: ['STUDENT', 'OWNER'],
    default: 'STUDENT'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
