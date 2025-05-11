import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define paths
const dataDirectory = path.join(process.cwd(), 'data');
const eventsFilePath = path.join(dataDirectory, 'all_events.json');
const seedFilePath = path.join(dataDirectory, 'events.json');

// Ensure the data directory exists
export const ensureDataDirectory = () => {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
  
  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

// Initialize data file with seed data if it doesn't exist
export const initializeEventsData = () => {
  ensureDataDirectory();
  
  if (!fs.existsSync(eventsFilePath)) {
    // If the main events file doesn't exist, copy from seed
    if (fs.existsSync(seedFilePath)) {
      const seedData = fs.readFileSync(seedFilePath, 'utf8');
      fs.writeFileSync(eventsFilePath, seedData);
      return JSON.parse(seedData);
    } else {
      // If no seed file, create empty events array
      fs.writeFileSync(eventsFilePath, JSON.stringify([]));
      return [];
    }
  }
  
  // Return the existing data
  try {
    const data = fs.readFileSync(eventsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading events data:', error);
    return [];
  }
};

// Get all events
export const getAllEvents = () => {
  try {
    const events = initializeEventsData();
    return events;
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

// Get event by ID
export const getEventById = (id) => {
  try {
    const events = getAllEvents();
    return events.find(event => event.id === id);
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    return null;
  }
};

// Create a new event
export const createEvent = async (eventData, imageFile) => {
  try {
    const events = getAllEvents();
    
    // Generate a new UUID for the event
    const newEvent = {
      id: uuidv4(),
      ...eventData,
      image: imageFile ? `/uploads/${imageFile.filename}` : '/uploads/default-event.png'
    };
    
    // Add the new event to the array
    events.push(newEvent);
    
    // Write the updated events back to the file
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
    
    return newEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }
};

// Save file and return the saved filename
export const saveEventImage = async (file) => {
  // Generate a unique filename
  const uniqueFilename = `${Date.now()}-${uuidv4()}.${file.name.split('.').pop()}`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  try {
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Write the file to the uploads directory
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(uploadsDir, uniqueFilename), buffer);
    
    return {
      filename: uniqueFilename,
      path: `/uploads/${uniqueFilename}`
    };
  } catch (error) {
    console.error('Error saving image file:', error);
    throw new Error('Failed to save image file');
  }
};