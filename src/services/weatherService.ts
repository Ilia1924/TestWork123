import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY ?? '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchCurrentWeather = async (
  city?: string,
  latitude?: number,
  longitude?: number,
) => {
  if (!city && (latitude === undefined || longitude === undefined)) {
    throw new Error('Необходимо указать город');
  }

  const params: Record<string, string | number> = {
    appid: API_KEY || '',
    units: 'metric',
  };

  if (city) {
    params.q = city;
  } else if (latitude !== undefined && longitude !== undefined) {
    params.lat = latitude;
    params.lon = longitude;
  }

  const response = await axios.get(`${BASE_URL}/weather`, { params });
  return response.data;
};

export const fetchForecast = async (city: string) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return response.data;
};
