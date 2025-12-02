// src/App.js
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import appRoutes from './routes/routes';
import { auth } from './config/firebaseConfig';
import NavBar from "./components/NavBar/NavBar";
import './App.css';

function App() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check system preference for dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }
    }, []);

    /*
    Original App.js (kept as reference - previous explicit imports and Routes):

    import NewFarmer from "./components/newFarmer/NewFarmer";
    import Farmers from "./components/farmers/Farmers";
    import ViewFarmers from "./components/viewFarmers/ViewFarmers";
    import UpdateFarmer from "./components/updateFarmer/UpdateFarmer";
    import Dashboard from "./components/dashboard/Dashboard";
    import IoTMonitor from "./components/IoTMonitor/IoTMonitor"; 
    import NavBar from "./components/NavBar/NavBar";

    ...

    <main className="main-content">
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/write" element={<NewFarmer />} />
            <Route path="/read" element={<Farmers />} />
            <Route path="/Updateread" element={<ViewFarmers />} />
            <Route path="/updatewrite/:firebaseId" element={<UpdateFarmer />} />
            <Route path="/iot-monitor" element={<IoTMonitor />} />
            <Route path="/iot" element={<IoTMonitor />} />
        </Routes>
    </main>

    */

    // Inner component so we can use router hooks (location) to conditionally render NavBar
    function AppRouter() {
    const location = useLocation();
    const navigate = useNavigate();

        // If user is already authenticated and hits '/', redirect to dashboard
        useEffect(() => {
            if (location.pathname === '/' && auth && auth.currentUser) {
                navigate('/dashboard');
            }
        }, [location.pathname, navigate]);

        return (
            <>
                {/* Don't show NavBar on the login landing page (path === '/') */}
                {location.pathname !== '/' && (
                    <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />
                )}

                <main className="main-content">
                    <Routes>
                        {/*delete THIS SECTION if need back old routes and uncomment the code above + delete file routes.js */}
                        {appRoutes.map((r) => {
                            const Component = r.element;
                            return <Route key={r.path} path={r.path} element={<Component />} />;
                        })}
                        {/*delete THIS SECTION if need back old routes and uncomment the code above + delete file routes.js */}
                    </Routes>
                </main>
            </>
        );
    }

    return (
        <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <Router>
                <AppRouter />
            </Router>
        </div>
    );
}

export default App;