# Smart Grow Admin Dashboard

Farm administrator management interface for Smart Grow agricultural management system. This dashboard provides comprehensive tools for managing farmers, monitoring IoT devices, and handling farm subscriptions.

## Overview

The Admin Dashboard is a React-based application that enables farm administrators to manage multiple farmers, monitor IoT sensor data in real-time, and oversee subscription plans. It provides a centralized control hub for all farm management operations.

## Key Features

### Dashboard
- Real-time farm statistics and overview
- Performance metrics and analytics
- Quick access to key management functions
- System health monitoring

### Farmer Management
- Add new farmers to the system
- View comprehensive farmer profiles
- Update farmer information and details
- Track farmer activity and subscriptions
- Manage farmer data and settings

### IoT Device Monitoring
- Real-time monitoring of sensor data
- IoT device status tracking
- Historical data visualization
- Alert management
- Device configuration interface

### Subscription Management
- Monitor active subscriptions
- Manage subscription plans
- Track billing information
- Handle subscription updates and cancellations
- Generate subscription reports

### Navigation & UI
- Responsive navigation bar
- Dark mode support (auto-detects system preference)
- Intuitive component-based interface
- Smooth animations with Framer Motion

## Technology Stack

- React 18.2.0
- React Router DOM 6.30.1
- Firebase 10.14.1 (Authentication & Realtime Database)
- Framer Motion 12.23.24 (Animations)
- Lucide React 0.546.0 (Icons)
- React Scripts 5.0.1

## Prerequisites

- Node.js version 14 or higher
- npm (Node Package Manager)
- Firebase project with credentials
- Internet connection for Firebase services

## Installation Steps

### Step 1: Navigate to Admin Directory
```bash
cd admin
```

### Step 2: Manual Package Installation

Install dependencies one by one using npm:

```bash
# React and ReactDOM - Core dependencies
npm install react@18.2.0 react-dom@18.2.0

# React Router - For client-side routing
npm install react-router-dom@6.30.1

# Firebase - Backend services and authentication
npm install firebase@10.14.1

# Framer Motion - Animation library
npm install framer-motion@12.23.24

# Lucide React - Icon library
npm install lucide-react@0.546.0

# React Scripts - Build and development tools
npm install react-scripts@5.0.1

# Testing libraries
npm install @testing-library/react@13.4.0 @testing-library/jest-dom@5.17.0 @testing-library/user-event@13.5.0

# Environment variables management
npm install dotenv@16.6.1

# Web performance metrics
npm install web-vitals@2.1.4
```

### Step 3: Environment Configuration

Create a `.env` file in the admin directory with your Firebase credentials:

```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

### Step 4: Start Development Server

```bash
npm start
```

The application will open automatically at http://localhost:3000

## Available npm Scripts

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# Eject from Create React App (irreversible)
npm eject
```

## Project Structure

```
admin/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── login.css
│   │   ├── NavBar/
│   │   │   ├── NavBar.jsx
│   │   │   └── NavBar.css
│   │   ├── buttons/
│   │   ├── cards/
│   │   ├── searchbar/
│   │   └── Autosettings/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── ManageFarmers.jsx
│   │   ├── NewFarmer.jsx
│   │   ├── UpdateFarmer.jsx
│   │   ├── IoTMonitor.jsx
│   │   ├── subscriptions.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── autoSettingsService.js
│   │   └── subscriptionService.js
│   ├── config/
│   │   └── firebaseConfig.js
│   ├── routes/
│   │   └── routes.js
│   ├── styles/
│   ├── utils/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Available Routes

| Route | Description |
|-------|-------------|
| `/` | Login page |
| `/dashboard` | Admin dashboard overview |
| `/newfarmer` | Add new farmer form |
| `/managefarmers` | View and manage all farmers |
| `/updatefarmer/:firebaseId` | Update specific farmer information |
| `/iot-monitor` or `/iot` | IoT device monitoring interface |
| `/subscriptions` | Subscription management |
| `*` | 404 Not Found page |

## Configuration

### Firebase Setup

The admin dashboard uses Firebase for:
- User authentication (Admin login)
- Real-time database for farmer data
- Cloud storage for documents
- Cloud functions for backend operations

Update `src/config/firebaseConfig.js` with your Firebase credentials.

### Dark Mode

The application automatically detects your system's color scheme preference:
- Light mode for light system preference
- Dark mode for dark system preference

Users can toggle between modes in the NavBar.

## Dependencies

### Core Dependencies
- react: 18.2.0
- react-dom: 18.2.0
- react-router-dom: 6.30.1

### Services & Libraries
- firebase: 10.14.1
- framer-motion: 12.23.24
- lucide-react: 0.546.0
- dotenv: 16.6.1

### Development Dependencies
- react-scripts: 5.0.1
- @testing-library/react: 13.4.0
- @testing-library/jest-dom: 5.17.0

## Development Guidelines

- Components are organized by feature in the `components` directory
- Pages are located in the `pages` directory
- Business logic is centralized in the `services` directory
- Routes are defined in `src/routes/routes.js`
- Styles use CSS modules and CSS files
- Follow React best practices and component composition patterns

## Troubleshooting

### Port Already in Use
```bash
npm start -- --port 3001
```

### Firebase Connection Issues
- Verify Firebase credentials in `.env` file
- Check Firebase project is active
- Confirm network connectivity

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### Build Errors
```bash
# Clear cache and rebuild
npm cache clean --force
npm install
npm run build
```

## Contributing

When adding new features:
1. Create new components in the `components` directory
2. Add business logic to appropriate service files
3. Update routes in `src/routes/routes.js`
4. Follow existing code style and patterns

## License

This project is private. All rights reserved.

## Support

For technical issues or feature requests, contact the development team.

---

For the complete Smart Grow project overview, see the main [README](../README.md).
