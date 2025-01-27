import { useState, useEffect } from 'react';
import { fetchCurrentWeather } from '../services/weatherService';
import { useWeatherStore } from '../store/weatherStore';
import styles from '../styles/Home.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';

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
  const [recentCities, setRecentCities] = useState<string[]>([]);

  const { favorites, addFavorite, removeFavorite } = useWeatherStore();

  useEffect(() => {
    const savedCities = localStorage.getItem('recentCities');
    if (savedCities) {
      setRecentCities(JSON.parse(savedCities));
    }
  }, []);

  const updateRecentCities = (city: string) => {
    let updatedCities = [...recentCities];
    if (updatedCities.includes(city)) {
      updatedCities = updatedCities.filter((c) => c !== city);
    }
    updatedCities.unshift(city);
    updatedCities = updatedCities.slice(0, 5);
    setRecentCities(updatedCities);
    localStorage.setItem('recentCities', JSON.stringify(updatedCities));
  };

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
      updateRecentCities(city);
    } catch (err) {
      setError('Ошибка при загрузке данных. Проверьте название города.');
    } finally {
      setLoading(false);
        }
  };

  const handleRecentCityClick = async (recentCity: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCurrentWeather(recentCity);
      setWeather(data);
      updateRecentCities(recentCity);
    } catch (err) {
      setError('Ошибка при загрузке данных. Проверьте название города.');
    } finally {
      setLoading(false);
    }
  };
  

  const toggleFavorite = () => {
    if (!weather) return;

    if (favorites.includes(weather.name)) {
      removeFavorite(weather.name);
    } else {
      addFavorite(weather.name);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text-center mb-4">Поиск погоды</h1>
      <div className={styles.searchBox}>
        <input
          type="text"
          className="form-control"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Введите город"
        />
        <button
          className="btn btn-primary mt-2"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Поиск'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {recentCities.length > 0 && (
        <div className={styles.recentCities}>
          <h2>Недавние города:</h2>
          <div className={styles.cityList}>
            {recentCities.map((recentCity) => (
              <button
                key={recentCity}
                className="btn btn-outline-secondary"
                onClick={() => handleRecentCityClick(recentCity)}
              >
                {recentCity}
              </button>
            ))}
          </div>
        </div>
      )}

      {weather && (
        <div className={styles.weatherCard}>
          {/* Сердечко для добавления в избранное */}
          <div className={styles.favoriteIcon} onClick={toggleFavorite}>
            {favorites.includes(weather.name) ? (
              <FontAwesomeIcon
                icon={solidHeart}
                className={styles.heartFilled}
              />
            ) : (
              <FontAwesomeIcon
                icon={solidHeart}
                className={styles.heartEmpty}
              />
            )}
          </div>

          <h2>{weather.name}</h2>
          <p>Температура: {weather.main.temp}°C</p>
          <p>Влажность: {weather.main.humidity}%</p>
          <p>Давление: {weather.main.pressure} hPa</p>
          <p>Погода: {weather.weather[0].description}</p>
          <p>Скорость ветра: {weather.wind.speed} м/с</p>
          <Link href={`/forecast?city=${weather.name}`}>
            <button className="btn btn-secondary">Прогноз на 5 дней</button>
          </Link>
        </div>
      )}
    </div>
  );
}
