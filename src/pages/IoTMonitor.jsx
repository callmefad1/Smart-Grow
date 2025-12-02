// src/components/IoTMonitor.jsx
import React, { useState, useEffect } from 'react';
import { database } from "../config/firebaseConfig";
import { ref, onValue, off, update } from "firebase/database";
import { motion, AnimatePresence } from 'framer-motion';
import { sensorFactory, sensorTypes } from '../utils/sensors'; 
import AutoSettingsForm from '../components/Autosettings/AutoSettingsForm';
import {
    Thermometer,
    Droplets,
    Sun,
    Sprout,
    Waves,
    Fan,
    Settings,
    Play,
    Square,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import '../styles/IoTMonitor.css';

function IoTMonitor() {
    const [sensorData, setSensorData] = useState({});
    const [vanStatus, setVanStatus] = useState(0);
    const [autoSettings, setAutoSettings] = useState({});
    const [loading, setLoading] = useState(false);

    // Real-time data listener
    useEffect(() => {
        const dbRef = ref(database, "iot/data");

        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setSensorData(data.sensors || {});
                setVanStatus(data.van || 0);
                setAutoSettings(data.autoSettings || {});
            }
        });

        return () => off(dbRef);
    }, []);

    // Control VAN
    const controlVan = async (status) => {
        setLoading(true);
        try {
            const updates = {};
            updates['iot/data/van'] = status;
            await update(ref(database), updates);
            setVanStatus(status);
        } catch (error) {
            console.error("Error controlling VAN:", error);
            alert("Error updating VAN status");
        } finally {
            setLoading(false);
        }
    };

    // Get sensor display data using the pattern
    const getSensorDisplay = (sensorType, value) => {
        const shared = sensorFactory.getShared(sensorTypes[sensorType]); // ✅ Updated method call
        return shared.operation({ value });
    };

    const sensorIcons = {
        temperature: Thermometer,
        humidity: Droplets,
        light: Sun,
        soilmoisture: Sprout,
        waterlevel: Waves
    };

    const getStatusColor = (sensorType, value) => {
        const autoValue = autoSettings[`${sensorType}auto`];
        if (autoValue !== undefined && value > autoValue) {
            return '#ef4444'; // Red for above threshold
        }
        return '#10b981'; // Green for normal
    };

    return (
        <motion.div
            className="iot-monitor-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <motion.div
                className="monitor-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="header-content">
                    <Settings className="header-icon" />
                    <h1>IoT Monitoring & Control</h1>
                    <div className="van-status">
                        <Fan className={vanStatus ? 'van-active' : 'van-inactive'} />
                        <span>VAN: {vanStatus ? 'ACTIVE' : 'INACTIVE'}</span>
                    </div>
                </div>
            </motion.div>

            {/* VAN Control */}
            <motion.div
                className="control-section"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h3>VAN Control System</h3>
                <div className="van-controls">
                    <motion.button
                        className={`control-btn active ${vanStatus ? 'enabled' : ''}`}
                        onClick={() => controlVan(1)}
                        disabled={loading || vanStatus === 1}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Play size={20} />
                        Activate VAN
                    </motion.button>

                    <motion.button
                        className={`control-btn deactive ${!vanStatus ? 'enabled' : ''}`}
                        onClick={() => controlVan(0)}
                        disabled={loading || vanStatus === 0}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Square size={20} />
                        Deactivate VAN
                    </motion.button>
                </div>
            </motion.div>

            {/* Sensor Grid */}
            <motion.div
                className="sensors-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {Object.entries(sensorTypes).map(([sensorType, config]) => {
                    const value = sensorData[sensorType] || 0;
                    const displayData = getSensorDisplay(sensorType, value);
                    const IconComponent = sensorIcons[sensorType];
                    const autoValue = autoSettings[`${sensorType}auto`];

                    return (
                        <motion.div
                            key={sensorType}
                            className="sensor-card"
                            whileHover={{ y: -5 }}
                            style={{ borderLeftColor: displayData.color }}
                        >
                            <div className="sensor-header">
                                <IconComponent size={24} color={displayData.color} />
                                <h3>{displayData.unit}</h3>
                                {autoValue !== undefined && (
                                    <div className="auto-indicator" title={`Auto threshold: ${autoValue}${displayData.unitSymbol}`}>
                                        <Settings size={14} />
                                    </div>
                                )}
                            </div>

                            <div className="sensor-value" style={{ color: getStatusColor(sensorType, value) }}>
                                {value}{displayData.unitSymbol}
                            </div>

                            <div className="sensor-range">
                                <span>{displayData.min}{displayData.unitSymbol}</span>
                                <div className="range-bar">
                                    <div
                                        className="range-fill"
                                        style={{
                                            width: `${((value - displayData.min) / (displayData.max - displayData.min)) * 100}%`,
                                            backgroundColor: displayData.color
                                        }}
                                    />
                                </div>
                                <span>{displayData.max}{displayData.unitSymbol}</span>
                            </div>

                            {autoValue !== undefined && (
                                <div className="auto-threshold">
                                    Auto threshold: {autoValue}{displayData.unitSymbol}
                                    {value > autoValue && (
                                        <AlertTriangle size={14} color="#ef4444" />
                                    )}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Auto Settings Form */}
            <AutoSettingsForm
                autoSettings={autoSettings}
                sensorTypes={sensorTypes}
            />
        </motion.div>
    );
}

export default IoTMonitor;