// Map of location names to coordinates for the sample locations
const locationCoordinates = {
  'San Francisco, CA': { latitude: 37.7749, longitude: -122.4194 },
  'New York, NY': { latitude: 40.7128, longitude: -74.0060 },
  'Austin, TX': { latitude: 30.2672, longitude: -97.7431 },
  'Seattle, WA': { latitude: 47.6062, longitude: -122.3321 },
  'Chicago, IL': { latitude: 41.8781, longitude: -87.6298 },
  'Los Angeles, CA': { latitude: 34.0522, longitude: -118.2437 },
  'Boston, MA': { latitude: 42.3601, longitude: -71.0589 },
  'Miami, FL': { latitude: 25.7617, longitude: -80.1918 }
};

/**
 * Get coordinates for a location name
 * @param {string} location - Location name (e.g., "San Francisco, CA")
 * @returns {Object|null} - Object with latitude and longitude or null if not found
 */
export const getCoordinatesForLocation = (location) => {
  // First try direct match
  if (locationCoordinates[location]) {
    return locationCoordinates[location];
  }
  
  // Try partial match
  const locationKeys = Object.keys(locationCoordinates);
  const partialMatch = locationKeys.find(key => 
    location.includes(key) || key.includes(location)
  );
  
  if (partialMatch) {
    return locationCoordinates[partialMatch];
  }
  
  // Default to San Francisco if no match is found
  console.warn(`No coordinates found for location: ${location}. Using default.`);
  return locationCoordinates['San Francisco, CA'];
};

/**
 * Fetch weather data for a location
 * @param {string} location - Location name
 * @returns {Promise<Object>} - Weather data
 */
export const fetchWeatherForLocation = async (location) => {
  try {
    const coords = getCoordinatesForLocation(location);
    
    if (!coords) {
      throw new Error(`Could not find coordinates for location: ${location}`);
    }
    
    // Using Open-Meteo API (free, no API key needed)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature,weathercode,windspeed&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return formatWeatherData(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Format the weather data for display
 * @param {Object} data - Raw weather API response
 * @returns {Object} - Formatted weather data
 */
const formatWeatherData = (data) => {
  // Weather code mapping (simplified)
  const weatherCodeMap = {
    0: { description: 'Clear sky', icon: '☀️' },
    1: { description: 'Mainly clear', icon: '🌤️' },
    2: { description: 'Partly cloudy', icon: '⛅' },
    3: { description: 'Overcast', icon: '☁️' },
    45: { description: 'Fog', icon: '🌫️' },
    48: { description: 'Depositing rime fog', icon: '🌫️' },
    51: { description: 'Light drizzle', icon: '🌦️' },
    53: { description: 'Moderate drizzle', icon: '🌧️' },
    55: { description: 'Dense drizzle', icon: '🌧️' },
    61: { description: 'Slight rain', icon: '🌦️' },
    63: { description: 'Moderate rain', icon: '🌧️' },
    65: { description: 'Heavy rain', icon: '🌧️' },
    71: { description: 'Slight snow fall', icon: '🌨️' },
    73: { description: 'Moderate snow fall', icon: '❄️' },
    75: { description: 'Heavy snow fall', icon: '❄️' },
    95: { description: 'Thunderstorm', icon: '⛈️' },
    96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
    99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
  };
  
  const weatherCode = data.current.weathercode;
  const weather = weatherCodeMap[weatherCode] || { 
    description: 'Unknown', 
    icon: '❓' 
  };
  
  return {
    current: {
      temperature: data.current.temperature,
      weatherDescription: weather.description,
      weatherIcon: weather.icon,
      windspeed: data.current.windspeed
    },
    daily: data.daily ? {
      maxTemp: data.daily.temperature_2m_max[0],
      minTemp: data.daily.temperature_2m_min[0],
    } : null
  };
};