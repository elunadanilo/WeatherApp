import axios from 'axios';

const weatherCodeMap = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 71: 'Slight snow fall',
  75: 'Heavy snow fall', 80: 'Slight rain showers', 95: 'Thunderstorm'
};

export const fetchWeatherByCity = async (city) => {
  try {
    const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`);
    if (!geoRes.data.results || geoRes.data.results.length === 0) throw new Error('Ciudad no encontrada');
    
    const location = geoRes.data.results[0];
    const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`);
    
    const current = weatherRes.data.current;
    return {
      cityName: `${location.name}, ${location.country}`,
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      description: weatherCodeMap[current.weather_code] || 'Unknown weather',
    };
  } catch (error) {
    if (error.message === 'Ciudad no encontrada') throw error;
    throw new Error('Error al obtener los datos del clima');
  }
};
