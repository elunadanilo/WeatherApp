import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { fetchWeatherByCity } from '../services/weatherApi';

// Mock the API module
jest.mock('../services/weatherApi');

describe('Weather App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the initial UI correctly (input and search button)', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Ingresa una ciudad...');
    const searchButton = screen.getByRole('button', { name: /buscar clima/i });

    expect(inputElement).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('allows the user to type in the input field', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Ingresa una ciudad...');
    
    fireEvent.change(inputElement, { target: { value: 'Madrid' } });
    expect(inputElement.value).toBe('Madrid');
  });

  test('calls API and displays weather info successfully on submit', async () => {
    const mockWeatherData = {
      cityName: 'Madrid, Spain',
      temperature: 25,
      humidity: 40,
      description: 'Clear sky',
    };

    fetchWeatherByCity.mockResolvedValueOnce(mockWeatherData);

    render(<App />);
    const inputElement = screen.getByPlaceholderText('Ingresa una ciudad...');
    const searchButton = screen.getByRole('button', { name: /buscar clima/i });

    fireEvent.change(inputElement, { target: { value: 'Madrid' } });
    fireEvent.click(searchButton);

    // Shows loading state initially (Buscando... is static inner text for pulse-circle)
    expect(screen.getByText('Buscando...')).toBeInTheDocument();

    await waitFor(() => {
      // Data shown
      expect(screen.getByText('Madrid, Spain')).toBeInTheDocument();
      // Look for the temperature (can be 2 instances due to detail block, so we check for display)
      const temps = screen.getAllByText(/25/i);
      expect(temps.length).toBeGreaterThan(0);
      expect(screen.getByText('Clear sky')).toBeInTheDocument();
      // Humidity text
      expect(screen.getByText('40%')).toBeInTheDocument();
    });
  });

  test('displays an error message when the API fails (e.g. invalid city)', async () => {
    const errorMessage = 'Ciudad no encontrada';
    fetchWeatherByCity.mockRejectedValueOnce(new Error(errorMessage));

    render(<App />);
    const inputElement = screen.getByPlaceholderText('Ingresa una ciudad...');
    const searchButton = screen.getByRole('button', { name: /buscar clima/i });

    fireEvent.change(inputElement, { target: { value: 'CiudadInvalida123' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
  
  test('does not call API if input is empty', () => {
    render(<App />);
    const searchButton = screen.getByRole('button', { name: /buscar clima/i });
    
    // Default value is empty, so clicking should not trigger api
    fireEvent.click(searchButton);
    expect(fetchWeatherByCity).not.toHaveBeenCalled();
  });

  test('does not call API if input is only whitespace', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Ingresa una ciudad...');
    const searchButton = screen.getByRole('button', { name: /buscar clima/i });
    
    fireEvent.change(inputElement, { target: { value: '   ' } });
    fireEvent.click(searchButton);
    expect(fetchWeatherByCity).not.toHaveBeenCalled();
  });

  test('displays a fallback error message when the API error has no message', async () => {
    // Mock error without a message property
    fetchWeatherByCity.mockRejectedValueOnce({});

    render(<App />);
    const inputElement = screen.getByPlaceholderText('Ingresa una ciudad...');
    const searchButton = screen.getByRole('button', { name: /buscar clima/i });

    fireEvent.change(inputElement, { target: { value: 'Madrid' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Ocurrió un error al buscar el clima.')).toBeInTheDocument();
    });
  });
});
