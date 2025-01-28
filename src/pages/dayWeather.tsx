import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchForecast } from '../services/weatherService';
import Link from 'next/link';
import { ForecastData } from '@/types/types';
import WeatherInfoCard from '@/components/WeatherInfoCard';

export default function DayWeather() {
  const router = useRouter();
  const { date, city } = router.query;

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

  // Фильтруем данные по выбранной дате
  const detailedData = forecast?.list.filter((item) =>
    item.dt_txt.startsWith(date as string),
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        Подробный прогноз для {city} на{' '}
        {new Date(date as string).toLocaleDateString('en-EN', {
          weekday: 'short',
          day: 'numeric',
          month: 'long',
        })}
      </h1>
      <div className="mb-4">
        <Link href={`/forecast?city=${city}`}>
          <button className="btn btn-primary">К прогнозу на неделю</button>
        </Link>
      </div>
      <div className="row">
        {detailedData?.map((item) => (
           <div key={item.dt_txt} className="col-md-4 mb-4">
           <WeatherInfoCard
             title={city as string}
             temperature={item.main.temp}
             humidity={item.main.humidity}
             feelsLike={item.main.feels_like}
             windSpeed={item.wind.speed}
             icon={item.weather[0].icon}
             time={new Date(item.dt_txt).toLocaleTimeString('en-EN', {
               hour: '2-digit',
               minute: '2-digit',
             })}
           />
         </div>
        ))}
      </div>
    </div>
  );
}
