import { NextResponse } from "next/server";

import { regionService } from "@/entities/region/server";
import { getErrorMessage } from "@/shared/constants";

export const revalidate = 86400; // 지역 데이터는 거의 변하지 않음 (24시간 캐시)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const region = regionService.getById(Number(id));
    return NextResponse.json({ data: region });
  } catch (e) {
    return NextResponse.json({ message: getErrorMessage(e) }, { status: 404 });
  }
}
