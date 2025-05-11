import { getAllEvents } from '@/lib/events';
import EventCard from '@/components/EventCard';

export const metadata = {
  title: 'Events | Event Platform Lite',
  description: 'Discover upcoming events near you.',
};

// This page uses SSR for initial data fetch
export default async function Home() {
  const events = getAllEvents();
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No events found. Be the first to create an event!</p>
          <a 
            href="/events/create" 
            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Event
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="h-full">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}