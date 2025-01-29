import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as solidHeart,
  faThermometerHalf,
} from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/WeatherCard.module.scss';
import Link from 'next/link';
import { WeatherCardProps } from '@/types/types';

export default function WeatherCard({
  weather,
  onToggleFavorite,
  isFavorite,
}: WeatherCardProps) {
  return (
    <div className={styles.weatherCard}>
      <div
        className={styles.favoriteIcon}
        onClick={() => onToggleFavorite(weather.name)}
      >
        {
          <FontAwesomeIcon
            icon={solidHeart}
            className={isFavorite ? styles.heartFilled : styles.heartEmpty}
          />
        }
      </div>
      <h2>{weather.name}</h2>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
        className="mb-3"
      />
      <p>
        <FontAwesomeIcon icon={faThermometerHalf} />{' '}
        <strong>Temperature:</strong> {Math.ceil(weather.main.temp)}°C
        <br />
      </p>

      <Link href={`/forecast?city=${weather.name}`}>
        <button className="btn btn-secondary">Five day forecast</button>
      </Link>
    </div>
  );
}
