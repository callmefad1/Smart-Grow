// src/components/features/Sidebar/Sidebar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import './Sidebar.css';
import userNavItems from '../../../routes/navItems';
import { auth, signOut } from '../../../config/firebaseConfig';

function Sidebar({ navItems = userNavItems, currentPath, onLogout }) {
    // Prefer injected currentPath (for DIP/testing). If not provided, fall back to useLocation.
    const location = useLocation();
    const navigate = useNavigate();
    const activePath = typeof currentPath === 'string' ? currentPath : location.pathname;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const sidebarRef = useRef(null);
    const toggleBtnRef = useRef(null);

    useEffect(() => {
        // Try to set a friendly user name from Firebase auth if available
        if (auth && auth.currentUser) {
            const u = auth.currentUser;
            setUserName(u.displayName || u.email || 'User');
        }
    }, []);

    // close sidebar on outside click
    useEffect(() => {
        function handleClick(e) {
            // Close sidebar only if clicking outside sidebar AND outside toggle button
            if (
                sidebarRef.current && 
                !sidebarRef.current.contains(e.target) &&
                toggleBtnRef.current &&
                !toggleBtnRef.current.contains(e.target)
            ) {
                setSidebarOpen(false);
            }
        }
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // Handle user logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setSidebarOpen(false);
            if (onLogout) {
                onLogout();
            }
            navigate('/');
        } catch (err) {
            console.error('Sign out error', err);
        }
    };

    // Handle nav item click - close sidebar on mobile
    const handleNavClick = () => {
        setSidebarOpen(false);
    };

    // Render sidebar
    return (
        <>
            {/* Hamburger Toggle Button - Only on Mobile */}
            <button 
                ref={toggleBtnRef}
                className="sidebar-toggle-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Responsive Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
                <div className="sidebar-header">
                    
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(({ path, label, Icon }) => (
                        <Link 
                            key={path} 
                            to={path} 
                            className={`sidebar-link ${activePath === path ? 'active' : ''}`}
                            onClick={handleNavClick}
                            data-tooltip={label}
                        >
                            {Icon && <Icon size={20} />}
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar-small">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <p className="user-name">{userName.split('@')[0]}</p>
                            <p className="user-email">{userName}</p>
                        </div>
                    </div>
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        aria-label="Logout"
                        title="Logout"
                        data-tooltip="Logout"
                    >
                        <LogOut size={18} />
                        <span className="logout-text">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                />
            )}
        </>
    );
}

export default Sidebar;
