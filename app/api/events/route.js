import { NextResponse } from 'next/server';
import { getAllEvents, addEvent } from '@/lib/events';

// GET /api/events - Get all events
export async function GET() {
  try {
    const events = getAllEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Add new event (without file upload)
export async function POST(request) {
  try {
    const eventData = await request.json();
    
    // Basic validation
    if (!eventData.title || !eventData.date || !eventData.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newEvent = addEvent(eventData);
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}