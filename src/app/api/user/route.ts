import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const data = db.read();
    return NextResponse.json(data.user);
  } catch (error) {
    return NextResponse.json({ name: 'Developer', xp: 12450, streak: 12, level: 'Intermediate' });
  }
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();
    const data = db.read();
    
    data.user = {
      ...data.user,
      ...updates
    };
    
    db.write(data);
    return NextResponse.json(data.user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
