const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.1, 'Quantity must be at least 0.1 kg']
    },
    estimatedPrice: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }],
  pickupAddress: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true }
  },
  pickupDate: {
    type: Date,
    required: [true, 'Pickup date is required']
  },
  pickupTimeSlot: {
    type: String,
    required: [true, 'Pickup time slot is required'],
    enum: [
      '9:00 AM - 12:00 PM',
      '12:00 PM - 3:00 PM',
      '3:00 PM - 6:00 PM',
      '6:00 PM - 9:00 PM'
    ]
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  alternatePhone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: [500, 'Special instructions cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'assigned',
      'in_progress',
      'picked_up',
      'completed',
      'cancelled'
    ],
    default: 'pending'
  },
  totalEstimatedPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price cannot be negative']
  },
  actualWeight: {
    type: Number,
    min: [0, 'Actual weight cannot be negative']
  },
  actualPrice: {
    type: Number,
    min: [0, 'Actual price cannot be negative']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [{
    url: String,
    description: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'bank_transfer'],
    default: 'cash'
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Feedback comment cannot exceed 500 characters']
    },
    submittedAt: Date
  }
}, {
  timestamps: true
});

// Calculate total estimated price before saving
bookingSchema.pre('save', function(next) {
  if (this.services && this.services.length > 0) {
    this.totalEstimatedPrice = this.services.reduce((total, item) => {
      return total + item.estimatedPrice;
    }, 0);
  }
  next();
});

// Validate pickup date is not in the past
bookingSchema.pre('save', function(next) {
  if (this.pickupDate && this.pickupDate < new Date()) {
    next(new Error('Pickup date cannot be in the past'));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);