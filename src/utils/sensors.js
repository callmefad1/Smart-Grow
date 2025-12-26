// Sensor utility functions for user dashboard
export const sensorTypes = {
    TEMPERATURE: 'temperature',
    HUMIDITY: 'humidity',
    WATER_LEVEL: 'waterLevel',
    BATTERY: 'battery',
    WEATHER: 'weather'
};

export const getSensorStatus = (value, type) => {
    switch(type) {
        case sensorTypes.TEMPERATURE:
            if (value < 0 || value > 40) return 'critical';
            if (value < 10 || value > 35) return 'warning';
            return 'normal';
        case sensorTypes.HUMIDITY:
            if (value < 20 || value > 90) return 'critical';
            if (value < 30 || value > 80) return 'warning';
            return 'normal';
        case sensorTypes.WATER_LEVEL:
            if (value < 10) return 'critical';
            if (value < 25) return 'warning';
            return 'normal';
        case sensorTypes.BATTERY:
            if (value < 10) return 'critical';
            if (value < 25) return 'warning';
            return 'normal';
        default:
            return 'normal';
    }
};

export const formatSensorValue = (value, type) => {
    switch(type) {
        case sensorTypes.TEMPERATURE:
            return `${value}°C`;
        case sensorTypes.HUMIDITY:
            return `${value}%`;
        case sensorTypes.WATER_LEVEL:
            return `${value}%`;
        case sensorTypes.BATTERY:
            return `${value}%`;
        default:
            return value;
    }
};

export const getStatusColor = (status) => {
    switch(status) {
        case 'critical':
            return '#ef4444';
        case 'warning':
            return '#f59e0b';
        case 'normal':
            return '#10b981';
        default:
            return '#6b7280';
    }
};
