import { NextResponse } from "next/server";

import { weatherService } from "@/entities/weather/server";
import { GENERAL_ERRORS, getErrorMessage, REGION_ERRORS, WEATHER_ERRORS } from "@/shared/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const id = searchParams.get('id');

  if (id) {
    try {
      // id 파라미터 검증
      const regionId = Number(id);
      if (isNaN(regionId)) {
        return NextResponse.json(
          { message: REGION_ERRORS.INVALID_ID },
          { status: 400 }
        );
      }

      const data = await weatherService.getWeatherByRegionId(regionId);
      return NextResponse.json({ data });
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      // 지역을 찾을 수 없는 경우 (regionService.getById에서 발생)
      if (errorMessage.includes('지역 정보를 찾을 수 없습니다')) {
        return NextResponse.json(
          { message: errorMessage },
          { status: 404 }
        );
      }
      // 외부 API 호출 실패 등 서버 에러
      return NextResponse.json(
        { message: errorMessage },
        { status: 500 }
      );
    }
  }

  if (lat && lon) {
    try {
      // 좌표 파라미터 검증
      const latitude = Number(lat);
      const longitude = Number(lon);
      if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json(
          { message: WEATHER_ERRORS.INVALID_COORDINATES },
          { status: 400 }
        );
      }
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return NextResponse.json(
          { message: WEATHER_ERRORS.INVALID_COORDINATE_RANGE },
          { status: 400 }
        );
      }

      const data = await weatherService.getWeatherByCoords(latitude, longitude);
      return NextResponse.json({ data });
    } catch (e) {
      // 외부 API 호출 실패 등 서버 에러
      return NextResponse.json(
        { message: getErrorMessage(e) },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: GENERAL_ERRORS.MISSING_PARAMETERS }, { status: 400 });
}