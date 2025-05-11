// app/api/events/create/route.js
import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Function to get events data
async function getEvents() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'events.json');
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading events data:', error);
    return [];
  }
}

// Function to save events data
async function saveEvents(events) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'events.json');
    const dataDir = path.join(process.cwd(), 'data');
    
    // Create the data directory if it doesn't exist
    try {
      await mkdir(dataDir, { recursive: true });
    } catch (dirError) {
      console.error('Error creating data directory:', dirError);
    }
    
    await writeFile(filePath, JSON.stringify(events, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving events data:', error);
    throw new Error('Failed to save event data');
  }
}

// Function to process file uploads
async function processFileUpload(file) {
  if (!file) return null;
  
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds the 5MB limit.');
  }

  // Create unique filename
  const uniqueId = uuidv4();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uniqueId}.${fileExtension}`;
  
  // Create path to uploads directory
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Create the uploads directory if it doesn't exist
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
  
  // Create file path
  const filePath = path.join(uploadsDir, fileName);
  
  // Write the file to the uploads directory
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  
  // Return the relative path to be stored in the database
  return `/uploads/${fileName}`;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const title = formData.get('title');
    const date = formData.get('date');
    const locationString = formData.get('location');
    const description = formData.get('description');
    const imageFile = formData.get('image');
    
    // Validate required fields
    if (!title || !date || !locationString || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Parse location JSON
    let location;
    try {
      location = JSON.parse(locationString);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid location format' },
        { status: 400 }
      );
    }
    
    // Process image upload if present
    let imagePath = null;
    if (imageFile) {
      try {
        imagePath = await processFileUpload(imageFile);
      } catch (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }
    
    // Create new event object
    const newEvent = {
      id: uuidv4(),
      title,
      date,
      location,
      description,
      image: imagePath,
      createdAt: new Date().toISOString(),
      attendees: []
    };
    
    // Get existing events and add the new one
    const events = await getEvents();
    events.push(newEvent);
    
    // Save updated events
    await saveEvents(events);
    
    // Return success response
    return NextResponse.json({
      id: newEvent.id,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}