export interface WeatherData {
  name: string;
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
}

export interface WeatherCardProps {
  weather: WeatherData;
  onToggleFavorite: (city: string) => void;
  isFavorite: boolean;
}

export interface ForecastData {
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

export interface WeatherInfoCardProps {
  title: string;
  temperature: number;
  humidity: number;
  feelsLike: number;
  windSpeed: number;
  icon: string;
  time?: string;
}