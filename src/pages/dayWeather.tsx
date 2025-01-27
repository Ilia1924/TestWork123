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
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  {new Date(item.dt_txt).toLocaleTimeString('en-EN', {
                    hour: '2-digit',
                    minute: '2-digit',
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
          </div>
        ))}
      </div>
    </div>
  );
}