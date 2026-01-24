import 'server-only';
import { Weather } from '../model/types';
import { regionService } from '@/entities/region/server/service';

export const weatherService = {
  async getWeatherByCoords(lat: number, lon: number): Promise<Weather> {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,daily,alerts&appid=${process.env.WEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  },

  async getWeatherByRegionId(id: number): Promise<Weather | null> {
    const region = regionService.getById(id);
    if (!region) return null;
    return this.getWeatherByCoords(Number(region.lat), Number(region.lon));
  },
};