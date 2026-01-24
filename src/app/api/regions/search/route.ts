import { NextResponse } from 'next/server';
import { regionService } from '@/entities/region/server/service';

const DEFAULT_LIMIT = 30;

export function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? '';
  const limit = Number(url.searchParams.get('limit') ?? DEFAULT_LIMIT);

  try {
    const regions = regionService.search({ q, limit });
    return NextResponse.json({ regions });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Unknown error' },
      { status: 400 },
    );
  }
}
