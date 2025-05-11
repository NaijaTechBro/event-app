import { NextResponse } from 'next/server';
import { getEventById } from '@/lib/events';

// GET /api/events/[id] - Fetch a specific event
export async function GET(request, { params }) {
  try {
    const eventId = params.id;
    const event = getEventById(eventId);
    
    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error(`Error fetching event ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}