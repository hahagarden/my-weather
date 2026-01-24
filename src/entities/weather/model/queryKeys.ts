export const weatherKeys = {
    all: ['weather'] as const,
    byRegionId: (id: number) => [...weatherKeys.all, 'byRegionId', id] as const,
    byCoords: (lat: number, lon: number) => [...weatherKeys.all, 'byCoords', lat, lon] as const,
}