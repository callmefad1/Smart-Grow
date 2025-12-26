import { motion } from 'framer-motion';
import {
    CloudRain,
    Droplets,
    Thermometer,
    Gauge,
    Battery,
    Sun
} from 'lucide-react';
import './SensorCard.css';

const SensorCard = ({ sensor, cardVariants }) => (
    <motion.div 
        variants={cardVariants}
        className={`sensor-card ${!sensor.isOnline ? 'offline' : ''}`}
    >
        {/* Card Header */}
        <div className="sensor-header">
            <div className="sensor-name">
                <h3>{sensor.name}</h3>
                <div className={`status-indicator ${sensor.isOnline ? 'online' : 'offline'}`}>
                    <span className="status-dot"></span>
                    <span>{sensor.isOnline ? 'Online' : 'Offline'}</span>
                </div>
            </div>
            <div className="sensor-type">
                <span className="type-badge">
                    {sensor.type === 'iot' ? 'IoT Device' : 'Main Sensor'}
                </span>
            </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
            {/* Humidity */}
            <div className="metric-item">
                <div className="metric-icon humidity-icon">
                    <CloudRain size={20} />
                </div>
                <div className="metric-content">
                    <span className="metric-label">Humidity</span>
                    <span className="metric-value">
                        {sensor.isOnline ? sensor.humidity || 0 : '--'}
                        <span className="metric-unit">%</span>
                    </span>
                </div>
                <div className="metric-bar">
                    <div 
                        className="metric-bar-fill humidity-fill" 
                        style={{ width: `${sensor.isOnline ? sensor.humidity || 0 : 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Soil Moisture */}
            <div className="metric-item">
                <div className="metric-icon soil-icon">
                    <Droplets size={20} />
                </div>
                <div className="metric-content">
                    <span className="metric-label">Soil Moisture</span>
                    <span className="metric-value">
                        {sensor.isOnline ? sensor.soilMoisture || 0 : '--'}
                        <span className="metric-unit">%</span>
                    </span>
                </div>
                <div className="metric-bar">
                    <div 
                        className="metric-bar-fill soil-fill" 
                        style={{ width: `${sensor.isOnline ? sensor.soilMoisture || 0 : 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Temperature */}
            <div className="metric-item">
                <div className="metric-icon temp-icon">
                    <Thermometer size={20} />
                </div>
                <div className="metric-content">
                    <span className="metric-label">Temperature</span>
                    <span className="metric-value">
                        {sensor.isOnline ? sensor.temperature || 0 : '--'}
                        <span className="metric-unit">°C</span>
                    </span>
                </div>
                <div className="metric-bar">
                    <div 
                        className="metric-bar-fill temp-fill" 
                        style={{ width: `${sensor.isOnline ? Math.min((sensor.temperature || 0) * 2, 100) : 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Water Level */}
            <div className="metric-item">
                <div className="metric-icon water-icon">
                    <Gauge size={20} />
                </div>
                <div className="metric-content">
                    <span className="metric-label">Water Level</span>
                    <span className="metric-value">
                        {sensor.isOnline ? sensor.waterLevel || 0 : '--'}
                        <span className="metric-unit">%</span>
                    </span>
                </div>
                <div className="metric-bar">
                    <div 
                        className="metric-bar-fill water-fill" 
                        style={{ width: `${sensor.isOnline ? sensor.waterLevel || 0 : 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Battery Status */}
            <div className="metric-item">
                <div className="metric-icon battery-icon">
                    <Battery size={20} />
                </div>
                <div className="metric-content">
                    <span className="metric-label">Battery</span>
                    <span className="metric-value">
                        {sensor.isOnline ? sensor.battery || 0 : '--'}
                        <span className="metric-unit">%</span>
                    </span>
                </div>
                <div className="metric-bar">
                    <div 
                        className="metric-bar-fill battery-fill" 
                        style={{ width: `${sensor.isOnline ? sensor.battery || 0 : 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Light Intensity */}
            <div className="metric-item">
                <div className="metric-icon light-icon">
                    <Sun size={20} />
                </div>
                <div className="metric-content">
                    <span className="metric-label">Light Intensity</span>
                    <span className="metric-value">
                        {sensor.isOnline ? sensor.lightIntensity || 0 : '--'}
                        <span className="metric-unit">lux</span>
                    </span>
                </div>
                <div className="metric-bar">
                    <div 
                        className="metric-bar-fill light-fill" 
                        style={{ width: `${sensor.isOnline ? Math.min((sensor.lightIntensity || 0) / 10, 100) : 0}%` }}
                    ></div>
                </div>
            </div>
        </div>

        {/* Card Footer */}
        <div className="sensor-footer">
            <span className="sensor-id">
                ID: {sensor.id}
            </span>
            <span className="last-reading">
                Last update: {sensor.lastUpdate ? sensor.lastUpdate : 'N/A'}
            </span>
        </div>
    </motion.div>
);

export default SensorCard;
