const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Service description is required']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: [
      'Paper & Cardboard',
      'Plastic',
      'Metal',
      'Glass',
      'Electronic Waste',
      'Organic Waste',
      'Textile',
      'Mixed Waste',
      'Bulk Pickup'
    ]
  },
  pricePerKg: {
    type: Number,
    required: [true, 'Price per kg is required'],
    min: [0, 'Price cannot be negative']
  },
  minimumQuantity: {
    type: Number,
    default: 1,
    min: [0, 'Minimum quantity cannot be negative']
  },
  maximumQuantity: {
    type: Number,
    default: 1000,
    min: [1, 'Maximum quantity must be at least 1']
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String,
    trim: true
  }],
  processingTime: {
    type: String,
    default: '24-48 hours'
  },
  availableAreas: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Validate that maximum quantity is greater than minimum quantity
serviceSchema.pre('save', function(next) {
  if (this.maximumQuantity <= this.minimumQuantity) {
    next(new Error('Maximum quantity must be greater than minimum quantity'));
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);