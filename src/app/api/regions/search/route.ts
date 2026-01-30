import { NextResponse } from "next/server";

import { regionService } from "@/entities/region/server";
import { getErrorMessage, REGION_ERRORS } from "@/shared/constants";

export const revalidate = 86400; // 지역 데이터는 거의 변하지 않음 (24시간 캐시)

const DEFAULT_LIMIT = 100;

export function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : DEFAULT_LIMIT;

  // limit 파라미터 검증
  if (limitParam && (isNaN(limit) || limit < 1 || limit > 1000)) {
    return NextResponse.json(
      { message: REGION_ERRORS.INVALID_LIMIT },
      { status: 400 },
    );
  }

  try {
    const regions = regionService.search({ q, limit });
    return NextResponse.json({ regions });
  } catch (e) {
    // 예상치 못한 서버 에러 (예: JSON 파싱 에러, 메모리 부족 등)
    return NextResponse.json({ message: getErrorMessage(e) }, { status: 500 });
  }
}
