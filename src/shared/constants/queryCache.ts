export const QUERY_CACHE = {
  defaults: {
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
  },
  weather: {
    staleTime: 1 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  },
  region: {
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
  },
  favorites: {
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  },
  searchRegion: {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  },
};
