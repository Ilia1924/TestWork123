import { useState } from 'react';
import { fetchCurrentWeather } from '../services/weatherService';
import { useWeatherStore } from '../store/weatherStore';
import styles from '../styles/Home.module.scss';
import Link from 'next/link';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

export default function Home() {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { favorites, addFavorite, removeFavorite } = useWeatherStore();

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Пожалуйста, введите название города');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await fetchCurrentWeather(city);
      setWeather(data);
    } catch (err) {
      setError('Ошибка при загрузке данных. Проверьте название города.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = () => {
    if (weather && !favorites.includes(weather.name)) {
      addFavorite(weather.name);
    }
  };

  const handleRemoveFromFavorites = () => {
    if (weather && favorites.includes(weather.name)) {
      removeFavorite(weather.name);
    }
  };

  return (
    <div>
      <h1>Погода</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Введите город"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Загрузка...' : 'Поиск'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>Температура: {weather.main.temp}°C</p>
          <p>Влажность: {weather.main.humidity}%</p>
          <p>Давление: {weather.main.pressure} hPa</p>
          <p>Погода: {weather.weather[0].description}</p>
          <p>Скорость ветра: {weather.wind.speed} м/с</p>

          <Link href={`/forecast?city=${weather.name}`}>
            <button className={styles.button}>Прогноз на 5 дней</button>
          </Link>
          
          {favorites.includes(weather.name) ? (
            <button onClick={handleRemoveFromFavorites}>
              Удалить из избранного
            </button>
          ) : (
            <button onClick={handleAddToFavorites}>Добавить в избранное</button>
          )}
        </div>
      )}
    </div>
  );
}
