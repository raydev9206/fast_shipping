#!/bin/bash

# Installation and Setup Script for Fast shipping

echo "🚀 Setting up Fast shipping - Delivery Management System"
echo ""

# Install Angular dependencies
echo "📦 Installing Angular dependencies..."
npm install

# Install JSON Server dependencies
echo "📦 Installing JSON Server dependencies..."
cd server && npm install
cd ..

# Start JSON Server (API)
echo "🌐 Starting JSON Server API..."
echo "   API will be available at: http://localhost:3000"
cd server && npx json-server --watch db.json --port 3000 --routes routes.json &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 3

# Start Angular Development Server
echo "🚀 Starting Angular Development Server..."
echo "   Application will be available at: http://localhost:4200"
echo ""
echo "📋 Default User Accounts:"
echo "   Moderators:"
echo "     - Username: moderator1, Password: mod123"
echo ""
echo "   Delivery Personnel:"
echo "     - Username: delivery1, Password: del123"
echo "     - Username: delivery2, Password: del456"
echo ""
echo "🔧 Available Scripts:"
echo "   npm start          - Start Angular dev server"
echo "   npm run server     - Start JSON server only"
echo "   npm run build      - Build for production"
echo "   npm test           - Run tests"
echo ""
echo "📁 Project Structure:"
echo "   src/app/components/  - Angular components"
echo "   src/app/services/    - Angular services"
echo "   src/app/models/      - TypeScript interfaces"
echo "   server/              - JSON Server API"
echo ""
echo "✨ Features:"
echo "   - Role-based authentication (Moderator/Delivery)"
echo "   - Create delivery requests (Moderators only)"
echo "   - Take delivery assignments (Delivery personnel)"
echo "   - Upload evidence images for completion"
echo "   - Real-time delivery status updates"
echo ""
echo "🛑 To stop servers:"
echo "   - Press Ctrl+C to stop both servers"
echo "   - Or run: kill $SERVER_PID (to stop JSON server only)"

# Start Angular in foreground
ng serve --port 4200 --host 0.0.0.0
