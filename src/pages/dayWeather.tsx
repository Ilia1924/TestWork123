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
        .catch(() => setError('Error loading data'))
        .finally(() => setLoading(false));
    }
  }, [city]);

  if (loading) return <div className="text-center fs-3 mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  // filter to selected date
  const detailedData = forecast?.list.filter((item) =>
    item.dt_txt.startsWith(date as string),
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        Detailed forecast for {city} for{' '}
        {new Date(date as string).toLocaleDateString('en-EN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
      </h1>
      <div className="mb-4">
        <Link href={`/forecast?city=${city}`}>
          <button className="btn btn-primary">To the weekly forecast</button>
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
              description={item.weather[0].description}
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
