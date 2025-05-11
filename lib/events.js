import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'data');
const EVENT_FILE = path.join(DATA_DIR, 'all_events.json');
const SEED_FILE = path.join(DATA_DIR, 'events.json');

// Ensure data directory exists
export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // Initialize events file with seed data if it doesn't exist
  if (!fs.existsSync(EVENT_FILE)) {
    // Check if seed file exists
    if (fs.existsSync(SEED_FILE)) {
      const seedData = fs.readFileSync(SEED_FILE, 'utf8');
      fs.writeFileSync(EVENT_FILE, seedData);
    } else {
      // Create empty events array if seed file doesn't exist
      fs.writeFileSync(EVENT_FILE, '[]');
    }
  }
}

// Get all events - make it async to be consistent with modern patterns
export async function getAllEvents() {
  ensureDataDir();
  
  try {
    const fileContent = fs.readFileSync(EVENT_FILE, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading events file:', error);
    return [];
  }
}

// Get event by ID - make it async for consistency
export async function getEventById(id) {
  const events = await getAllEvents();
  return events.find(event => event.id === String(id)) || null;
}

// Add new event - make it async for consistency
export async function addEvent(eventData) {
  const events = await getAllEvents();
  
  // Generate a UUID instead of sequential ID for better uniqueness
  const newEvent = {
    ...eventData,
    id: eventData.id || uuidv4(),
    createdAt: new Date().toISOString(),
    attendees: eventData.attendees || []
  };
  
  events.push(newEvent);
  
  try {
    fs.writeFileSync(EVENT_FILE, JSON.stringify(events, null, 2));
    return newEvent;
  } catch (error) {
    console.error('Error writing to events file:', error);
    throw new Error('Failed to save event');
  }
}

// Update an existing event
export async function updateEvent(id, eventData) {
  const events = await getAllEvents();
  const index = events.findIndex(event => event.id === String(id));
  
  if (index === -1) {
    throw new Error(`Event with ID ${id} not found`);
  }
  
  // Update event but preserve id and creation date
  const updatedEvent = {
    ...events[index],
    ...eventData,
    id: events[index].id, // Ensure ID doesn't change
    createdAt: events[index].createdAt // Preserve original creation date
  };
  
  events[index] = updatedEvent;
  
  try {
    fs.writeFileSync(EVENT_FILE, JSON.stringify(events, null, 2));
    return updatedEvent;
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }
}

// Delete an event
export async function deleteEvent(id) {
  const events = await getAllEvents();
  const filteredEvents = events.filter(event => event.id !== String(id));
  
  if (filteredEvents.length === events.length) {
    throw new Error(`Event with ID ${id} not found`);
  }
  
  try {
    fs.writeFileSync(EVENT_FILE, JSON.stringify(filteredEvents, null, 2));
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
}

// Ensure uploads directory exists
export function ensureUploadsDir() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  return uploadsDir;
}