const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
  tankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tank',
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Measurement', MeasurementSchema);