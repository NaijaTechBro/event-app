// Using Server Components for the homepage for better SEO and faster initial load
import EventCard from '@/components/EventCard';
import { getAllEvents } from '@/lib/events';

export default async function HomePage() {
  // Fetch events directly from the server side and await the result
  const events = await getAllEvents();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upcoming Events</h1>
      
      {events.length === 0 ? (
        <p className="text-gray-500">No events found. Why not create one?</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

// Generate static metadata for the homepage
export function generateMetadata() {
  return {
    title: 'Event Platform Lite - Upcoming Events',
    description: 'Discover and join exciting events in your area'
  };
}