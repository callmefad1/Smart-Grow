// src/config/routes.js
// Centralized route definitions for the application.
// Add new routes here to extend the app without modifying App.js (OCP).

import NewFarmer from '../pages/NewFarmer.jsx';
import ManageFarmers from '../pages/ManageFarmers.jsx';
import UpdateFarmer from '../pages/UpdateFarmer.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import IoTMonitor from '../pages/IoTMonitor.jsx';
import Login from '../components/Auth/Login.jsx';
import NotFound from '../pages/NotFound.jsx';
import Subscriptions from '../pages/subscriptions.jsx'

//this is the route extension file for app.js

const appRoutes = [
    { path: '/', element: Login },
    { path: '/dashboard', element: Dashboard },
    { path: '/newfarmer', element: NewFarmer },
    { path: '/managefarmers', element: ManageFarmers }, //manage farm page
    { path: '/updatefarmer/:firebaseId', element: UpdateFarmer },  //update signle user inside "manage farmers" 
    { path: '/iot-monitor', element: IoTMonitor },
    { path: '/iot', element: IoTMonitor },

    { path: '/subscriptions', element: Subscriptions },

    { path: '*', element: NotFound }  //if path donesn't exist, redirect to 404 component
];

export default appRoutes;
