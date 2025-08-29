const express = require('express');
const Contact = require('../models/Contact');
const { verifyToken, isAdmin, optionalAuth } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const router = express.Router();

// Email configuration
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { name, email, phone, subject, message, category } = req.body;

    // Create contact entry
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      category: category || 'General Inquiry'
    });

    await contact.save();

    // Send confirmation email to user
    try {
      const transporter = createEmailTransporter();
      
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting TrashToCash',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Thank You for Contacting Us!</h2>
            <p>Dear ${name},</p>
            <p>We have received your message and will get back to you within 24 hours.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3>Your Message Details:</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Category:</strong> ${category || 'General Inquiry'}</p>
              <p><strong>Message:</strong> ${message}</p>
            </div>
            
            <p>If you have any urgent queries, please call us at <strong>+91-XXXXXXXXXX</strong></p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 14px;">
                Best regards,<br>
                TrashToCash Team<br>
                Email: info@trashtocash.co.in<br>
                Website: www.trashtocash.co.in
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(userMailOptions);

      // Send notification to admin
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission - ${category || 'General Inquiry'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff6b35;">New Contact Form Submission</h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Category:</strong> ${category || 'General Inquiry'}</p>
              <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-radius: 5px;">
              <h4>Message:</h4>
              <p>${message}</p>
            </div>
            
            <p style="margin-top: 20px;">
              <strong>Contact ID:</strong> ${contact._id}
            </p>
          </div>
        `
      };

      await transporter.sendMail(adminMailOptions);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Thank you for your message. We will get back to you soon!',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error while submitting contact form' });
  }
});

// @route   GET /api/contact
// @desc    Get all contact submissions
// @access  Private (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { 
      status, 
      category, 
      priority, 
      search, 
      page = 1, 
      limit = 10,
      startDate,
      endDate
    } = req.query;
    
    // Build query
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const contacts = await Contact.find(query)
      .populate('assignedTo', 'firstName lastName email')
      .populate('response.respondedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Contact.countDocuments(query);

    // Mark as read if getting for first time
    const unreadIds = contacts.filter(c => !c.isRead).map(c => c._id);
    if (unreadIds.length > 0) {
      await Contact.updateMany(
        { _id: { $in: unreadIds } },
        { isRead: true }
      );
    }

    res.json({
      contacts,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        count: contacts.length,
        totalCount: total
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error while fetching contacts' });
  }
});

// @route   GET /api/contact/:id
// @desc    Get contact by ID
// @access  Private (Admin only)
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('response.respondedBy', 'firstName lastName email');

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Mark as read
    if (!contact.isRead) {
      contact.isRead = true;
      await contact.save();
    }

    res.json({ contact });
  } catch (error) {
    console.error('Get contact error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(500).json({ message: 'Server error while fetching contact' });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact status
// @access  Private (Admin only)
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'firstName lastName email');

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({
      message: 'Contact status updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(500).json({ message: 'Server error while updating contact status' });
  }
});

// @route   POST /api/contact/:id/respond
// @desc    Respond to contact inquiry
// @access  Private (Admin only)
router.post('/:id/respond', verifyToken, isAdmin, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Response message is required' });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Update contact with response
    contact.response = {
      message,
      respondedBy: req.user.id,
      respondedAt: new Date()
    };
    contact.status = 'resolved';
    
    await contact.save();
    await contact.populate('response.respondedBy', 'firstName lastName email');

    // Send response email to user
    try {
      const transporter = createEmailTransporter();
      
      const responseMailOptions = {
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: `Re: ${contact.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Response to Your Inquiry</h2>
            <p>Dear ${contact.name},</p>
            <p>Thank you for contacting TrashToCash. Here is our response to your inquiry:</p>
            
            <div style="background-color: #f0f8ff; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #4CAF50;">
              <h4>Your Original Message:</h4>
              <p><strong>Subject:</strong> ${contact.subject}</p>
              <p>${contact.message}</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h4 style="color: #4CAF50;">Our Response:</h4>
              <p>${message}</p>
            </div>
            
            <p>If you have any further questions, please don't hesitate to contact us.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 14px;">
                Best regards,<br>
                TrashToCash Team<br>
                Email: info@trashtocash.co.in<br>
                Phone: +91-XXXXXXXXXX<br>
                Website: www.trashtocash.co.in
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(responseMailOptions);
    } catch (emailError) {
      console.error('Response email sending error:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      message: 'Response sent successfully',
      contact
    });
  } catch (error) {
    console.error('Respond to contact error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(500).json({ message: 'Server error while responding to contact' });
  }
});

// @route   GET /api/contact/stats/dashboard
// @desc    Get contact statistics for dashboard
// @access  Private (Admin only)
router.get('/stats/dashboard', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const resolvedContacts = await Contact.countDocuments({ status: 'resolved' });
    const inProgressContacts = await Contact.countDocuments({ status: 'in_progress' });

    // Get recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject category createdAt status');

    // Get category distribution
    const categoryStats = await Contact.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      stats: {
        total: totalContacts,
        new: newContacts,
        resolved: resolvedContacts,
        inProgress: inProgressContacts
      },
      recentContacts,
      categoryStats
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({ message: 'Server error while fetching contact statistics' });
  }
});

module.exports = router;