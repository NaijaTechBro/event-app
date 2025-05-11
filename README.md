# Event Platform Lite

A full-stack Next.js application for creating, viewing, and favoriting events with real-time weather integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Implementation Details](#implementation-details)
- [API Documentation](#api-documentation)
- [Future Improvements](#future-improvements)

## 🔍 Overview

Event Platform Lite is a responsive web application built with Next.js that allows users to browse events, view detailed information including real-time weather for event locations, create new events with image uploads, and save favorite events to their browser's local storage.

## ✨ Features

- **Event Listing**: Browse through all events with a user-friendly card interface
- **Event Details**: View comprehensive information about each event
- **Real-time Weather**: See current weather conditions for event locations via Open-Meteo API
- **Event Creation**: Create new events with a form that includes image upload functionality
- **Image Management**: Upload and store event images on the server
- **Favorites System**: Mark events as favorites and persist them in local storage
- **Responsive Design**: User-friendly interface that works on desktop and mobile devices

## 💻 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Frontend**: React, CSS Modules
- **Backend**: Next.js API Routes
- **Data Storage**: JSON file-based persistence, Server file system (for images)
- **External API**: [Open-Meteo API](https://open-meteo.com/) for weather data
- **State Management**: React Context API, localStorage

## 📁 Project Structure

```
event-platform/
├── app/               # Next.js App Router
│   ├── api/           # API routes
│   │   |__ weather
|   |    |__ upload   # To handle the image upload
|   |    |
|   |    |── events  # Events API endpoints
|   |            
│   ├── events/        # Event pages
│   │   ├── [id]/ not-found.js     # Dynamic event detail pages
│   │   |── create/                # Event creation page
|   |
|
│   ├── layout.js      # Root layout
│   └── page.js        # Homepage
├── components/        # Reusable components
│   ├── EventCard.js   # Event card component
│   ├── EventForm.js   # Event creation form
│   ├── Header.js      # Site header
│   |── FavouriteButton.js 
|   |__ WeatherDisplay.js # Weather display component
|
├── context/           # React context
│   └── FavoritesContext.js # Global favorites context
├── data/              # Data files
│   └── events.json    # Initial seed data
├── lib/               # Utility functions
│   ├── events.js      # Event data handling
│   └── weather.js     # Weather API functions
├── public/            # Static assets
│   └── uploads/       # Uploaded event images
└── styles/            # CSS files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/event-platform.git
   cd event-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create the upload directory for images (if not already present):
   ```bash
   mkdir -p public/uploads
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 🔧 Implementation Details

### Data Persistence

The application uses a file-based storage approach:

- Events are stored in `data/all_events.json`
- If this file doesn't exist on startup, it's seeded with initial data from `data/events.json`
- Images are stored in the `public/uploads/` directory

### Event Listing Page

- Server-side rendered for better SEO and initial load performance
- Events are fetched from the API and displayed as clickable cards
- Each card shows the event title, date, location, and image
- Events can be marked as favorites with a click

### Event Detail Page

- Dynamic routing with Next.js for each event (`/events/[id]`)
- Displays all event information including title, date, location, description, and image
- Fetches real-time weather information for the event location using the Open-Meteo API
- Includes loading states and error handling for both event data and weather information

### Event Creation

- Form-based interface for creating new events
- Client-side form validation using React hooks
- Image upload preview before submission
- Server-side handling for image storage and event data persistence
- Success feedback and redirection after event creation

### Favorites System

- Global state management using React Context API
- Persistent storage using browser's localStorage
- Visual indication of favorited events throughout the application

## 📚 API Documentation

### Events API

#### GET `/api/events`

Returns a list of all events.

**Response**:
```json
{
  "events": [
    {
      "id": "1",
      "title": "Tech Conference 2025",
      "date": "2025-06-15",
      "location": "San Francisco, CA",
      "description": "Annual tech conference showcasing the latest innovations.",
      "image": "/uploads/tech-conf.jpg"
    },
    // More events...
  ]
}
```

#### GET `/api/events/[id]`

Returns a specific event by ID.

**Response**:
```json
{
  "event": {
    "id": "1",
    "title": "Tech Conference 2025",
    "date": "2025-06-15",
    "location": "San Francisco, CA",
    "description": "Annual tech conference showcasing the latest innovations.",
    "image": "/uploads/tech-conf.jpg"
  }
}
```

#### POST `/api/events`

Creates a new event.

**Request Body**: FormData containing:
- `title`: Event title
- `date`: Event date
- `location`: Event location
- `description`: Event description
- `image`: Image file

**Response**:
```json
{
  "success": true,
  "event": {
    "id": "3",
    "title": "Music Festival 2025",
    "date": "2025-07-20",
    "location": "Austin, TX",
    "description": "Three-day music festival featuring top artists.",
    "image": "/uploads/music-fest-1684152784.jpg"
  }
}
```

### Weather API Integration

The application uses the Open-Meteo API to fetch weather data. Implementation details are in `lib/weather.js`.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [Sodiq Baki Adeiza](https://github.com/NaijaTechBro) - Initial development