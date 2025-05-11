'use client';

import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from './FavouriteButton';

export default function EventCard({ event }) {
  // Format date nicely
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle location object properly
  const renderLocation = () => {
    if (typeof event.location === 'string') {
      return event.location;
    } else if (event.location && typeof event.location === 'object') {
      // If location is an object with name property, use that
      return event.location.name || 'Location unavailable';
    }
    return 'Location unavailable';
  };

  return (
    <Link href={`/events/${event.id}`}>
      <div className="event-card bg-white rounded-lg shadow-md overflow-hidden h-full cursor-pointer border border-gray-200 hover:shadow-lg">
        <div className="relative">
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton eventId={event.id} />
          </div>
          <div className="relative h-48 w-full">
            <Image
              src={event.image || '/uploads/default-event.jpg'}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">{event.title}</h3>
          <p className="text-gray-600 text-sm mb-2">
            <span className="inline-block mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            {formatDate(event.date)}
          </p>
          <p className="text-gray-600 text-sm mb-3 line-clamp-1">
            <span className="inline-block mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            {renderLocation()}
          </p>
          <p className="text-gray-700 line-clamp-2">{event.description}</p>
        </div>
      </div>
    </Link>
  );
}