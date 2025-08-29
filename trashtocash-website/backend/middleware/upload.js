const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads/users', 'uploads/services', 'uploads/bookings'];
uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    // Determine upload path based on field name or route
    if (file.fieldname === 'profileImage' || req.baseUrl.includes('users')) {
      uploadPath += 'users/';
    } else if (file.fieldname === 'serviceImage' || req.baseUrl.includes('services')) {
      uploadPath += 'services/';
    } else if (file.fieldname === 'bookingImages' || req.baseUrl.includes('bookings')) {
      uploadPath += 'bookings/';
    } else {
      uploadPath += 'general/';
    }
    
    // Ensure directory exists
    const fullPath = path.join(__dirname, '..', uploadPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum is 10 files.' });
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
  } else if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

// Different upload configurations
const uploadSingle = upload.single('image');
const uploadProfileImage = upload.single('profileImage');
const uploadServiceImage = upload.single('serviceImage');
const uploadBookingImages = upload.array('bookingImages', 5);
const uploadMultiple = upload.array('images', 10);

module.exports = {
  upload,
  uploadSingle,
  uploadProfileImage,
  uploadServiceImage,
  uploadBookingImages,
  uploadMultiple,
  handleUploadError
};