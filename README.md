# Smart Grow - User Dashboard

A comprehensive React-based user dashboard for managing farm operations, including real-time sensor monitoring, farm zone management, water van control, and subscription management.

## 📋 Features

### 1. **Dashboard**
- Real-time weather data display (weekly forecast)
- Water level monitoring from wells/containers with status indicators
- Soil temperature and humidity monitoring
- Battery status tracking for all sensors
- Live connection status and last update timestamp

### 2. **Farm Zones Management**
- **Create** new farm zones with detailed information
- **Read** and view all farm zones with CRUD operations
- **Update** existing farm zones
- **Delete** farm zones
- Track zone details:
  - Zone name and location
  - Area (in hectares)
  - Crop type
  - Soil type (Clay, Sandy, Loamy, Silt, Peat)
  - Custom descriptions

### 3. **Water Vans Control**
- Monitor water vans with real-time status
- **Activate/Deactivate** vans with one-click toggle
- **Set Activation Schedule** - Schedule van activation for specific times
- **Timer Control** - Set timers (in minutes) for automated watering
- Track van specifications:
  - Van name and model
  - Water capacity (in liters)
  - Battery level
  - Status (Active, Inactive, Maintenance)
- **Request New Van** from admin with custom requirements
- Modal form for van request submissions

### 4. **Subscription Plans**
Three subscription tiers with progressive feature unlocking:

### Basic (FREE)
✅ Dashboard
✅ Sensor monitoring
✅ Weather data
❌ Farm Zones (disabled)
❌ Water Vans (disabled)
❌ Live Chat
❌ AI Assistant

### Moderate (55 DT/Month)
✅ Dashboard
✅ Sensor monitoring
✅ Weather data
✅ Farm Zones
✅ Water Vans
❌ Live Chat
❌ AI Assistant

### Premium (660 DT/Year)
✅ All features
✅ Live Chat
✅ AI Assistant
✅ Priority support

---

## 🛠️ Tech Stack

- **React 18.2** - UI framework
- **React Router v6** - Navigation
- **Firebase 10.0** - Backend & database
  - Authentication (Email/Password)
  - Realtime Database
  - Storage
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **CSS3** - Styling with glassmorphism design

## 📁 Project Structure

```
user/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Login.css
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   ├── farmZones/
│   │   │   ├── FarmZones.jsx
│   │   │   └── FarmZones.css
│   │   ├── vans/
│   │   │   ├── Vans.jsx
│   │   │   └── Vans.css
│   │   ├── subscription/
│   │   │   ├── Subscription.jsx
│   │   │   └── Subscription.css
│   │   ├── features/
│   │   │   └── NavBar/
│   │   │       ├── NavBar.jsx
│   │   │       └── NavBar.css
│   │   └── pages/
│   │       └── notfoundpage/
│   │           ├── NotFound.jsx
│   │           └── notfound.css
│   ├── config/
│   │   ├── firebaseConfig.js
│   │   ├── navItems.js
│   │   └── routes.js
│   ├── services/
│   │   └── [service files]
│   ├── utils/
│   │   └── sensors.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Realtime Database configured

### Steps

1. **Install Dependencies**
   ```bash
   cd user
   npm install
   ```

2. **Configure Firebase**
   - Update `src/config/firebaseConfig.js` with your Firebase credentials
   - Set environment variables:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     REACT_APP_FIREBASE_DATABASE_URL=your_database_url
     ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🔐 Authentication

- Email/Password authentication via Firebase
- Sign up and sign in functionality
- Automatic user session management
- Protected routes (accessible only when logged in)

## 📊 Database Structure

### Users Collection
```
users/
├── {uid}/
│   ├── subscription/
│   │   ├── plan (basic|moderate|premium)
│   │   ├── upgradedAt
│   │   ├── active
│   │   └── renewalDate
│   ├── sensors/
│   │   ├── weather/
│   │   ├── wells/
│   │   ├── soils/
│   │   └── batteries/
│   ├── farmZones/
│   │   └── {zoneId}/
│   ├── vans/
│   │   └── {vanId}/
│   └── vanRequests/
│       └── {requestId}/
```

## 🎨 Design Features

### UI/UX
- **Glassmorphism Design** - Modern frosted glass effect with backdrop blur
- **Gradient Backgrounds** - Purple-violet color scheme
- **Dark/Light Mode Toggle** - System preference detection
- **Responsive Design** - Mobile, tablet, and desktop support
- **Smooth Animations** - Framer Motion animations for transitions

### Status Indicators
- **Color-coded Status** - Green (normal), Yellow (warning), Red (critical)
- **Real-time Updates** - WebSocket connection to Firebase
- **Visual Feedback** - Hover effects and transitions

## 🔄 Real-time Features

All data updates are real-time using Firebase Realtime Database:
- Sensor data updates instantly
- Farm zone changes sync immediately
- Van status updates reflect in real-time
- Subscription changes take effect instantly

## 📱 Responsive Breakpoints

- **Desktop** - 1024px and above
- **Tablet** - 768px to 1023px
- **Mobile** - Below 768px

## 🎯 Usage Examples

### Adding a Farm Zone
1. Click "Add New Zone" on the Farm Zones page
2. Fill in zone details (name, location, area, crop type, soil type)
3. Click "Create Zone"
4. Zone appears immediately in the grid

### Controlling a Water Van
1. Go to Vans page
2. Toggle the Power button to activate/deactivate
3. Set schedule time using the Clock input
4. Set timer duration (in minutes) using the Timer input
5. Changes sync instantly with Firebase

### Upgrading Subscription
1. Go to Subscription page
2. Select desired plan
3. Click "Upgrade" button
4. Confirm in the modal
5. Subscription updates immediately

## ⚠️ Access Control

The subscription system controls feature access:
- **Basic users** can only access Dashboard (other pages disabled)
- **Moderate users** unlock Farm Zones and Vans pages
- **Premium users** get all features + Live Chat + AI Assistant

## 🐛 Error Handling

- Firebase connection errors display user-friendly alerts
- Form validation prevents incomplete submissions
- Missing data triggers graceful fallbacks
- Error messages automatically dismiss

## 🔗 Navigation

### Top Navigation Bar
- Logo and branding
- Theme toggle (light/dark mode)
- User profile dropdown with logout

### Sidebar Navigation
- Dashboard
- Farm Zones
- Water Vans
- Subscription Plans
- Mobile hamburger menu on small screens

## 📝 Environment Variables

Create a `.env` file in the user directory:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
```

## 🚀 Future Enhancements

- [ ] Live chat integration for Premium users
- [ ] AI assistant chatbot
- [ ] Email notifications
- [ ] Data export functionality
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Payment gateway integration
- [ ] Advanced scheduling features
- [ ] Historical data charts
- [ ] Multi-language support

## 📞 Support

For issues or questions, contact the support team or check the FAQ section in the Subscription page.

## 📄 License

This project is part of the Smart Grow agricultural management system.

---

**Last Updated**: November 2024
**Version**: 1.0.0
