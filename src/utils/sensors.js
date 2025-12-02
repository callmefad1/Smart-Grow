// src/utils/sensorFlyweight.js
class Sensor {
    constructor(sharedState) {
        this.sharedState = sharedState; // Intrinsic state (shared)
    }

    operation(uniqueState) {
        return {
            ...this.sharedState,
            ...uniqueState,
            displayValue: `${this.sharedState.unit}: ${uniqueState.value}${this.sharedState.unitSymbol}`
        };
    }
}

class SensorFactory {
    constructor() {
        this.sensors = {};
    }

    getShared(sharedState) {
        const key = JSON.stringify(sharedState);
        if (!this.sensors[key]) {
            this.sensors[key] = new Sensor(sharedState);
        }
        return this.sensors[key];
    }

    getSharedCount() {
        return Object.keys(this.sensors).length;
    }
}

// Shared intrinsic state for sensors
export const sensorTypes = {
    temperature: {
        type: 'temperature',
        unit: 'Temperature',
        unitSymbol: '°C',
        min: -10, max: 50,
        color: '#ef4444',
        icon: '🌡️',
        autoThreshold: 35
    },
    humidity: {
        type: 'humidity',
        unit: 'Humidity',
        unitSymbol: '%',
        min: 0, max: 100,
        color: '#3b82f6',
        icon: '💧',
        autoThreshold: 80
    },
    light: {
        type: 'light',
        unit: 'Light',
        unitSymbol: 'lux',
        min: 0, max: 1000,
        color: '#f59e0b',
        icon: '💡',
        autoThreshold: 900
    },
    soilmoisture: {
        type: 'soilmoisture',
        unit: 'Soil Moisture',
        unitSymbol: '%',
        min: 0, max: 100,
        color: '#10b981',
        icon: '🌱',
        autoThreshold: 30
    },
    waterlevel: {
        type: 'waterlevel',
        unit: 'Water Level',
        unitSymbol: '%',
        min: 0, max: 100,
        color: '#06b6d4',
        icon: '🚰',
        autoThreshold: 20
    }
};

export const sensorFactory = new SensorFactory();