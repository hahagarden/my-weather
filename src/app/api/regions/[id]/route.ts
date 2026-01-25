import { NextResponse } from 'next/server';
import { regionService } from '@/entities/region/server/service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const region = regionService.getById(Number(id));
    return NextResponse.json({ data: region });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Unknown error' },
      { status: 404 }
    );
  }
}
