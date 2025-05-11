import { NextResponse } from 'next/server';
import { 
  getAllEvents, 
  createEvent, 
  saveEventImage 
} from '@/lib/events';

// GET /api/events - Fetch all events
export async function GET() {
  try {
    const events = getAllEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const title = formData.get('title');
    const date = formData.get('date');
    const location = formData.get('location');
    const description = formData.get('description');
    const imageFile = formData.get('image');
    
    // Validate required fields
    if (!title || !date || !location || !description) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Process and save the image if provided
    let savedImage = null;
    if (imageFile && imageFile.size > 0) {
      savedImage = await saveEventImage(imageFile);
    }
    
    // Create the event
    const eventData = {
      title,
      date,
      location,
      description,
    };
    
    const newEvent = await createEvent(eventData, savedImage);
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}