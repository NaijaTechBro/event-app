import { NextResponse } from 'next/server';
import { getEventById } from '@/lib/events';

// GET /api/events/[id] - Get event by ID
export async function GET(request, { params }) {
  try {
    const id = params.id;
    const event = getEventById(id);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error(`Error fetching event ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}