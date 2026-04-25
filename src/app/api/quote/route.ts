import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://programming-quotes-api.herokuapp.com/Quotes/random');
    const data = await res.json();
    return NextResponse.json({ quote: data.en, author: data.author });
  } catch (error) {
    return NextResponse.json({ 
      quote: "The only way to learn a new programming language is by writing programs in it.", 
      author: "Dennis Ritchie" 
    });
  }
}
