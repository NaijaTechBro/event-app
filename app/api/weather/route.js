import { NextResponse } from 'next/server';
import { fetchWeatherForLocation } from '@/lib/weather';

// GET /api/weather?location=... - Fetch weather for a specific location
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    
    if (!location) {
      return NextResponse.json(
        { message: 'Location parameter is required' },
        { status: 400 }
      );
    }
    
    const weatherData = await fetchWeatherForLocation(location);
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}