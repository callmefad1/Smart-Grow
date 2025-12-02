// src/components/RealtimeDashboard.jsx
import  { useState, useEffect } from 'react';
import { database } from '../config/firebaseConfig'; // Changed from 'db' to 'database'
import { ref, onValue, off } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Users,
    TrendingUp,
    AlertCircle,
    RefreshCw,
    Shield,
    Database,
    Eye,
    Edit,
    ArrowRight
} from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState({});
    const [isConnected, setIsConnected] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const dataRef = ref(database, '/'); // Changed from 'db' to 'database'

        const handleDataChange = (snapshot) => {
            const newData = snapshot.val();
            setData(newData || {});
            setLastUpdate(new Date());
            setIsConnected(true);
            setLoading(false);
        };

        const handleError = (error) => {
            console.error('Database error:', error);
            setIsConnected(false);
            setLoading(false);
        };

        onValue(dataRef, handleDataChange, handleError);

        return () => {
            off(dataRef, 'value', handleDataChange);
        };
    }, []);

    

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <RefreshCw size={40} />
                </motion.div>
                <p>Connecting to database...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <motion.header
                className="dashboard-header"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="header-content">
                    <div className="header-title">
                        <Database className="header-icon" />
                        <div>
                            <h1>Firebase Dashboard</h1>
                            <p className="header-subtitle">Real-time Data Monitoring</p>
                        </div>
                    </div>
                    <div className="header-status">
                        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                            <div className="status-dot"></div>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </div>
                        <div className="last-update">
                            <RefreshCw size={14} />
                            Last update: {lastUpdate.toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Quick Actions */}
            <motion.div
                className="quick-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <motion.div
                        className="action-card"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/write'}
                    >
                        <Edit className="action-icon" />
                        <span>Add New Data</span>
                        <ArrowRight className="arrow-icon" />
                    </motion.div>

                    <motion.div
                        className="action-card"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/read'}
                    >
                        <Eye className="action-icon" />
                        <span>View All Data</span>
                        <ArrowRight className="arrow-icon" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div
                className="metrics-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="metric-card" variants={itemVariants}>
                    <div className="metric-icon sensors">
                        <TrendingUp />
                    </div>
                    <div className="metric-content">
                        <h3>Total Sensors</h3>
                        <p className="metric-value">1</p>
                        <span className="metric-trend">In database</span>
                    </div>
                </motion.div>

                <motion.div className="metric-card" variants={itemVariants}>
                    <div className="metric-icon users">
                        <Users />
                    </div>
                    <div className="metric-content">
                        <h3>Total Users</h3>
                        <p className="metric-value"> 12 </p>
                        <span className="metric-trend">Registered</span>
                    </div>
                </motion.div>

                <motion.div className="metric-card" variants={itemVariants}>
                    <div className="metric-icon activity">
                        <Activity />
                    </div>
                    <div className="metric-content">
                        <h3>Active Sessions</h3>
                        <p className="metric-value">5</p>
                        <span className="metric-trend">Live</span>
                    </div>
                </motion.div>

                <motion.div className="metric-card" variants={itemVariants}>
                    <div className="metric-icon health">
                        <Shield />
                    </div>
                    <div className="metric-content">
                        <h3>System Health</h3>
                        <p className="metric-value">96%</p>
                        <div className="health-bar">
                            <div
                                className="health-progress"
                                style={{ width: "96%" }}
                            ></div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Data Preview */}
            <motion.div
                className="data-preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="section-header">
                    <h2>Data Overview</h2>
                    <div className="data-count">
                        {Object.keys(data).length > 0 ? `${Object.keys(data).length} collections` : 'No data'}
                    </div>
                </div>

                <div className="preview-cards">
                    {Object.keys(data).length === 0 ? (
                        <div className="empty-state">
                            <Database size={48} />
                            <h3>No data available</h3>
                            <p>Start by adding some data to your Firebase database</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {Object.entries(data).slice(0, 6).map(([key, value], index) => (
                                <motion.div
                                    key={key}
                                    className="preview-card"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="preview-header">
                                        <h3>{key}</h3>
                                        <span className="item-count">
                      {typeof value === 'object' ? Object.keys(value).length : 1} items
                    </span>
                                    </div>
                                    <div className="preview-content">
                                        {typeof value === 'object' ? (
                                            <div className="nested-data">
                                                {Object.entries(value).slice(0, 3).map(([subKey, subValue]) => (
                                                    <div key={subKey} className="nested-item">
                                                        <span className="nested-key">{subKey}:</span>
                                                        <span className="nested-value">
                              {typeof subValue === 'object' ? 'Object' : String(subValue).substring(0, 30)}
                            </span>
                                                    </div>
                                                ))}
                                                {Object.keys(value).length > 3 && (
                                                    <div className="more-items">+{Object.keys(value).length - 3} more</div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="simple-value">{String(value)}</div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>

            {/* Database Status */}
            <motion.div
                className="status-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <div className="status-card">
                    <div className="status-info">
                        <h3>Database Status</h3>
                        <div className="status-details">
                            <div className="status-item">
                                <span className="status-label">Connection:</span>
                                <span className={`status-value ${isConnected ? 'connected' : 'disconnected'}`}>
                  {isConnected ? 'Active' : 'Offline'}
                </span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">Last Sync:</span>
                                <span className="status-value">{lastUpdate.toLocaleString()}</span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">Total Collections:</span>
                                <span className="status-value">{Object.keys(data).length}</span>
                            </div>
                        </div>
                    </div>
                    <div className="status-visual">
                        <div className={`status-indicator ${isConnected ? 'pulse' : ''}`}>
                            {isConnected ? '✓' : '✗'}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;