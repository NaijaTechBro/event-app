'use client';

import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  
  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  }, []);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    if (favorites.length > 0 || localStorage.getItem('favorites')) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);
  
  // Toggle favorite status
  const toggleFavorite = (eventId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(eventId)) {
        return prevFavorites.filter(id => id !== eventId);
      } else {
        return [...prevFavorites, eventId];
      }
    });
  };
  
  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom hook to use the favorites context
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}