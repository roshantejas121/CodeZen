import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const data = db.read();
    // In a real app, you'd fetch all users and sort by XP
    // For now, we'll return our user plus some competitors
    const userBelt = db.getHighestBelt(data.user);
    
    const leaderboard = [
      { name: "Linus Torvalds", xp: 99999, belt: "Black", rank: 1 },
      { name: "Guido van Rossum", xp: 41000, belt: "Black", rank: 2 },
      { name: "Yukihiro Matsumoto", xp: 32000, belt: "Blue", rank: 3 },
      { name: data.user.name || 'Developer', xp: data.user.xp, belt: userBelt, rank: 4 },
      { name: "Sarah Connor", xp: 4500, belt: "Yellow", rank: 5 },
      { name: "Ada Lovelace", xp: 1200, belt: "White", rank: 6 },
    ].sort((a, b) => b.xp - a.xp);

    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
