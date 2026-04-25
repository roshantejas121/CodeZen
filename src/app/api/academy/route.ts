import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const academy = db.getAcademy();
    return NextResponse.json(academy);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch academy content' }, { status: 500 });
  }
}
