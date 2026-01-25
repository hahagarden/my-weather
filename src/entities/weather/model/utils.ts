import { Weather, WeatherCommon } from './types';

export function parseWeatherDates(weather: Omit<Weather, 'current' | 'hourly'> & { 
  current: Omit<WeatherCommon, 'localTime'>; 
  hourly: Omit<WeatherCommon, 'localTime'>[]; 
}): Weather {
  const toLocalTime = (dt: number) => new Date(dt * 1000);

  return {
    ...weather,
    current: { ...weather.current, localTime: toLocalTime(weather.current.dt) },
    hourly: weather.hourly.map(h => ({ ...h, localTime: toLocalTime(h.dt) })),
    daily: weather.daily.map(d => ({ ...d, localTime: toLocalTime(d.dt) })),
  };
}
