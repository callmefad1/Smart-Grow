// src/components/features/weather/weatherPage.jsx
import React, { useState, useEffect } from 'react';
import {
    WbSunny, Opacity, Air, Compress, Visibility, Thermostat,
    MyLocation, Search, Refresh, WaterDrop, Umbrella, Navigation
} from '@mui/icons-material';
import './weatherPage.css';

const WeatherCard = ({ title, value, unit, icon, color = '#2196f3', trend = 'stable' }) => {
    return (
        <div className="weather-metric-card" style={{ '--card-color': color }}>
            <div className="weather-metric-header">
                <div className="weather-metric-icon-wrapper">
                    {React.cloneElement(icon, { className: 'weather-metric-icon' })}
                </div>
                <span className="weather-metric-title">{title}</span>
                {trend !== 'stable' && (
                    <span className={`weather-metric-trend ${trend}`}>
                        {trend === 'up' ? '↑' : '↓'}
                    </span>
                )}
            </div>
            <div className="weather-metric-value">
                {value}
                {unit && <span className="weather-metric-unit">{unit}</span>}
            </div>
        </div>
    );
};

const ForecastCard = ({ day, isToday = false }) => {
    return (
        <div className={`forecast-card ${isToday ? 'forecast-today' : ''}`}>
            <div className="forecast-day">
                {isToday ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="forecast-date">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>

            <div className="forecast-icon-wrapper">
                <img
                    src={`https:${day.day.condition.icon}`}
                    alt={day.day.condition.text}
                    className="forecast-icon"
                />
            </div>

            <div className="forecast-condition">{day.day.condition.text}</div>

            <div className="forecast-temps">
                <div className="forecast-temp-item">
                    <span className="forecast-temp-label">High</span>
                    <span className="forecast-temp-high">{Math.round(day.day.maxtemp_c)}°C</span>
                </div>
                <div className="forecast-temp-divider"></div>
                <div className="forecast-temp-item">
                    <span className="forecast-temp-label">Low</span>
                    <span className="forecast-temp-low">{Math.round(day.day.mintemp_c)}°C</span>
                </div>
            </div>

            <div className="forecast-details">
                <div className="forecast-detail-chip">
                    <Opacity className="forecast-detail-icon" />
                    <span>{day.day.avghumidity}%</span>
                </div>
                <div className="forecast-detail-chip">
                    <Air className="forecast-detail-icon" />
                    <span>{day.day.maxwind_kph}km</span>
                </div>
            </div>

            {day.day.daily_chance_of_rain > 0 && (
                <div className="forecast-rain">
                    <div className="forecast-rain-bar">
                        <div 
                            className="forecast-rain-fill" 
                            style={{ width: `${day.day.daily_chance_of_rain}%` }}
                        ></div>
                    </div>
                    <span className="forecast-rain-text">
                        {day.day.daily_chance_of_rain}% rain chance
                    </span>
                </div>
            )}
        </div>
    );
};

const WeatherPage = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [usingGeolocation, setUsingGeolocation] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWeatherData = async (query = 'New York') => {
        setLoading(true);
        setError('');
        try {
            const API_KEY = 'e701105b175648c1b51184723251811';
            const response = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=5&aqi=no&alerts=yes`
            );
            const data = await response.json();

            if (data.error) {
                setError(data.error.message);
                setWeatherData(null);
                setForecastData(null);
            } else {
                setWeatherData({
                    temperature: Math.round(data.current.temp_c),
                    humidity: data.current.humidity,
                    pressure: data.current.pressure_mb,
                    windSpeed: Math.round(data.current.wind_kph),
                    windDirection: data.current.wind_dir,
                    windDegree: data.current.wind_degree,
                    feelsLike: Math.round(data.current.feelslike_c),
                    visibility: data.current.vis_km,
                    uvIndex: data.current.uv,
                    condition: data.current.condition.text,
                    icon: data.current.condition.icon,
                    location: `${data.location.name}, ${data.location.country}`,
                    sunrise: data.forecast.forecastday[0].astro.sunrise,
                    sunset: data.forecast.forecastday[0].astro.sunset,
                    precipitation: data.current.precip_mm,
                    lastUpdated: data.current.last_updated
                });
                setForecastData(data.forecast.forecastday);
                setLocation(data.location.name);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Failed to fetch weather data. Please try again.');
            setWeatherData(null);
            setForecastData(null);
        }
        setLoading(false);
        setRefreshing(false);
    };

    const getCurrentLocation = () => {
        setUsingGeolocation(true);
        setLoading(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(`${latitude},${longitude}`);
                setUsingGeolocation(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                setError('Unable to retrieve your location');
                setLoading(false);
                setUsingGeolocation(false);
            }
        );
    };

    const handleRefresh = () => {
        setRefreshing(true);
        if (location.trim()) {
            fetchWeatherData(location);
        } else {
            getCurrentLocation();
        }
    };

    useEffect(() => {
        getCurrentLocation();

        const interval = setInterval(() => {
            handleRefresh();
        }, 15 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (location.trim()) {
            fetchWeatherData(location);
        }
    };

    const weatherCards = weatherData ? [
        { title: 'Temperature', value: weatherData.temperature, unit: '°C', icon: <Thermostat />, color: '#f44336', trend: 'stable' },
        { title: 'Feels Like', value: weatherData.feelsLike, unit: '°C', icon: <WbSunny />, color: '#ff9800', trend: weatherData.feelsLike > weatherData.temperature ? 'up' : 'down' },
        { title: 'Humidity', value: weatherData.humidity, unit: '%', icon: <Opacity />, color: '#2196f3', trend: weatherData.humidity > 70 ? 'up' : 'stable' },
        { title: 'Wind Speed', value: weatherData.windSpeed, unit: 'km/h', icon: <Air />, color: '#4caf50', trend: weatherData.windSpeed > 20 ? 'up' : 'stable' },
        { title: 'Pressure', value: weatherData.pressure, unit: 'mb', icon: <Compress />, color: '#9c27b0', trend: 'stable' },
        { title: 'Visibility', value: weatherData.visibility, unit: 'km', icon: <Visibility />, color: '#607d8b', trend: weatherData.visibility < 10 ? 'down' : 'stable' },
        { title: 'UV Index', value: weatherData.uvIndex, unit: '', icon: <WbSunny />, color: '#ff5722', trend: weatherData.uvIndex > 5 ? 'up' : 'stable' },
        { title: 'Precipitation', value: weatherData.precipitation || 0, unit: 'mm', icon: <Umbrella />, color: '#00bcd4', trend: weatherData.precipitation > 0 ? 'up' : 'stable' }
    ] : [];

    const getWeatherImpact = () => {
        if (!weatherData) return { color: '#4CAF50', text: 'Optimal for farming' };
        const temp = weatherData.temperature;
        const humidity = weatherData.humidity;
        const rain = weatherData.precipitation || 0;
        if (temp < 5 || temp > 35) return { color: '#F44336', text: 'Poor conditions' };
        if (humidity > 85) return { color: '#FF9800', text: 'High humidity risk' };
        if (rain > 10) return { color: '#2196F3', text: 'Rain expected' };
        return { color: '#4CAF50', text: 'Excellent conditions' };
    };

    const impact = getWeatherImpact();

    return (
        <div className="weather-page">
            {/* Search Section */}
            <div className="weather-search-card">
                <div className="weather-search-header">
                    <h2 className="weather-search-title">🌤️ Farm Weather Forecast</h2>
                    <button 
                        className={`weather-refresh-btn ${refreshing ? 'refreshing' : ''}`}
                        onClick={handleRefresh}
                        disabled={loading || refreshing}
                    >
                        <Refresh />
                    </button>
                </div>

                <form onSubmit={handleSearch} className="weather-search-form">
                    <input
                        type="text"
                        className="weather-search-input"
                        placeholder="Enter city name or zip code"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="weather-search-submit"
                        disabled={loading || !location.trim()}
                    >
                        <Search />
                        {loading ? 'Loading...' : 'Search'}
                    </button>
                    <button 
                        type="button"
                        className="weather-location-btn"
                        onClick={getCurrentLocation}
                        disabled={loading || usingGeolocation}
                    >
                        <MyLocation />
                        {usingGeolocation ? 'Detecting...' : 'My Location'}
                    </button>
                </form>
            </div>

            {/* Error State */}
            {error && (
                <div className="weather-error-card">
                    <span className="weather-error-icon">⚠️</span>
                    <span className="weather-error-text">Error: {error}</span>
                </div>
            )}

            {weatherData && (
                <>
                    {/* Current Weather Hero */}
                    <div className="weather-hero">
                        <div className="weather-hero-content">
                            <div className="weather-hero-left">
                                <h2 className="weather-location">{weatherData.location}</h2>
                                <p className="weather-last-updated">
                                    Last updated: {new Date(weatherData.lastUpdated).toLocaleTimeString()}
                                </p>

                                <div className="weather-current-display">
                                    <div className="weather-current-icon">
                                        <img
                                            src={`https:${weatherData.icon}`}
                                            alt={weatherData.condition}
                                        />
                                    </div>
                                    <div className="weather-current-temp">
                                        <span className="weather-temp-value">{weatherData.temperature}°C</span>
                                        <span className="weather-condition">{weatherData.condition}</span>
                                    </div>
                                </div>

                                <div className="weather-impact-chip" style={{ '--impact-color': impact.color }}>
                                    {impact.text}
                                </div>
                            </div>

                            <div className="weather-hero-right">
                                <div className="weather-details-grid">
                                    <div className="weather-detail-item">
                                        <span className="weather-detail-label">Feels Like</span>
                                        <span className="weather-detail-value">{weatherData.feelsLike}°C</span>
                                    </div>
                                    <div className="weather-detail-item">
                                        <span className="weather-detail-label">Wind</span>
                                        <span className="weather-detail-value">
                                            {weatherData.windSpeed} km/h
                                            <Navigation 
                                                className="weather-wind-icon"
                                                style={{ transform: `rotate(${weatherData.windDegree}deg)` }}
                                            />
                                        </span>
                                    </div>
                                    <div className="weather-detail-item">
                                        <span className="weather-detail-label">Sunrise</span>
                                        <span className="weather-detail-value sunrise">{weatherData.sunrise}</span>
                                    </div>
                                    <div className="weather-detail-item">
                                        <span className="weather-detail-label">Sunset</span>
                                        <span className="weather-detail-value sunset">{weatherData.sunset}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weather Metrics Grid */}
                    <h3 className="weather-section-title">📊 Weather Metrics</h3>
                    <div className="weather-metrics-grid">
                        {weatherCards.map((card, index) => (
                            <WeatherCard key={index} {...card} />
                        ))}
                    </div>

                    {/* 5-Day Forecast */}
                    <h3 className="weather-section-title">📅 5-Day Forecast</h3>
                    <div className="weather-forecast-grid">
                        {forecastData && forecastData.map((day, index) => (
                            <ForecastCard key={index} day={day} isToday={index === 0} />
                        ))}
                    </div>

                    {/* Farming Recommendations */}
                    <div className="farming-recommendations">
                        <h3 className="farming-title">🌱 Farming Recommendations</h3>
                        <div className="farming-grid">
                            <div className="farming-card irrigation">
                                <div className="farming-card-header">
                                    <WaterDrop className="farming-card-icon" />
                                    <span className="farming-card-title">Irrigation</span>
                                </div>
                                <p className="farming-card-text">
                                    {weatherData.precipitation > 5
                                        ? 'Rain expected. Delay irrigation.'
                                        : 'No rain forecasted. Proceed with scheduled irrigation.'}
                                </p>
                            </div>
                            <div className="farming-card sun">
                                <div className="farming-card-header">
                                    <WbSunny className="farming-card-icon" />
                                    <span className="farming-card-title">Sun Exposure</span>
                                </div>
                                <p className="farming-card-text">
                                    {weatherData.uvIndex > 6
                                        ? 'High UV index. Consider shade protection.'
                                        : 'Moderate sun exposure. Good for plant growth.'}
                                </p>
                            </div>
                            <div className="farming-card temperature">
                                <div className="farming-card-header">
                                    <Thermostat className="farming-card-icon" />
                                    <span className="farming-card-title">Temperature</span>
                                </div>
                                <p className="farming-card-text">
                                    {weatherData.temperature > 30
                                        ? 'High temperature. Increase watering frequency.'
                                        : 'Optimal temperature range for most crops.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Loading State */}
            {loading && !weatherData && (
                <div className="weather-loading">
                    <div className="weather-loading-spinner"></div>
                    <h3 className="weather-loading-title">Loading Weather Data...</h3>
                    <p className="weather-loading-text">Fetching latest forecasts for your farm</p>
                </div>
            )}
        </div>
    );
};

export default WeatherPage;