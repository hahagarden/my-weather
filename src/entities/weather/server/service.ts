import "server-only";

import { regionService } from "@/entities/region/server";
import { WEATHER_ERRORS } from "@/shared/constants";
import { roundCoords } from "@/shared/utils/coords";

import { parseWeatherDates, type Weather } from "../model";

export const weatherService = {
  async getWeatherByCoords(lat: number, lon: number): Promise<Weather> {
    const rounded = roundCoords(lat, lon);
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${rounded.lat}&lon=${rounded.lon}&units=metric&exclude=minutely,alerts&appid=${process.env.WEATHER_API_KEY}`;
    const response = await fetch(url, {
      // 외부 API 응답을 서버 캐시에 보관 (공통 데이터, 5분 재검증)
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || WEATHER_ERRORS.API_CALL_FAILED(response.status);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return parseWeatherDates(data);
  },

  async getWeatherByRegionId(id: number): Promise<Weather> {
    const region = regionService.getById(id);
    return this.getWeatherByCoords(Number(region.lat), Number(region.lon));
  },
};
