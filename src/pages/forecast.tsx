import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchForecast } from '../services/weatherService';
import Link from 'next/link';
import { ForecastData } from '@/types/types';
import WeatherInfoCard from '@/components/WeatherInfoCard';

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

  const groupedForecast = forecast?.list.reduce(
    (acc, item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    },
    {} as { [key: string]: typeof forecast.list },
  );

  const forecastDays = Object.entries(groupedForecast || {})
    .slice(0, 5)
    .map(([date, items]) => {
      const middayData =
        items.find((item) => item.dt_txt.includes('12:00')) || items[0];
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
              <div style={{ cursor: 'pointer' }}>
                <WeatherInfoCard
                  title={new Date(item.date).toLocaleDateString('en-EN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                  })}
                  temperature={item.main.temp}
                  humidity={item.main.humidity}
                  feelsLike={item.main.feels_like}
                  windSpeed={item.wind.speed}
                  icon={item.weather[0].icon}
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
