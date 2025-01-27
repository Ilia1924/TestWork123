import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchForecast } from '../services/weatherService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThermometerHalf,
  faThermometerFull,
  faTint,
  faWind,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface ForecastData {
  list: {
    dt_txt: string;
    main: {
      temp: number;
      humidity: number;
      feels_like: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
  }[];
}

export default function Forecast() {
  const router = useRouter();
  const { city } = router.query;

  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (city) {
      setLoading(true);
      fetchForecast(city as string)
        .then((data) => setForecast(data))
        .catch(() => setError('Ошибка при загрузке данных'))
        .finally(() => setLoading(false));
    }
  }, [city]);

  if (loading) return <div className="text-center mt-5">Загрузка...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  // Группируем прогноз по дням
  const groupedForecast = forecast?.list.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0]; // Группируем по дате
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as { [key: string]: typeof forecast.list });

  // Ограничиваем 5 днями и выбираем маркер для отображения (полдень)
  const forecastDays = Object.entries(groupedForecast || {})
    .slice(0, 5)
    .map(([date, items]) => {
      const middayData = items.find((item) => item.dt_txt.includes('12:00')) || items[0];
      return { date, ...middayData };
    });

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Прогноз погоды для {city}</h1>
      <div className="mb-4">
  <Link href="/">
    <button className="btn btn-primary">На главную</button>
  </Link>
</div>
      <div className="row">
        {forecastDays.map((item) => (
          <div key={item.date} className="col-md-4 mb-4">
            <Link
              href={{
                pathname: '/dayWeather',
                query: { date: item.date, city },
              }}
            >
              <div className="card h-100" style={{ cursor: 'pointer' }}>
                <div className="card-body">
                  <h5 className="card-title">
                    {new Date(item.date).toLocaleDateString('en-EN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </h5>
                  <p className="card-text text-center">
                    <img
                      src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].description}
                      className="mb-3"
                    />
                    <br />
                    <FontAwesomeIcon icon={faThermometerHalf} />{' '}
                    <strong>Temperature:</strong> {item.main.temp}°C
                    <br />
                    <FontAwesomeIcon icon={faTint} /> <strong>Humidity:</strong>{' '}
                    {item.main.humidity}%
                    <br />
                    <FontAwesomeIcon icon={faThermometerFull} />{' '}
                    <strong>Feels like:</strong> {item.main.feels_like}°C
                    <br />
                    <FontAwesomeIcon icon={faWind} /> <strong>Wind:</strong>{' '}
                    {item.wind.speed} м/с
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}