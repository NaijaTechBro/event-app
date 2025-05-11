import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { getEventById } from '@/lib/events';
import FavoriteButton from '@/components/FavouriteButton';
import WeatherDisplay from '@/components/WeatherDisplay';

export default async function EventDetailPage({ params }) {
  const { id } = params;
  const event = await getEventById(id);
  
  if (!event) {
    notFound();
  }
  
  // Safe date formatting with error handling
  let formattedDate = 'Date unavailable';
  try {
    // Make sure we have a valid date string before parsing
    if (event.date) {
      const dateObj = parseISO(event.date);
      formattedDate = format(dateObj, 'MMMM d, yyyy - h:mm a');
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    // Provide a fallback if date parsing fails
    formattedDate = 'Date unavailable';
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to events
          </Link>
          <h1 className="text-3xl font-bold mt-2">{event.title}</h1>
        </div>
        <FavoriteButton eventId={id} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={event.image || '/uploads/default-event.jpg'}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">About this event</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-500">Date & Time</h3>
                <p>{formattedDate}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-500">Location</h3>
                <p>{event.location.name}</p>
              </div>
            </div>
          </div>
          
          {/* Weather information - check for valid coordinates */}
          {event.location.coordinates && 
           event.location.coordinates.latitude && 
           event.location.coordinates.longitude && (
            <WeatherDisplay 
              latitude={event.location.coordinates.latitude}
              longitude={event.location.coordinates.longitude}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Generate dynamic metadata for each event
export async function generateMetadata({ params }) {
  const event = await getEventById(params.id);
  
  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.'
    };
  }
  
  return {
    title: `${event.title} | Event Platform`,
    description: event.description.substring(0, 160)
  };
}