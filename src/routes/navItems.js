
import {
    Home,
    Settings,
    UserPlus,
    Edit3
} from 'lucide-react';


//this is a nav bar extension file for navbar.jsx

const navItems = [
    { path: '/dashboard', label: 'Dashboard', Icon: Home },
    { path: '/iot-monitor', label: 'IoT Monitor', Icon: Settings },
    // { path: '/newfarmer ', label: 'Register Farmer', Icon: UserPlus },
    { path: '/managefarmers', label: 'Manage Farmers', Icon: Edit3 },
    { path: '/subscriptions', label: 'Manage Subscriptions', Icon: Edit3 }
];

export default navItems;
