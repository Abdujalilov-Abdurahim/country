import { createContext, useContext } from 'react';

export interface AppContextType {
  isDark: boolean;
  toggleDark: () => void;
  favorites: string[];
  toggleFavorite: (code: string) => void;
  isFavorite: (code: string) => boolean;
}

export const AppContext = createContext<AppContextType>({
  isDark: false,
  toggleDark: () => {},
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export const useAppContext = () => useContext(AppContext);
