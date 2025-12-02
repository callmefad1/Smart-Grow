// src/components/Navigation.jsx (or wherever your navigation is)
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import './NavBar.css';
import defaultNavItems from '../../routes/navItems';
import { auth, signOut } from '../../config/firebaseConfig';

function NavBar({ darkMode, setDarkMode, navItems = defaultNavItems, currentPath }) {
    // Prefer injected currentPath (for DIP/testing). If not provided, fall back to useLocation.
    const location = useLocation();
    const activePath = typeof currentPath === 'string' ? currentPath : location.pathname;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // set a friendly user name from Firebase auth if available
        if (auth && auth.currentUser) {
            const u = auth.currentUser;
            setUserName(u.displayName || u.email || 'Admin');
        }
    }, []);

    // close dropdown on outside click
    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // Handle user logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setDropdownOpen(false);
            navigate('/');
        } catch (err) {
            console.error('Sign out error', err);
        }
    };

    return (
        <nav className="navigation">
            <div className="nav-brand">
                <Monitor className="brand-icon" />
                <span>Smart Grow Admin</span>
            </div>

            <div className="nav-links">
                {navItems.map(({ path, label, Icon }) => (
                    <Link key={path} to={path} className={activePath === path ? 'active' : ''}>
                        {Icon && <Icon size={18} />}
                        {label}
                    </Link>
                ))}
            </div>

            <div className="nav-controls">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="theme-toggle"
                    aria-label="Toggle theme"
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>

                {/* User avatar + dropdown */}
                <div className="user-dropdown" ref={dropdownRef}>
                    <button
                        className="user-avatar"
                        onClick={() => setDropdownOpen((s) => !s)}
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen}
                    >
                        {userName.charAt(0).toUpperCase()}
                    </button>

                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-header">
                                <div className="dropdown-name">{userName.split('@')[0]}</div>
                                <div className="dropdown-email">{userName}</div>
                            </div>
                            <hr />
                            <button className="dropdown-item" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;