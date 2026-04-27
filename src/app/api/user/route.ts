import { NextResponse } from 'next/server';
import { db, getLevelInfo } from '@/lib/db';

export async function GET() {
  try {
    const data = db.read();
    const user = data.user;
    const levelInfo = getLevelInfo(user.xp || 0);

    // Inject real computed level data into every response
    return NextResponse.json({
      ...user,
      ...levelInfo,
    });
  } catch (error) {
    return NextResponse.json({ name: null, xp: 0, streak: 0, level: 1, levelTitle: 'Initiate', progress: 0, isNew: true });
  }
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();
    const data = db.read();

    // If adding XP, use the dedicated addXP helper so streak logic fires
    if (updates.xpDelta) {
      const result = db.addXP(updates.xpDelta);
      const fresh  = db.read();
      return NextResponse.json({ ...fresh.user, ...getLevelInfo(fresh.user.xp) });
    }

    data.user = { ...data.user, ...updates };
    db.write(data);
    return NextResponse.json({ ...data.user, ...getLevelInfo(data.user.xp) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
