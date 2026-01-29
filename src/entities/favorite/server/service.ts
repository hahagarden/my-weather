import "server-only";

import { createServerClient } from "@/shared/api/supabase/server";

import type { Favorite } from "../model";

export const favoriteService = {
  async getFavorites(): Promise<Favorite[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getFavoriteByRegionId(regionId: number): Promise<Favorite | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("region_id", regionId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};
