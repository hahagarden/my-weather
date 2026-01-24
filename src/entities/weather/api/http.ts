import { Weather, WeatherInfo } from "../model/types";

function parseWeatherDates(weather: Omit<Weather, 'current' | 'hourly'> & { 
  current: Omit<WeatherInfo, 'localTime'>; 
  hourly: Omit<WeatherInfo, 'localTime'>[]; 
}): Weather {
  const toLocalTime = (dt: number) => new Date(dt * 1000);

  return {
    ...weather,
    current: { ...weather.current, localTime: toLocalTime(weather.current.dt) },
    hourly: weather.hourly.map(h => ({ ...h, localTime: toLocalTime(h.dt) })),
  };
} // 유틸리티 함수

export async function getWeatherByRegionId(id: number): Promise<Weather> {
  const response = await fetch(`/api/weather?id=${id}`);
  const { data } = await response.json();
  return parseWeatherDates(data);
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<Weather> {
  const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  const { data } = await response.json();
  return parseWeatherDates(data);
}