'use client';

import { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('eventFavorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('eventFavorites', JSON.stringify(favorites));
    }
  }, [favorites, isInitialized]);

  const toggleFavorite = (eventId) => {
    setFavorites(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const isFavorite = (eventId) => {
    return favorites.includes(eventId);
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}