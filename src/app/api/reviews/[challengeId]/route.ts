import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ challengeId: string }> }) {
  const { challengeId } = await params;
  const data = db.read();
  const reviews = (data.reviews || []).filter((r: any) => r.challengeId === challengeId && r.status === 'PENDING');
  return NextResponse.json(reviews);
}
