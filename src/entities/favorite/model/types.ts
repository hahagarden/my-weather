import { Region } from "@/entities/region/model/types";
import { Weather } from "@/entities/weather/model/types";

export interface Favorite {
  id: number;
  region_id: number;
  display_name?: string | null;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface FavoriteInsert {
  region_id: number;
  display_name?: string | null;
}

export interface FavoriteWithWeather extends Favorite {
  region?: Region;
  regionLoading: boolean;
  regionError: Error | null;
  weather?: Weather;
  weatherLoading: boolean;
  weatherError: Error | null;
}