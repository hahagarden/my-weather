import { createBrowserClient } from "@/shared/api/supabase/client";
import { getCurrentUser } from "@/shared/api/supabase/client/auth";

import type { Favorite, FavoriteInsert } from "../model";

const supabase = createBrowserClient();

export const getFavorites = async (): Promise<Favorite[]> => {
  await getCurrentUser();

  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const getFavoriteByRegionId = async (
  regionId: number,
): Promise<Favorite | null> => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("region_id", regionId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const addFavorite = async (
  favorite: FavoriteInsert,
): Promise<Favorite> => {
  const user = await getCurrentUser();

  // user_id를 포함하여 insert
  const { data, error } = await supabase
    .from("favorites")
    .insert({
      ...favorite,
      user_id: user.id,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateFavoriteDisplayName = async (
  id: number,
  displayName: string,
): Promise<Favorite> => {
  await getCurrentUser();

  const { data, error } = await supabase
    .from("favorites")
    .update({ display_name: displayName })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteFavorite = async (id: number): Promise<Favorite> => {
  await getCurrentUser();

  const { data, error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};
