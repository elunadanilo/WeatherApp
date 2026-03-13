import React, { useState } from 'react';
import { Search, Droplets, Thermometer, Wind } from 'lucide-react';
import { fetchWeatherByCity } from './services/weatherApi';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al buscar el clima.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="weather-widget">
        
        <form onSubmit={handleSearch} className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Ingresa una ciudad..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-button" 
            disabled={loading}
            aria-label="Buscar clima"
          >
            <Search size={20} />
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="pulse-circle">Buscando...</div>
          </div>
        )}

        {weather && !loading && !error && (
          <div className="weather-info">
            <h2 className="city-name">{weather.cityName}</h2>
            
            <div className="temperature">
              {weather.temperature}
              <span className="temperature-unit">°C</span>
            </div>

            <p className="weather-description">{weather.description}</p>
            
            <div className="weather-details">
              <div className="detail-item">
                <Thermometer className="detail-icon" size={24} />
                <div className="detail-text">
                  <span className="detail-label">Temp</span>
                  <span className="detail-value">{weather.temperature}°C</span>
                </div>
              </div>

              <div className="detail-item">
                <Droplets className="detail-icon" size={24} />
                <div className="detail-text">
                  <span className="detail-label">Humedad</span>
                  <span className="detail-value">{weather.humidity}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
