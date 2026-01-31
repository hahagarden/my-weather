export function roundCoord(value: number) {
  return Math.round(value * 100) / 100;
}

export function roundCoords(lat: number, lon: number) {
  return {
    lat: roundCoord(lat),
    lon: roundCoord(lon),
  };
}
