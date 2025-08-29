# TrashToCash Website

A full-stack MERN application that allows users to sell their recyclable waste materials and earn money while contributing to environmental sustainability.

## 🌟 Features

### For Customers
- **User Registration & Authentication** - Secure account creation and login
- **Service Browsing** - View all available recycling services with pricing
- **Booking System** - Schedule waste pickup with preferred time slots
- **Earnings Tracking** - Monitor earnings from recycled materials
- **Profile Management** - Update personal information and addresses
- **Real-time Updates** - Track booking status and payments

### For Administrators
- **Dashboard Analytics** - Comprehensive overview of business metrics
- **User Management** - Manage customer accounts and permissions
- **Service Management** - Add, edit, and manage recycling services
- **Booking Management** - Track and update booking statuses
- **Contact Management** - Handle customer inquiries and support

### General Features
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Notifications** - Email notifications for bookings and updates
- **Secure Payments** - Multiple payment options for transactions
- **File Uploads** - Image uploads for service verification
- **Search & Filtering** - Easy discovery of services and bookings

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **React Router** for client-side routing
- **React Query** for server state management
- **React Hook Form** for form handling
- **Framer Motion** for animations
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email notifications
- **CORS** for cross-origin requests

## 📁 Project Structure

```
trashtocash-website/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── controllers/        # Route controllers
│   ├── config/             # Configuration files
│   ├── uploads/            # File upload directory
│   └── server.js           # Main server file
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
│
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trashtocash-website
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start the backend server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start the frontend development server
   npm start
   ```

4. **Setup Database**
   - Ensure MongoDB is running on your system
   - The application will automatically create necessary collections
   - Optionally, seed the database with sample data

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trashtocash
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=TrashToCash
REACT_APP_VERSION=1.0.0
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Services Endpoints
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Bookings Endpoints
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status (Admin)
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Contact Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Admin)
- `PUT /api/contact/:id/status` - Update contact status (Admin)
- `POST /api/contact/:id/respond` - Respond to contact (Admin)

## 🎨 Design Features

- **Modern UI/UX** - Clean, intuitive interface with consistent design
- **Responsive Layout** - Optimized for all screen sizes
- **Accessibility** - WCAG compliant with proper ARIA labels
- **Dark/Light Theme** - User preference-based theming
- **Loading States** - Smooth loading indicators and skeleton screens
- **Error Handling** - User-friendly error messages and fallbacks

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **Input Validation** - Server-side validation for all inputs
- **File Upload Security** - Secure file upload with type validation
- **CORS Protection** - Configured CORS for API security
- **Rate Limiting** - API rate limiting to prevent abuse

## 🚢 Deployment

### Backend Deployment
1. Set up production environment variables
2. Build the application: `npm run build`
3. Deploy to your preferred platform (Heroku, AWS, etc.)
4. Configure MongoDB Atlas for production database

### Frontend Deployment
1. Update API URLs for production
2. Build the application: `npm run build`
3. Deploy to static hosting (Netlify, Vercel, etc.)
4. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@trashtocash.co.in
- Phone: +91-XXXX-XXX-XXX
- Website: https://trashtocash.co.in

## 🙏 Acknowledgments

- Material-UI for the excellent React components
- MongoDB for the flexible database solution
- The React and Node.js communities for continuous innovation
- All contributors who help make this project better

---

**TrashToCash** - Turn Your Trash Into Cash 🌱💰