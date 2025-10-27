# 🚚 Fast shipping - Delivery Management System

A modern and elegant delivery management application built with Angular, featuring premium visual design and dynamic theme system.

![Angular](https://img.shields.io/badge/Angular-18.2.0-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## ✨ Main Features

### 🎯 **System Features**
- **Two user types**: Moderators and Delivery Personnel
- **Delivery management**: Create, assign, and complete deliveries
- **Image evidence**: Upload photos as delivery completion proof
- **Mock API**: JSON Server backend for data persistence

### 🌟 **Premium Visual Design**
- **🎨 Luxury golden palette** with premium feel
- **🌙 Elegant dark mode** with automatic system detection
- **💎 Smart dynamic theme system** with persistence
- **✨ Premium visual effects**: gradients, glows, shadows and animations
- **📱 Responsive design** optimized for all devices
- **♿ Full accessibility** with WCAG AA contrast

---

## 🚀 Installation and Setup

### 📋 **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn
- Git

### 🛠️ **Quick Installation**

#### **Option 1: Using setup script (Recommended)**
```bash
# Clone the repository
git clone <repository-url>
cd mi-repartidor

# Run automatic setup
chmod +x setup.sh
./setup.sh
```

#### **Option 2: Manual installation**
```bash
# 1. Install Angular dependencies
npm install

# 2. Install server dependencies
cd server && npm install
cd ..

# 3. Start JSON server (API)
npm run server

# 4. Start Angular application (new terminal)
npm start
```

### 🌐 **Access the Application**
- **Frontend**: http://localhost:4200
- **API**: http://localhost:3000
- **Development mode**: Hot reload enabled

---

## 👥 Test Users

### 🔐 **Moderators**
- **Username**: `moderator1`
- **Password**: `mod123`
- **Permissions**: Create deliveries, view all deliveries, manage assignments

### 🚛 **Delivery Personnel**
- **Username**: `delivery1` | **Password**: `del123`
- **Username**: `delivery2` | **Password**: `del456`
- **Permissions**: View available deliveries, take assignments, upload evidence

---

## 🎨 Theme System

### 🌞 **Light Mode (Luxury Day)**
- Elegant white smoke background (`#FAF5EA`)
- Premium warm gray text
- Vibrant and sophisticated golden
- Luxury daytime feel

### 🌙 **Dark Mode (Luxury Night)**
- Premium deep black background (`#0a0a0a`)
- Elegant pure white text
- More vibrant and dramatic golden (`#d4b885`)
- Luxury nighttime feel

### 🔄 **Theme System Features**
- **Automatic system detection** (`prefers-color-scheme`)
- **Manual toggle** in header with dynamic icons
- **Persistence** in localStorage between sessions
- **Smooth transitions** between theme changes
- **Responsive** on all devices

---

## 📁 Project Structure

```
mi-repartidor/
├── 📁 server/                          # JSON Server API
│   ├── 📄 db.json                     # Mock database
│   ├── 📄 routes.json                 # API routes configuration
│   └── 📄 package.json               # Server dependencies
├── 📁 src/                           # Angular application
│   ├── 📁 app/
│   │   ├── 📁 components/           # UI components
│   │   │   ├── 📁 header/          # Header with theme toggle
│   │   │   ├── 📁 login/           # Login screen
│   │   │   ├── 📁 delivery-list/   # Delivery list
│   │   │   ├── 📁 create-delivery/ # Create new delivery
│   │   │   └── 📁 shared/          # Reusable components
│   │   ├── 📁 services/            # Services (Theme, Auth, API)
│   │   ├── 📁 models/             # TypeScript interfaces
│   │   └── 📁 guards/             # Authentication guards
│   ├── 📁 assets/                 # Static assets
│   └── 📁 environments/           # Environment configuration
├── 📄 .gitignore                 # Files to ignore in git
├── 📄 angular.json              # Angular CLI configuration
├── 📄 package.json              # Angular dependencies
├── 📄 tsconfig.json             # TypeScript configuration
└── 📄 README.md                 # This file
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Angular development server |
| `npm run server` | Start JSON server API only |
| `npm run build` | Build application for production |
| `npm test` | Run tests with Karma/Jasmine |
| `npm run watch` | Build in watch mode for development |

---

## 🔌 API Endpoints

### **Authentication**
- `GET /users` - Get all users

### **Deliveries**
- `GET /deliveries` - Get all deliveries
- `POST /deliveries` - Create new delivery
- `PUT /deliveries/:id` - Update delivery status
- `POST /deliveries/:id/images` - Upload evidence images

---

## 🎨 Color Palette

### **Base Colors**
```css
/* Light Mode */
--white-smoke: #FAF5EA      /* Elegant main background */
--primary-500: #bfa36e       /* Main golden */
--primary-600: #d4b885       /* Vibrant golden */
--gray-600: #5B5B5B          /* Elegant gray */

/* Dark Mode */
--dark-bg-primary: #0a0a0a   /* Premium deep black */
--dark-primary-600: #d4b885  /* More vibrant golden */
--dark-text-primary: #ffffff /* Pure white */
```

### **Premium Visual Components**
- **Golden gradients** in headers and featured elements
- **Premium shadows** enhanced for depth perception
- **Adaptive glow effects** based on theme
- **Smooth animations** between states and transitions
- **Floating cards** with elegant hover effects

---

## 🏗️ Technologies Used

### **Frontend**
- **Angular 18.2.0** - Main framework
- **TypeScript 5.5.2** - Static typing
- **RxJS 7.8.0** - Reactive programming
- **CSS3** - Styling with dynamic CSS variables

### **Backend (Mock)**
- **JSON Server 0.17.4** - Mock REST API
- **Node.js** - JavaScript runtime

### **Development**
- **Angular CLI** - Development tools
- **Karma + Jasmine** - Testing framework
- **Leaflet 1.9.4** - Maps (integration ready)

---

## 🌟 Implemented Visual Improvements

### **✨ Premium Effects**
- **Radial gradients** in headers with light effects
- **Elegant text shadows** for better readability
- **Hover effects** with scale and elevation
- **Golden glow effects** in dark mode
- **Backdrop blur** in modal elements
- **Subtle border gradients** in cards

### **📱 Responsive Design**
- **Optimized breakpoints**: 1024px, 768px, 640px, 480px
- **Flexible layout**: Horizontal on desktop, optimized on mobile
- **Touch-friendly**: Buttons and elements optimized for touch
- **Mobile menu** completely redesigned with backdrop blur

### **♿ Accessibility**
- **WCAG AA contrast** in all elements
- **Visible focus indicators** elegant and clear
- **Screen reader** compatible
- **Complete keyboard navigation**
- **Well differentiated hover states**

---

## 🚀 Suggested Next Steps

### **Features**
- [ ] **Real backend integration** (Node.js/Express or NestJS)
- [ ] **JWT authentication** for enhanced security
- [ ] **WebSockets** for real-time updates
- [ ] **Image storage service** (Cloudinary/AWS S3)
- [ ] **Push notifications** for urgent deliveries

### **Visual Improvements**
- [ ] **Animated transitions** between theme changes
- [ ] **Automatic mode** based on time of day
- [ ] **Additional high contrast theme**
- [ ] **Advanced color customization** per user

### **Optimizations**
- [ ] **PWA (Progressive Web App)** for offline installation
- [ ] **Lazy loading** of Angular modules
- [ ] **Automatic image compression**
- [ ] **Advanced caching** for better performance

---

## 🐛 Troubleshooting

### **Common Issues**

**Error: Port 4200 is already in use**
```bash
# Find which process is using the port
npx kill-port 4200
# Or change the port in angular.json
```

**Error: Cannot find module 'json-server'**
```bash
cd server
npm install
```

**Error: CORS in browser**
- Verify that JSON server is running on port 3000
- Check proxy configuration in angular.json

### **Theme Problem Resolution**
```bash
# Clear localStorage if theme problems occur
# Open DevTools → Application → Local Storage → Clear
```

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**🎨 Fast shipping now offers a premium visual experience with a complete and elegant delivery management system!** ✨🚚💎

---

*Would you like me to adjust any specific aspect or add more features?*
