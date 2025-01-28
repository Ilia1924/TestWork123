import { useEffect, useState } from 'react';
import { useWeatherStore } from '../store/weatherStore';
import { fetchCurrentWeather } from '../services/weatherService';
import WeatherCard from '../components/WeatherCard';
import styles from '../styles/Home.module.scss';
import Link from 'next/link';
import { WeatherData } from '@/types/types';

export default function Favorites() {
  const { favorites, removeFavorite } = useWeatherStore();
  const [favoriteWeather, setFavoriteWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavoritesWeather = async () => {
      setLoading(true);
      try {
        const weatherData = await Promise.all(
          favorites.map((city) => fetchCurrentWeather(city)),
        );
        setFavoriteWeather(weatherData);
      } catch (err) {
        console.error('Ошибка при загрузке данных для избранных городов:', err);
      } finally {
        setLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchFavoritesWeather();
    } else {
      setFavoriteWeather([]);
    }
  }, [favorites]);

  const handleToggleFavorite = (city: string) => {
    removeFavorite(city);
  };

  return (
    <div className={styles.container}>
      <h1 className="text-center mb-4">Избранные города</h1>

      {loading && <p>Загрузка данных...</p>}

      {!loading && favorites.length === 0 && (
        <div>
          <p>У вас пока нет избранных городов.</p>
          <Link href="/">
            <button className="btn btn-info mt-4">Back to search</button>
          </Link>
        </div>
      )}

      <div className={styles.favoritesGrid}>
        {favoriteWeather.map((weather) => (
          <WeatherCard
            key={weather.name}
            weather={weather}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
}
