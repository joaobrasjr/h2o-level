const mongoose = require('mongoose');

const TankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  maxCapacity: {
    type: Number,
    required: true
  },
  alertThreshold: {
    type: Number,
    default: 20
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tank', TankSchema);