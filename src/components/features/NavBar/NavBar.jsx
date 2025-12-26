// src/components/features/NavBar/NavBar.jsx
import { auth, signOut } from '../../../config/firebaseConfig';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import './NavBar.css';
import { User, Settings, HelpCircle, LogOut, Monitor } from 'lucide-react';

function NavBar({ darkMode, setDarkMode }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Try to set a friendly user name from Firebase auth if available
        if (auth && auth.currentUser) {
            const u = auth.currentUser;
            setUserName(u.displayName || u.email || 'User');
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

    // Render navbar only
    return (
      <>
        {/* Top Navigation Bar */}
        <nav className="navigation">
          <div className="nav-brand">
            <Monitor className="brand-icon" />
            <span>Smart Grow</span>
          </div>

          <div className="nav-controls">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* User avatar + dropdown */}
            <div className="user-dropdown" ref={dropdownRef}>
              <button
                className="user-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                {userName.charAt(0).toUpperCase()}
              </button>

              {dropdownOpen && (
                // <div className="dropdown-menu">
                //     <div className="dropdown-header">
                //         <p className="dropdown-name">{userName.split('@')[0]}</p>
                //         <p className="dropdown-email">{userName}</p>
                //     </div>
                //     <hr />
                //     <button className="dropdown-item" onClick={handleLogout}>
                //         Logout
                //     </button>
                // </div>

                <div className="dropdown-menu">
                  {/* Header with user info */}
                  <div className="dropdown-header">
                    <div className="dropdown-user-avatar">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <p className="dropdown-name">{userName.split("@")[0]}</p>
                    <p className="dropdown-email">{userName}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="dropdown-items">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        /* Navigate to profile */
                      }}
                    >
                      <User size={18} />
                      <span>My Profile</span>
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => {
                        /* Navigate to settings */
                      }}
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => {
                        /* Navigate to help */
                      }}
                    >
                      <HelpCircle size={18} />
                      <span>Help & Support</span>
                    </button>

                    <div className="dropdown-divider"></div>

                    <button
                      className="dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </>
    );
}

export default NavBar;