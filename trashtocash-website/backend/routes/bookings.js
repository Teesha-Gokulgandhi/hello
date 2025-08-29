const express = require('express');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { uploadBookingImages, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      services,
      pickupAddress,
      pickupDate,
      pickupTimeSlot,
      contactPhone,
      alternatePhone,
      specialInstructions
    } = req.body;

    // Validate services and calculate prices
    const bookingServices = [];
    let totalEstimatedPrice = 0;

    for (const item of services) {
      const service = await Service.findById(item.serviceId);
      if (!service || !service.isActive) {
        return res.status(400).json({ 
          message: `Service not found or inactive: ${item.serviceId}` 
        });
      }

      if (item.quantity < service.minimumQuantity) {
        return res.status(400).json({ 
          message: `Minimum quantity for ${service.name} is ${service.minimumQuantity} kg` 
        });
      }

      if (item.quantity > service.maximumQuantity) {
        return res.status(400).json({ 
          message: `Maximum quantity for ${service.name} is ${service.maximumQuantity} kg` 
        });
      }

      const estimatedPrice = item.quantity * service.pricePerKg;
      totalEstimatedPrice += estimatedPrice;

      bookingServices.push({
        service: service._id,
        quantity: item.quantity,
        estimatedPrice
      });
    }

    // Validate pickup date
    const selectedDate = new Date(pickupDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      return res.status(400).json({ 
        message: 'Pickup date must be at least tomorrow' 
      });
    }

    const booking = new Booking({
      user: req.user.id,
      services: bookingServices,
      pickupAddress,
      pickupDate: selectedDate,
      pickupTimeSlot,
      contactPhone,
      alternatePhone,
      specialInstructions,
      totalEstimatedPrice
    });

    await booking.save();
    await booking.populate('services.service user');

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error while creating booking' });
  }
});

// @route   GET /api/bookings
// @desc    Get user bookings (or all bookings for admin)
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, startDate, endDate } = req.query;
    
    // Build query
    let query = {};
    
    // Non-admin users can only see their own bookings
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query.pickupDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(query)
      .populate('services.service', 'name category pricePerKg')
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        count: bookings.length,
        totalCount: total
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Non-admin users can only see their own bookings
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const booking = await Booking.findOne(query)
      .populate('services.service', 'name category pricePerKg image')
      .populate('user', 'firstName lastName email phone address')
      .populate('assignedTo', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(500).json({ message: 'Server error while fetching booking' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin only)
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, assignedTo, actualWeight, actualPrice } = req.body;

    const updateData = { status };
    
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (actualWeight) updateData.actualWeight = parseFloat(actualWeight);
    if (actualPrice) updateData.actualPrice = parseFloat(actualPrice);

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('services.service user assignedTo');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(500).json({ message: 'Server error while updating booking status' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Non-admin users can only cancel their own bookings
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const booking = await Booking.findOne(query);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking can be cancelled
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ 
        message: 'Cannot cancel a booking that is already completed or cancelled' 
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(500).json({ message: 'Server error while cancelling booking' });
  }
});

// @route   POST /api/bookings/:id/feedback
// @desc    Add feedback to booking
// @access  Private
router.post('/:id/feedback', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    let query = { _id: req.params.id };
    
    // Non-admin users can only add feedback to their own bookings
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const booking = await Booking.findOne(query);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ 
        message: 'Feedback can only be added to completed bookings' 
      });
    }

    if (booking.feedback && booking.feedback.rating) {
      return res.status(400).json({ 
        message: 'Feedback has already been submitted for this booking' 
      });
    }

    booking.feedback = {
      rating,
      comment,
      submittedAt: new Date()
    };

    await booking.save();

    res.json({
      message: 'Feedback submitted successfully',
      booking
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(500).json({ message: 'Server error while adding feedback' });
  }
});

// @route   POST /api/bookings/:id/images
// @desc    Upload images for booking
// @access  Private
router.post('/:id/images', verifyToken, uploadBookingImages, handleUploadError, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Non-admin users can only upload images to their own bookings
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const booking = await Booking.findOne(query);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Add new images
    const newImages = req.files.map(file => ({
      url: `/uploads/bookings/${file.filename}`,
      description: req.body.description || '',
      uploadedAt: new Date()
    }));

    booking.images.push(...newImages);
    await booking.save();

    res.json({
      message: 'Images uploaded successfully',
      images: newImages
    });
  } catch (error) {
    console.error('Upload images error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(500).json({ message: 'Server error while uploading images' });
  }
});

module.exports = router;