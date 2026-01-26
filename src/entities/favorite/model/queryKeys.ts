export const favoriteKeys = {
  all: ["favorites"] as const,
  list: () => [...favoriteKeys.all, "list"] as const,
  byRegionId: (regionId: number) =>
    [...favoriteKeys.all, "region", regionId] as const,
};
