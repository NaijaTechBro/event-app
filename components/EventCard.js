'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { useFavorites } from '@/context/FavoritesContext';

export default function EventCard({ event }) {
  const { id, title, date, location, image } = event;
  const { favorites, toggleFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Update favorite status when favorites context changes
  useEffect(() => {
    setIsFavorite(favorites.includes(id));
  }, [favorites, id]);
  
  const formattedDate = format(new Date(date), 'MMMM d, yyyy - h:mm a');
  
  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent navigating to event detail
    e.stopPropagation(); // Prevent event bubbling
    toggleFavorite(id);
  };
  
  return (
    <Link href={`/events/${id}`}>
      <div className="event-card bg-white h-full flex flex-col">
        <div className="relative w-full h-48">
          <Image
            src={image || '/uploads/default-event.jpg'}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-5.201-3.893 10.989 10.989 0 01-2.751-7.292c0-3.626 2.68-6.627 6.224-6.627 1.56 0 3.039.537 4.185 1.52a3.787 3.787 0 014.302 0c1.146-.984 2.625-1.52 4.185-1.52 3.543 0 6.224 3.001 6.224 6.627a10.989 10.989 0 01-2.751 7.292 15.247 15.247 0 01-5.201 3.893l-.022.012-.007.003-.002.001a.75.75 0 01-.722 0l-.002-.001z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-2">{formattedDate}</p>
          <p className="text-gray-600 mt-auto">{location.name}</p>
        </div>
      </div>
    </Link>
  );
}