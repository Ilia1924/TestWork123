import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThermometerHalf,
  faThermometerFull,
  faTint,
  faWind,
} from '@fortawesome/free-solid-svg-icons';
import { WeatherInfoCardProps } from '@/types/types';

export default function WeatherInfoCard({
  title,
  temperature,
  humidity,
  feelsLike,
  windSpeed,
  icon,
  description,
  time,
}: WeatherInfoCardProps) {
  return (
    <div className="card h-100">
      <div className="card-body text-center">
        <h5 className="card-title">{time || title}</h5>
        <img
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description || 'Weather icon'}
          className="mb-3"
        />
        <p className="card-text">
          <FontAwesomeIcon icon={faThermometerHalf} />{' '}
          <strong>Temperature:</strong> {Math.ceil(temperature)}°C
          <br />
          <FontAwesomeIcon icon={faTint} /> <strong>Humidity:</strong>{' '}
          {humidity}%
          <br />
          <FontAwesomeIcon icon={faThermometerFull} />{' '}
          <strong>Feels like:</strong> {Math.ceil(feelsLike)}°C
          <br />
          <FontAwesomeIcon icon={faWind} /> <strong>Wind:</strong>{' '}
          {Math.ceil(windSpeed)} м/с
        </p>
      </div>
    </div>
  );
}
