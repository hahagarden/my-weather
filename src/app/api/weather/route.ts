import { NextResponse } from "next/server";
import { weatherService } from "@/entities/weather/server/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const id = searchParams.get('id');

  if (id) {
    const data = await weatherService.getWeatherByRegionId(Number(id));
    return NextResponse.json({ data });
  }

  if (lat && lon) {
    const data = await weatherService.getWeatherByCoords(Number(lat), Number(lon));
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
}