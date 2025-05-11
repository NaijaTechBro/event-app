'use client';

import { useState, useEffect } from 'react';
import { getWeatherDescription } from '@/lib/weather';

export default function WeatherDisplay({ latitude, longitude }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `/api/weather?latitude=${latitude}&longitude=${longitude}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Unable to load weather information');
      } finally {
        setLoading(false);
      }
    }
    
    fetchWeather();
  }, [latitude, longitude]);
  
  if (loading) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg animate-pulse">
        <p className="text-gray-400">Loading weather...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (!weather) {
    return null;
  }
  
  const { current, hourly } = weather;
  const weatherDescription = getWeatherDescription(current.weather_code);
  
  return (
    <div className="bg-sky-50 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-2">Current Weather</h3>
      <div className="flex items-center">
        <div className="flex-grow">
          <p className="text-xl font-bold">{current.temperature_2m}°{current.temperature_2m_unit}</p>
          <p className="text-gray-700">{weatherDescription}</p>
        </div>
        <div className="weather-icon">
          {getWeatherIcon(current.weather_code)}
        </div>
      </div>
      
      <h4 className="font-semibold mt-4 mb-2">3-Day Forecast</h4>
      <div className="grid grid-cols-3 gap-2">
        {[0, 24, 48].map(idx => (
          <div key={idx} className="text-center">
            <p className="text-sm">{new Date(hourly.time[idx]).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <p className="font-bold">{hourly.temperature_2m[idx]}°{current.temperature_2m_unit}</p>
            <p className="text-xs">{getWeatherDescription(hourly.weather_code[idx])}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to render weather icons
function getWeatherIcon(code) {
  // Simple icon mapping based on weather code
  if (code === 0 || code === 1) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-yellow-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    );
  } else if (code >= 2 && code <= 3) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    );
  } else if (code >= 51 && code <= 67) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    );
  } else if (code >= 71 && code <= 77) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    );
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    );
  }
}