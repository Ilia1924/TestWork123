import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WeatherState {
  favorites: string[];
  addFavorite: (city: string) => void;
  removeFavorite: (city: string) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (city) =>
        set((state) => ({
          favorites: [...state.favorites, city],
        })),
      removeFavorite: (city) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav !== city),
        })),
    }),
    {
      name: 'weather-storage',
    },
  ),
);
