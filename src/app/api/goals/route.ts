import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { id, completed } = await request.json();
    const data = db.read();
    data.user.goals = data.user.goals.map((g: any) => 
      g.id === id ? { ...g, completed } : g
    );
    db.write(data);
    return NextResponse.json(data.user.goals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}
