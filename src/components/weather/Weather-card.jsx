import './weather.css';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { Search, MapPin, RefreshCw } from 'lucide-react';

function Weather() {
  const [weather, setWeather] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const baseUrl = process.env.REACT_APP_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

  const formatWeather = (data) => {
    if (!data) return null;
    const w = data.weather && data.weather[0] ? data.weather[0] : {};
    return {
      city: data.name,
      country: data.sys?.country,
      description: w.description || '',
      icon: w.icon || '',
      temperature: Math.round(data.main?.temp ?? 0),
      feels_like: Math.round(data.main?.feels_like ?? 0),
      humidity: data.main?.humidity ?? 0,
      wind: data.wind?.speed ?? 0,
      timestamp: data.dt ? new Date(data.dt * 1000) : new Date()
    };
  };

  const fetchByCoords = async (lat, lon) => {
    if (!apiKey) {
      setError('OpenWeather API key not set in .env (REACT_APP_OPENWEATHER_API_KEY).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
      if (!res.ok) throw new Error('Failed to fetch weather for location');
      const data = await res.json();
      setWeather(formatWeather(data));
    } catch (err) {
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  const fetchByCity = async (city) => {
    if (!apiKey) {
      setError('OpenWeather API key not set in .env (REACT_APP_OPENWEATHER_API_KEY).');
      return;
    }
    if (!city) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${baseUrl}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('City not found');
        throw new Error('Failed to fetch weather for city');
      }
      const data = await res.json();
      setWeather(formatWeather(data));
      setSearchCity('');
    } catch (err) {
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // try to get user location on mount
    if (!navigator.geolocation) {
      // fallback: do nothing
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // user denied location or unavailable - do nothing
      },
      { maximumAge: 1000 * 60 * 5, timeout: 5000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (searchCity.trim()) fetchByCity(searchCity.trim());
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => setError('Location access denied')
    );
  };

  const iconUrl = (icon) => icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardHeader
        title="Weather"
        subheader="Search city or use current location"
        action={
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              placeholder="City name"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" aria-label="search">
                      <Search size={16} />
                    </IconButton>
                    <IconButton onClick={handleUseLocation} title="Use current location" aria-label="location">
                      <MapPin size={16} />
                    </IconButton>
                    <IconButton onClick={() => weather && fetchByCity(weather.city)} title="Refresh" aria-label="refresh">
                      <RefreshCw size={16} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 220, bgcolor: 'transparent' }}
            />
          </Box>
        }
      />
      <CardContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : weather ? (
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {weather.icon ? (
                <img src={iconUrl(weather.icon)} alt="icon" width={96} height={96} />
              ) : (
                <Box sx={{ width: 96, height: 96, borderRadius: 2, bgcolor: 'grey.100' }} />
              )}
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {weather.temperature}°C
                </Typography>
                <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                  {weather.description || weather.condition}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {weather.city}{weather.country ? `, ${weather.country}` : ''}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', ml: 'auto', minWidth: 220 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Humidity</Typography>
                <Typography variant="h6">{weather.humidity}%</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Wind</Typography>
                <Typography variant="h6">{weather.wind} m/s</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Feels like</Typography>
                <Typography variant="h6">{weather.feels_like}°C</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No weather data. Use the search box or press the location button.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default Weather;