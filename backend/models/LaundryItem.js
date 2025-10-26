const mongoose = require('mongoose');

const laundryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['shirt', 'pants', 'saree', 'bedsheet', 'towel', 'jacket']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['clothing', 'bedding', 'accessories'],
    required: true
  },
  processingTime: {
    type: Number, // in hours
    default: 24
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LaundryItem', laundryItemSchema);