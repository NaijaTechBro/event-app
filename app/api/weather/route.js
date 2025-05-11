import { NextResponse } from 'next/server';
import { getWeatherForLocation } from '@/lib/weather';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    
    // Validate required parameters
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing latitude or longitude parameters' },
        { status: 400 }
      );
    }
    
    // Fetch weather data from external API
    const weatherData = await getWeatherForLocation(latitude, longitude);
    
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Error in weather API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}