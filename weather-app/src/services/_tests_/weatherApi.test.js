import axios from 'axios';
import { fetchWeatherByCity } from '../weatherApi';

jest.mock('axios');

describe('weatherApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchWeatherByCity returns formatted weather data on success', async () => {
    const mockGeoResponse = {
      data: {
        results: [
          { name: 'Madrid', country: 'Spain', latitude: 40.4165, longitude: -3.7026 }
        ]
      }
    };

    const mockWeatherResponse = {
      data: {
        current: {
          temperature_2m: 25.4,
          relative_humidity_2m: 40,
          weather_code: 0
        }
      }
    };

    axios.get
      .mockResolvedValueOnce(mockGeoResponse) // first call: geocoding
      .mockResolvedValueOnce(mockWeatherResponse); // second call: weather

    const result = await fetchWeatherByCity('Madrid');

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      cityName: 'Madrid, Spain',
      temperature: 25,
      humidity: 40,
      description: 'Clear sky'
    });
  });

  test('fetchWeatherByCity throws "Ciudad no encontrada" if no results from geocoding', async () => {
    const mockGeoResponse = {
      data: {
        results: [] // empty results
      }
    };

    axios.get.mockResolvedValueOnce(mockGeoResponse);

    await expect(fetchWeatherByCity('UnknownCity')).rejects.toThrow('Ciudad no encontrada');
    expect(axios.get).toHaveBeenCalledTimes(1); 
  });

  test('fetchWeatherByCity throws "Ciudad no encontrada" if results array is missing', async () => {
    const mockGeoResponse = {
      data: {} // no results array
    };

    axios.get.mockResolvedValueOnce(mockGeoResponse);

    await expect(fetchWeatherByCity('UnknownCity2')).rejects.toThrow('Ciudad no encontrada');
  });

  test('fetchWeatherByCity throws general error on API error (e.g. 500)', async () => {
    axios.get.mockRejectedValueOnce(new Error('API failed'));

    await expect(fetchWeatherByCity('Madrid')).rejects.toThrow('Error al obtener los datos del clima');
  });

  test('fetchWeatherByCity returns "Unknown weather" for unmapped weather code', async () => {
    const mockGeoResponse = {
      data: {
        results: [
          { name: 'TestCity', country: 'TestCountry', latitude: 10, longitude: 10 }
        ]
      }
    };

    const mockWeatherResponse = {
      data: {
        current: {
          temperature_2m: 10,
          relative_humidity_2m: 50,
          weather_code: 999 // Unmapped code
        }
      }
    };

    axios.get
      .mockResolvedValueOnce(mockGeoResponse)
      .mockResolvedValueOnce(mockWeatherResponse);

    const result = await fetchWeatherByCity('TestCity');

    expect(result.description).toBe('Unknown weather');
  });

  test('fetchWeatherByCity throws "Ciudad no encontrada" if geoResponse.data.results is null', async () => {
    const mockGeoResponse = {
      data: {
        results: null // results is null
      }
    };

    axios.get.mockResolvedValueOnce(mockGeoResponse);

    await expect(fetchWeatherByCity('NullCity')).rejects.toThrow('Ciudad no encontrada');
  });
});
