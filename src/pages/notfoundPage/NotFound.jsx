// src/components/pages/notfoundpage/NotFound.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Home } from 'lucide-react';
import './notfound.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <motion.div
                className="notfound-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                    <AlertCircle size={80} className="notfound-icon" />
                </motion.div>
                
                <h1>404 - Page Not Found</h1>
                <p>Sorry, the page you're looking for doesn't exist.</p>
                
                <button
                    className="btn-home"
                    onClick={() => navigate('/dashboard')}
                >
                    <Home size={20} />
                    Go to Dashboard
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;
