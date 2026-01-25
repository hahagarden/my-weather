import { NextResponse } from 'next/server';
import { regionService } from '@/entities/region/server/service';
import { getErrorMessage } from '@/shared/constants/errorMessages';

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
      { message: getErrorMessage(e) },
      { status: 404 }
    );
  }
}
