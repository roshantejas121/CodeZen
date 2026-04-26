import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const data = db.read();
    // In a real app, you'd fetch all users and sort by XP
    // For now, we'll return our user plus some competitors
    const leaderboard = [
      { name: "Alex Rivers", xp: 15200, belt: "Black", rank: 1 },
      { name: "Sarah Chen", xp: 14850, belt: "Brown", rank: 2 },
      { name: data.user.name, xp: data.user.xp, belt: "Blue", rank: 3 },
      { name: "Michael Park", xp: 11200, belt: "Green", rank: 4 },
      { name: "Jessica Wu", xp: 9500, belt: "Yellow", rank: 5 },
    ].sort((a, b) => b.xp - a.xp);

    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
