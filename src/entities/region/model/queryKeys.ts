export const regionKeys = {
  all: ["regions"] as const,
  search: (query: string) => [...regionKeys.all, "search", query] as const,
  byId: (id: number) => [...regionKeys.all, "byId", id] as const,
};
