#!/bin/bash

echo "🚀 Starting TrashToCash Application..."

# Check if MongoDB is running
if ! pgrep mongod > /dev/null; then
    echo "📦 Starting MongoDB..."
    sudo mkdir -p /data/db
    sudo chown -R $USER:$USER /data/db
    mongod --dbpath /data/db --fork --logpath /data/db/mongod.log
    echo "✅ MongoDB started"
else
    echo "✅ MongoDB is already running"
fi

# Start backend in background
echo "🔧 Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
echo "✅ Backend server started (PID: $BACKEND_PID)"

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend Server..."
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "✅ Frontend server started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 TrashToCash Application is starting up!"
echo ""
echo "📍 Access your application at:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔗 Backend API: http://localhost:5000"
echo ""
echo "⏹️  To stop the application, run: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📋 Status:"
sleep 5

# Check if services are running
if curl -s http://localhost:3000 > /dev/null; then
    echo "   ✅ Frontend is running"
else
    echo "   ❌ Frontend failed to start"
fi

if curl -s http://localhost:5000 > /dev/null; then
    echo "   ✅ Backend is running"
else
    echo "   ❌ Backend failed to start"
fi

echo ""
echo "🔍 Monitor logs:"
echo "   Backend: tail -f /workspace/trashtocash-website/backend/*.log"
echo "   Frontend: Check the terminal where npm start is running"
echo ""

# Keep script running to show PIDs
wait