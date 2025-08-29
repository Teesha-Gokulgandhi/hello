const express = require('express');
const Service = require('../models/Service');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { uploadServiceImage, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/services
// @desc    Get all active services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'name_asc':
        sortOption.name = 1;
        break;
      case 'name_desc':
        sortOption.name = -1;
        break;
      case 'price_asc':
        sortOption.pricePerKg = 1;
        break;
      case 'price_desc':
        sortOption.pricePerKg = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const services = await Service.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Service.countDocuments(query);

    res.json({
      services,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        count: services.length,
        totalCount: total
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error while fetching services' });
  }
});

// @route   GET /api/services/categories
// @desc    Get all service categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category', { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (!service.isActive) {
      return res.status(404).json({ message: 'Service is no longer available' });
    }

    res.json({ service });
  } catch (error) {
    console.error('Get service error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.status(500).json({ message: 'Server error while fetching service' });
  }
});

// @route   POST /api/services
// @desc    Create a new service
// @access  Private (Admin only)
router.post('/', verifyToken, isAdmin, uploadServiceImage, handleUploadError, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      pricePerKg,
      minimumQuantity,
      maximumQuantity,
      features,
      processingTime,
      availableAreas
    } = req.body;

    const serviceData = {
      name,
      description,
      category,
      pricePerKg: parseFloat(pricePerKg),
      minimumQuantity: parseFloat(minimumQuantity) || 1,
      maximumQuantity: parseFloat(maximumQuantity) || 1000,
      processingTime: processingTime || '24-48 hours'
    };

    if (features) {
      serviceData.features = Array.isArray(features) ? features : JSON.parse(features);
    }

    if (availableAreas) {
      serviceData.availableAreas = Array.isArray(availableAreas) ? availableAreas : JSON.parse(availableAreas);
    }

    if (req.file) {
      serviceData.image = `/uploads/services/${req.file.filename}`;
    }

    const service = new Service(serviceData);
    await service.save();

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error while creating service' });
  }
});

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Private (Admin only)
router.put('/:id', verifyToken, isAdmin, uploadServiceImage, handleUploadError, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      pricePerKg,
      minimumQuantity,
      maximumQuantity,
      features,
      processingTime,
      availableAreas,
      isActive
    } = req.body;

    const updateData = {};
    
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (pricePerKg) updateData.pricePerKg = parseFloat(pricePerKg);
    if (minimumQuantity) updateData.minimumQuantity = parseFloat(minimumQuantity);
    if (maximumQuantity) updateData.maximumQuantity = parseFloat(maximumQuantity);
    if (processingTime) updateData.processingTime = processingTime;
    if (typeof isActive !== 'undefined') updateData.isActive = isActive;
    
    if (features) {
      updateData.features = Array.isArray(features) ? features : JSON.parse(features);
    }
    
    if (availableAreas) {
      updateData.availableAreas = Array.isArray(availableAreas) ? availableAreas : JSON.parse(availableAreas);
    }

    if (req.file) {
      updateData.image = `/uploads/services/${req.file.filename}`;
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error while updating service' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service (soft delete)
// @access  Private (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deactivated successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.status(500).json({ message: 'Server error while deleting service' });
  }
});

module.exports = router;