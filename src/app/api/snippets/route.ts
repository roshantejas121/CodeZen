import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const snippet = await request.json();
    const data = db.read();
    
    const newSnippet = {
      ...snippet,
      id: Date.now(),
    };
    
    data.snippets = [newSnippet, ...(data.snippets || [])];
    db.write(data);
    
    return NextResponse.json(newSnippet);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add snippet' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const data = db.read();
    data.snippets = data.snippets.filter((s: any) => s.id !== id);
    db.write(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete snippet' }, { status: 500 });
  }
}
