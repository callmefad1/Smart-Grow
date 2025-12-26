// User dashboard route definitions
import Login from '../components/Auth/Login';
import SignUp from '../components/Auth/SignUp';
import Dashboard from '../pages/dashboard/Dashboard.jsx'
import FarmZones from '../pages/farmZones/FarmZones.jsx';
import Vans from '../pages/vans/Vans.jsx';
import Subscription from '../pages/subscription/Subscription';
import NotFound from '../pages/notfoundPage/NotFound';
import Settings from '../pages/userSettings/Settings';
import FarmingChatbot from '../pages/AI-ChatBot/AlChatbot';

// Create a wrapper for NotFound since it's a default route
const NotFoundWrapper = () => <NotFound />;

const userRoutes = [
    { path: '/', element: Login },
    { path: '/signup', element: SignUp },
    { path: '/dashboard', element: Dashboard },
    { path: '/farm-zones', element: FarmZones },
    { path: '/vans', element: Vans },
    { path: '/ai-assistant', element: FarmingChatbot },
    { path: '/subscription', element: Subscription },
    { path: '/settings', element: Settings },
    { path: '*', element: NotFoundWrapper }
];

export default userRoutes;
