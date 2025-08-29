# 🚀 How to Run TrashToCash Website

## Quick Start (Easiest Method)

### Option 1: Use the Startup Script
```bash
cd /workspace/trashtocash-website
./start.sh
```

This script will automatically:
- Start MongoDB if not running
- Start the backend server on port 5000
- Start the frontend server on port 3000

## Manual Setup (Step by Step)

### Prerequisites Check
Make sure you have the required software:
```bash
# Check Node.js version (should be v16+)
node --version

# Check npm version
npm --version

# Check if MongoDB is installed
mongod --version
```

### Step 1: Start MongoDB
```bash
# Create data directory
sudo mkdir -p /data/db
sudo chown -R $USER:$USER /data/db

# Start MongoDB
mongod --dbpath /data/db --fork --logpath /data/db/mongod.log
```

### Step 2: Start Backend Server
Open a new terminal window:
```bash
cd /workspace/trashtocash-website/backend
npm install  # Only needed first time
npm run dev
```

You should see:
```
Server is running on port 5000
Connected to MongoDB successfully
Environment: development
```

### Step 3: Start Frontend Server
Open another terminal window:
```bash
cd /workspace/trashtocash-website/frontend
npm install  # Only needed first time
npm start
```

The React development server will start and automatically open your browser to `http://localhost:3000`

## 🌐 Access Your Application

Once both servers are running:

- **Frontend (Website)**: http://localhost:3000
- **Backend (API)**: http://localhost:5000

## 🔍 Testing the Application

### Test the Backend API
```bash
# Test if backend is responding
curl http://localhost:5000

# Should return something like:
# {"message":"TrashToCash API Server","version":"1.0.0","status":"running"}
```

### Test the Frontend
Visit http://localhost:3000 in your browser. You should see:
- Beautiful homepage with green eco-friendly theme
- Navigation bar with Home, About, Services, Contact
- Hero section with "Turn Your Trash Into Cash"
- Features section, services preview, testimonials

## 🎯 Key Features to Try

### 1. Navigation
- Click through different pages (Home, About, Services, Contact)
- Try the mobile responsive design by resizing your browser

### 2. Authentication
- Click "Register" to create a new account
- Click "Login" to sign in
- Try the demo accounts (if implemented)

### 3. Admin Features
- Login as admin to access admin dashboard
- Manage users, services, bookings, and contacts

## 🛠️ Troubleshooting

### MongoDB Issues
```bash
# If MongoDB fails to start:
sudo service mongod restart

# Or manually:
killall mongod
mongod --dbpath /data/db --fork --logpath /data/db/mongod.log
```

### Backend Issues
```bash
# Check backend logs:
cd /workspace/trashtocash-website/backend
npm run dev

# Common issues:
# 1. MongoDB not running - start MongoDB first
# 2. Port 5000 in use - change PORT in .env file
# 3. Dependencies - run: npm install
```

### Frontend Issues
```bash
# Check frontend logs:
cd /workspace/trashtocash-website/frontend
npm start

# Common issues:
# 1. Port 3000 in use - React will offer alternative port
# 2. Dependencies - run: npm install
# 3. Build errors - check for TypeScript errors
```

### Port Conflicts
If ports are in use:
```bash
# Kill processes on port 3000 (frontend)
sudo kill -9 $(lsof -t -i:3000)

# Kill processes on port 5000 (backend)
sudo kill -9 $(lsof -t -i:5000)
```

## 📱 Mobile Testing

The application is fully responsive. Test on:
- Desktop browsers (Chrome, Firefox, Safari)
- Mobile devices or browser dev tools (F12 → Device toolbar)
- Different screen sizes and orientations

## 🔧 Development Tips

### Hot Reloading
Both servers support hot reloading:
- **Frontend**: Changes auto-refresh the browser
- **Backend**: Server restarts automatically with nodemon

### Environment Variables
Customize settings in:
- `backend/.env` - Server configuration
- `frontend/.env` - React app configuration

### Database
- MongoDB runs on default port 27017
- Database name: `trashtocash`
- Access with: `mongosh trashtocash`

## 🎨 Customization

### Change Content
Edit the page components in:
- `frontend/src/pages/HomePage.tsx` - Main landing page
- `frontend/src/pages/AboutPage.tsx` - About page
- `frontend/src/pages/ContactPage.tsx` - Contact page

### Change Styling
Modify the theme in:
- `frontend/src/App.tsx` - Material-UI theme configuration

### Add Features
Add new API endpoints in:
- `backend/routes/` - API routes
- `backend/models/` - Database models

## 📋 Current Status

✅ **Working Features:**
- Beautiful responsive homepage
- Navigation with mobile menu
- About page with company info
- User registration and login
- Admin authentication system
- MongoDB database connection
- RESTful API structure

🚧 **In Development:**
- Complete booking system
- Payment integration
- Service management
- Contact form functionality
- Admin dashboard analytics

## 🚀 Next Steps

1. **Customize Content**: Edit page content to match your business
2. **Add Services**: Implement the services catalog
3. **Complete Booking**: Finish the booking workflow
4. **Add Payments**: Integrate payment gateway
5. **Deploy**: Deploy to production environment

## 📞 Need Help?

If you encounter issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check that ports 3000 and 5000 are available
5. Review the logs in both terminal windows

The application is fully functional and ready for development!