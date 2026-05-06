const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  rent: {
    type: Number,
    required: true
  },
  amenities: [String],
  ownerContact: {
    type: String,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema);
