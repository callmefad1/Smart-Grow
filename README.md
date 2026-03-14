# Smart Grow User Client

Farmer-focused interface for Smart Grow agricultural management system. This client application enables farmers to manage farm zones, monitor weather, access AI-powered farming assistance, and handle subscriptions.

## Overview

The User Client is a React-based application designed specifically for farmers. It provides an intuitive interface for managing farming operations, accessing real-time weather information, leveraging AI-powered farming guidance, and controlling farm logistics including vehicle management.

## Key Features

### User Authentication
- User registration (Sign up)
- Secure login system
- Session management
- Profile security

### Dashboard
- Personal farm overview and statistics
- Quick access to farming operations
- Real-time performance metrics
- Summary of important information

### Farm Zone Management
- Create and manage multiple farm zones
- Monitor individual zone performance
- Track crop progress and health
- Zone-specific analytics
- Detailed zone reports

### Weather Information
- Real-time weather updates
- Weather forecasts for planning
- Weather-based alerts and notifications
- Historical weather data
- Temperature and precipitation tracking

### AI-Powered Farming Assistant
- Intelligent farming recommendations
- Crop-specific guidance and tips
- Ask farming-related questions
- Get actionable farming advice
- Learning resources and suggestions

### Van/Vehicle Management
- Track farming vehicles and vans
- Monitor vehicle status and location
- Schedule vehicle operations
- Manage farm logistics
- Vehicle maintenance tracking

### Subscription Management
- View active subscription plan
- Upgrade or downgrade plan
- Usage tracking and statistics
- Billing information
- Payment history

### User Settings
- Manage farmer profile information
- Update personal preferences
- Change password and security settings
- Account management
- Notification preferences

### Navigation & UI
- Responsive sidebar navigation
- Dark mode support (auto-detects system preference)
- Material-UI components for polished interface
- Smooth animations with Framer Motion
- Mobile-friendly responsive design

## Technology Stack

- React 18.2.0
- React Router DOM 6.14.0
- Firebase 10.0.0 (Authentication & Realtime Database)
- Material-UI 7.3.6 (Component library)
- MUI Icons 7.3.6
- Framer Motion 10.16.0 (Animations)
- Lucide React 0.263.0 (Icons)
- Axios 1.13.2 (HTTP client)
- N8N 2.0.3 (Workflow automation)
- React Scripts 5.0.1

## Prerequisites

- Node.js version 14 or higher
- npm (Node Package Manager)
- Firebase project with credentials
- Internet connection for Firebase services and weather APIs

## Installation Steps

### Step 1: Navigate to Client Directory
```bash
cd client
```

### Step 2: Manual Package Installation

Install dependencies one by one using npm:

```bash
# React and ReactDOM - Core dependencies
npm install react@18.2.0 react-dom@18.2.0

# React Router - For client-side routing
npm install react-router-dom@6.14.0

# Firebase - Backend services and authentication
npm install firebase@10.0.0

# Material-UI - Component library for polished UI
npm install @mui/material@7.3.6

# Material-UI Icons - Icon library
npm install @mui/icons-material@7.3.6

# Emotion - CSS-in-JS library (required for Material-UI)
npm install @emotion/react@11.14.0 @emotion/styled@11.14.1

# Framer Motion - Animation library
npm install framer-motion@10.16.0

# Lucide React - Icon library
npm install lucide-react@0.263.0

# Axios - HTTP client for API requests
npm install axios@1.13.2

# N8N - Workflow automation
npm install n8n@2.0.3

# React Scripts - Build and development tools
npm install react-scripts@5.0.1

# Testing libraries
npm install @testing-library/react @testing-library/jest-dom

# Environment variables management
npm install dotenv@latest

# Web performance metrics
npm install web-vitals@latest
```

### Step 3: Environment Configuration

Create a `.env` file in the client directory with your Firebase credentials:

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


