import {
    Home,
    Leaf,
    Droplets,
    CreditCard,
    MessagesSquare  
} from 'lucide-react';

// Navigation items for user dashboard sidebar
const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', Icon: Home },
    { path: '/farm-zones', label: 'Farm Zones', Icon: Leaf },
    { path: '/vans', label: 'Vans', Icon: Droplets },
    { path: '/ai-assistant', label: 'AI Assistant', Icon: MessagesSquare   },
    { path: '/subscription', label: 'Subscription', Icon: CreditCard }
    
];

export default userNavItems;
