import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as solidHeart,
  faThermometerHalf,
  faThermometerFull,
  faTint,
  faWind,
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
        {isFavorite ? (
          <FontAwesomeIcon icon={solidHeart} className={styles.heartFilled} />
        ) : (
          <FontAwesomeIcon icon={solidHeart} className={styles.heartEmpty} />
        )}
      </div>
      <h2>{weather.name}</h2>
      <p>
        <FontAwesomeIcon icon={faThermometerHalf} />{' '}
        <strong>Temperature:</strong> {Math.ceil(weather.main.temp)}°C
        <br />
        <FontAwesomeIcon icon={faTint} /> <strong>Humidity:</strong>
        {weather.main.humidity}% <br />
        <FontAwesomeIcon icon={faThermometerFull} />{' '}
        <strong>Feels like:</strong> {Math.ceil(weather.main.feels_like)}
        <br />
        <FontAwesomeIcon icon={faWind} /> <strong>Wind:</strong>{' '}
        {Math.ceil(weather.wind.speed)} м/с
        <br />
      </p>

      <Link href={`/forecast?city=${weather.name}`}>
        <button className="btn btn-secondary">Прогноз на 5 дней</button>
      </Link>
    </div>
  );
}
