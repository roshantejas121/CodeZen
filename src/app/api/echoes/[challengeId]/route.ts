import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { challengeId: string } }) {
  const data = db.read();
  const echoes = (data.echoHints || []).filter((e: any) => e.challengeId === params.challengeId && !e.isHidden);
  
  // Sort by upvotes
  echoes.sort((a: any, b: any) => b.netUpvotes - a.netUpvotes);
  
  return NextResponse.json(echoes);
}
