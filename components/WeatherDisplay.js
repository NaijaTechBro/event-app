'use client';

import { useState, useEffect } from 'react';

export default function WeatherDisplay({ location }) {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
        
        if (!response.ok) {
          throw new Error(`Weather data fetch failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  if (isLoading) {
    return (
      <div className="weather-container animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-container bg-red-50 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="weather-container">
      <h3 className="font-semibold text-lg mb-2">Current Weather in {location}</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">
            {weather.current.temperature}°C
            <span className="text-4xl ml-2">{weather.current.weatherIcon}</span>
          </p>
          <p className="text-gray-600">{weather.current.weatherDescription}</p>
        </div>
        {weather.daily && (
          <div className="text-right">
            <p className="text-sm">
              <span className="text-red-500">↑</span> {weather.daily.maxTemp}°C
            </p>
            <p className="text-sm">
              <span className="text-blue-500">↓</span> {weather.daily.minTemp}°C
            </p>
          </div>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-600">
        Wind: {weather.current.windspeed} km/h
      </p>
    </div>
  );
}