## user credentials for testing: this is user holds one connected sensor

  mail: fedi@gmail.com
  pwd: fedi1999

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
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── AuthForm.css
│   │   ├── features/
│   │   │   ├── NavBar/
│   │   │   ├── Sidebar/
│   │   │   ├── paymentForm/
│   │   │   ├── cards/
│   │   │   └── weather/
│   │   ├── sensorDisplay/
│   │   │   ├── SensorCard.jsx
│   │   │   └── SensorCard.css
│   │   └── weather/
│   │       ├── Weather-card.jsx
│   │       └── weather.css
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   ├── farmZones/
│   │   │   ├── FarmZones.jsx
│   │   │   └── FarmZones.css
│   │   ├── vans/
│   │   │   ├── Vans.jsx
│   │   │   └── Vans.css
│   │   ├── AI-ChatBot/
│   │   │   ├── AlChatbot.jsx
│   │   │   └── aiChatbot.css
│   │   ├── subscription/
│   │   │   ├── Subscription.jsx
│   │   │   └── Subscription.css
│   │   ├── userSettings/
│   │   │   └── Settings.jsx
│   │   ├── paymentPage/
│   │   └── notfoundPage/
│   ├── routes/
│   │   ├── routes.js
│   │   └── navItems.js
│   ├── config/
│   │   └── firebaseConfig.js
│   ├── utils/
│   │   └── sensors.js
│   ├── assets/
│   │   └── Weather/
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
| `/signup` | User registration page |
| `/dashboard` | Farmer dashboard overview |
| `/farm-zones` | Farm zone management |
| `/vans` | Vehicle and logistics management |
| `/ai-assistant` | AI-powered farming chatbot |
| `/subscription` | Subscription management page |
| `/settings` | User profile and settings |
| `*` | 404 Not Found page |

## Configuration

### Firebase Setup

The user client uses Firebase for:
- User authentication (Registration and login)
- Real-time database for farm data
- Cloud storage for documents and images
- Cloud functions for backend operations

Update `src/config/firebaseConfig.js` with your Firebase credentials.

### Dark Mode

The application automatically detects your system's color scheme preference:
- Light mode for light system preference
- Dark mode for dark system preference

Users can toggle between modes in the NavBar.

### API Integration

The application integrates with:
- Firebase Realtime Database for farm data
- Weather APIs for real-time weather information
- N8N for workflow automation

## Dependencies

### Core Dependencies
- react: 18.2.0
- react-dom: 18.2.0
- react-router-dom: 6.14.0

### UI Libraries
- @mui/material: 7.3.6
- @mui/icons-material: 7.3.6
- @emotion/react: 11.14.0
- @emotion/styled: 11.14.1
- framer-motion: 10.16.0
- lucide-react: 0.263.0

### Services & Libraries
- firebase: 10.0.0
- axios: 1.13.2
- n8n: 2.0.3

### Development Dependencies
- react-scripts: 5.0.1
- @testing-library/react
- @testing-library/jest-dom

## Development Guidelines

- Components are organized by feature in the `components/features` directory
- Pages are located in the `pages` directory
- Authentication components are in `components/Auth`
- Routes are defined in `src/routes/routes.js`
- Styles use CSS files and Material-UI styling
- Follow React best practices and component composition patterns
- Use Axios for API calls to backend services

## Features in Detail

### Weather Integration
Access real-time weather data and forecasts to make informed farming decisions. Get weather-based alerts and notifications for your farming operations.

### AI Farming Assistant
Get personalized farming recommendations powered by AI. Ask questions about crops, pest management, irrigation, and more. Receive actionable advice based on your farm's conditions.

### Farm Zone Analytics
Track performance metrics for each farm zone. Monitor crop health, soil conditions, and productivity. Generate reports for informed decision-making.

### Subscription Plans
Choose a subscription plan that fits your farm size. Upgrade as your farm grows. Track usage and manage billing through the dashboard.

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

### Material-UI Styling Issues
Make sure Emotion packages are installed:
```bash
npm install @emotion/react@11.14.0 @emotion/styled@11.14.1
```

## Contributing

When adding new features:
1. Create new components in the `components` directory
2. Add new pages in the `pages` directory
3. Update routes in `src/routes/routes.js`
4. Follow existing code style and patterns
5. Test thoroughly before committing

## License

This project is private. All rights reserved.

## Support

For technical issues or feature requests, contact the development team.

---

For the complete Smart Grow project overview, see the main [README](../README.md).
