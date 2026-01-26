import "server-only";

import { createClient } from "@/shared/api/supabase/server";

import type { Favorite } from "../model";

export const favoriteService = {
  async getFavorites(): Promise<Favorite[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("favorites").select("*");

    if (error) throw error;
    return data;
  },

  async getFavoriteByRegionId(regionId: number): Promise<Favorite | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("region_id", regionId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};
