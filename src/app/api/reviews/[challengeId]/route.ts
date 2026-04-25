import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { challengeId: string } }) {
  const data = db.read();
  const reviews = (data.reviews || []).filter((r: any) => r.challengeId === params.challengeId && r.status === 'PENDING');
  return NextResponse.json(reviews);
}
