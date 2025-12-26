// src/components/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { database, auth } from '../../config/firebaseConfig';
import { ref, onValue, off } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import {
    Activity,
    RefreshCw,
    Wifi,
    WifiOff
} from 'lucide-react';
import SensorCard from '../../components/sensorDisplay/SensorCard';
import WeatherPage from '../../components/features/weather/weatherPage';
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState({
        sensors: []
    });
    const [isConnected, setIsConnected] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Listen for auth state to get current user's UID
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (!user) {
                // if not logged in, clear sensors and stop loading
                setData({ sensors: [] });
                setLoading(false);
                setIsConnected(false);
            }
        });
        return () => unsub();
    }, []);

    // Listen to user's iot data
    useEffect(() => {
        if (!currentUser) return;

        const userIotRef = ref(database, `users/${currentUser.uid}/iot`);

        const handleUserIot = (snapshot) => {
            const val = snapshot.val();
            const sensors = [];

            if (!val) {
                setData({ sensors });
                setLoading(false);
                setIsConnected(true);
                setLastUpdate(new Date());
                return;
            }

            // Conversion factors (adjustable)
            const SOIL_MAX = 1500; // raw max for soil sensor (tweak to match your hardware)
            const WATER_MAX = 200; // raw max for water level sensor

            // Case A: structure users/{uid}/iot/data (single sensor fields)
            if (val.data && typeof val.data === 'object') {
                const d = val.data;
                const soilRaw = d.soilmoisture ?? d.soilMoisture ?? 0;
                const soilPercent = Math.round((soilRaw / SOIL_MAX) * 100);
                const waterRaw = d.waterlevel ?? d.waterLevel ?? 0;
                const waterPercent = Math.round((waterRaw / WATER_MAX) * 100);

                const last = d.lastUpdate ? Number(d.lastUpdate) : Date.now();

                sensors.push({
                    id: 'iot_data',
                    name: 'IoT Data',
                    type: 'iot',
                    humidity: d.humidity ?? 0,
                    soilMoisture: Math.max(0, Math.min(100, soilPercent)),
                    temperature: d.temperature ?? 0,
                    waterLevel: Math.max(0, Math.min(100, waterPercent)),
                    battery: d.battery ?? 0,
                    lightIntensity: d.lightintensity ?? d.lightIntensity ?? 0,
                    lastUpdate: last,
                    isOnline: true,
                    highlight: true
                });
            } else {
                // Case B: multiple sensor nodes under iot (e.g., iot/{sensorId}: { data: {...} } or direct fields)
                Object.entries(val).forEach(([key, node]) => {
                    const dataNode = (node && node.data) ? node.data : node;
                    if (!dataNode) return;

                    const soilRaw = dataNode.soilmoisture ?? dataNode.soilMoisture ?? 0;
                    const soilPercent = Math.round((soilRaw / SOIL_MAX) * 100);
                    const waterRaw = dataNode.waterlevel ?? dataNode.waterLevel ?? 0;
                    const waterPercent = Math.round((waterRaw / WATER_MAX) * 100);

                    const last = dataNode.lastUpdate ? Number(dataNode.lastUpdate) : Date.now();
                    const isOnline = dataNode.lastUpdate ?
                        (Date.now() - new Date(last).getTime() < 300000) : true;

                    sensors.push({
                        id: key,
                        name: dataNode.name || `IoT ${key}`,
                        type: 'iot',
                        humidity: dataNode.humidity ?? 0,
                        soilMoisture: Math.max(0, Math.min(100, soilPercent)),
                        temperature: dataNode.temperature ?? 0,
                        waterLevel: Math.max(0, Math.min(100, waterPercent)),
                        battery: dataNode.battery ?? 0,
                        lightIntensity: dataNode.lightintensity ?? dataNode.lightIntensity ?? 0,
                        lastUpdate: last,
                        isOnline,
                        highlight: (key === 'data')
                    });
                });
            }

            setData({ sensors });
            setLastUpdate(new Date());
            setIsConnected(true);
            setLoading(false);
        };

        const handleError = (err) => {
            console.error('User iot listen error:', err);
            setIsConnected(false);
            setLoading(false);
        };

        onValue(userIotRef, handleUserIot, handleError);

        return () => {
            off(userIotRef, 'value', handleUserIot);
        };
    }, [currentUser]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <RefreshCw className="loading-spinner" size={48} />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="modern-dashboard">
            {/* Dashboard Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <Activity size={32} className="header-icon" />
                        <div className="header-text">
                            <h1>Farm Monitor</h1>
                            <p>Real-time sensor network</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className={`connection-status ${isConnected ? 'online' : 'offline'}`}>
                            {isConnected ? <Wifi size={18} /> : <WifiOff size={18} />}
                            <span>{isConnected ? 'Connected' : 'Offline'}</span>
                        </div>
                        <div className="last-update">
                            <span>Updated {formatTime(lastUpdate)}</span>
                        </div>
                        <div className="sensors-count">
                            <span>{data.sensors.length} sensors active</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Weather Section */}
            <div className="dashboard-weather-section">
                <WeatherPage />
            </div>

            
            {/* Sensors Grid */}
            <motion.div 
                className="sensors-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {data.sensors.length > 0 ? (
                    data.sensors.map((sensor) => (
                        <SensorCard 
                            key={sensor.id}
                            sensor={{ ...sensor, lastUpdate: sensor.lastUpdate ? formatDetailedTime(sensor.lastUpdate) : 'N/A' }}
                            cardVariants={cardVariants}
                        />
                    ))
                ) : (
                    <motion.div 
                        variants={cardVariants}
                        className="no-data-card"
                    >
                        <div className="no-data-content">
                            <Activity size={48} />
                            <h3>No Sensors Found</h3>
                            <p>Connect your sensors to see data here</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

// Helper functions
const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    } catch {
        return 'N/A';
    }
};

const formatDetailedTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'N/A';
    }
};

export default Dashboard;