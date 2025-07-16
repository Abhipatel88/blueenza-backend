const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  companyName: {
    type: String
  },
  product: {
    type: String
  },
  quantity: {
    type: String
  },
  additionalRequirements: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);