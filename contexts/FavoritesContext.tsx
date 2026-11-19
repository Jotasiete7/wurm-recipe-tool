import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Recipe } from '../types';
import { findCatalogRecipeById } from '../utils/catalog';

const STORAGE_KEY = 'wurm_favorites';

interface FavoritesContextType {
  ids: string[];
  recipes: Recipe[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function readIds(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.filter((id): id is string => typeof id === 'string' && id.length > 0);
  } catch {
    return [];
  }
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<string[]>(() => readIds());

  const toggle = useCallback((id: string) => {
    if (!id) return;
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [id, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const recipes = useMemo(
    () => ids.map(id => findCatalogRecipeById(id)).filter((recipe): recipe is Recipe => Boolean(recipe)),
    [ids]
  );

  const value = useMemo<FavoritesContextType>(() => ({
    ids,
    recipes,
    has: (id: string) => ids.includes(id),
    toggle,
  }), [ids, recipes, toggle]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
}
