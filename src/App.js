// src/App.js
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import userRoutes from './routes/routes';
import NavBar from "./components/features/NavBar/NavBar";
import Sidebar from "./components/features/Sidebar/Sidebar";
import './App.css';

function App() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check system preference for dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }
    }, []);

    // Inner component so we can use router hooks (location) to conditionally render NavBar
    function AppRouter() {
        const location = useLocation();

        // Don't show NavBar/Sidebar on login and signup pages
        const showNavBar = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';

        return (
            <div className={darkMode ? "dark-mode" : "light-mode"}>
                {showNavBar && <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />}
                <div className="app-container">
                    {showNavBar && <Sidebar currentPath={location.pathname} />}
                    <main className="main-content">
                        <Routes>
                            {userRoutes.map(({ path, element: Element }) => (
                                <Route key={path} path={path} element={<Element />} />
                            ))}
                        </Routes>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <AppRouter />
        </Router>
    );
}

export default App;
