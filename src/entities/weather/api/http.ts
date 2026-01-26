import { parseWeatherDates, type Weather } from "../model";

export async function getWeatherByRegionId(id: number): Promise<Weather> {
  const response = await fetch(`/api/weather?id=${id}`);
  const { data } = await response.json();
  return parseWeatherDates(data);
}

export async function getWeatherByCoords(
  lat: number,
  lon: number,
): Promise<Weather> {
  const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  const { data } = await response.json();
  return parseWeatherDates(data);
}
