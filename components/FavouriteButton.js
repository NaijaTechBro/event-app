// 'use client';

// import { useState, useEffect } from 'react';
// import { useFavorites } from '@/context/FavoritesContext';

// export default function FavoriteButton({ eventId }) {
//   const { favorites, toggleFavorite } = useFavorites();
//   const [isFavorite, setIsFavorite] = useState(false);
  
//   // Update favorite status when favorites context changes
//   useEffect(() => {
//     setIsFavorite(favorites.includes(eventId));
//   }, [favorites, eventId]);
  
//   return (
//     <button 
//       onClick={() => toggleFavorite(eventId)}
//       className={`flex items-center px-4 py-2 rounded-full transition-colors ${
//         isFavorite 
//           ? 'bg-red-50 text-red-600 hover:bg-red-100' 
//           : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//       }`}
//       aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
//     >
//       {isFavorite ? (
//         <>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
//             <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-5.201-3.893 10.989 10.989 0 01-2.751-7.292c0-3.626 2.68-6.627 6.224-6.627 1.56 0 3.039.537 4.185 1.52a3.787 3.787 0 014.302 0c1.146-.984 2.625-1.52 4.185-1.52 3.543 0 6.224 3.001 6.224 6.627a10.989 10.989 0 01-2.751 7.292 15.247 15.247 0 01-5.201 3.893l-.022.012-.007.003-.002.001a.75.75 0 01-.722 0l-.002-.001z" />
//           </svg>
//           Favorite
//         </>
//       ) : (
//         <>
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
//           </svg>
//           Add to favorites
//         </>
//       )}
//     </button>
//   );
// }






'use client';

import { useFavorites } from '@/context/FavoritesContext';

export default function FavoriteButton({ eventId }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(eventId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent click from navigating if button is in a link
        e.stopPropagation();
        toggleFavorite(eventId);
      }}
      className="favorite-button p-2 rounded-full focus:outline-none"
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      {favorite ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-6 h-6 text-red-500"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-6 h-6 text-gray-400 hover:text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      )}
    </button>
  );
}