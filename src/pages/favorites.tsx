import { useWeatherStore } from '../store/weatherStore';

export default function Favorites() {
    const { favorites } = useWeatherStore();

    return (
        <div>
            <h1>Избранные города</h1>
            {favorites.length > 0 ? (
                <ul>
                    {favorites.map((city) => (
                        <li key={city}>{city}</li>
                    ))}
                </ul>
            ) : (
                <p>Нет избранных городов</p>
            )}
        </div>
    );
}
