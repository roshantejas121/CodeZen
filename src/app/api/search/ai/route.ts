import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    await connectDB();

    // 1. Fetch local candidates
    const localProblems = await Problem.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).limit(5);

    // 2. Use AI to rank and generate expert advice
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert full-stack architect AI. Analyze the user's coding problem and provide a ranked list of solutions and expert advice. Mention if there are existing community solutions."
        },
        {
          role: "user",
          content: `Search Query: ${query}\nLocal Matches: ${JSON.stringify(localProblems.map(p => p.title))}`
        }
      ],
      model: "mixtral-8x7b-32768",
    });

    const aiAdvice = completion.choices[0]?.message?.content;

    return NextResponse.json({
      localProblems,
      aiAdvice,
      externalResources: [
        { title: "Stack Overflow Matches", url: `https://stackoverflow.com/search?q=${encodeURIComponent(query)}` },
        { title: "GitHub Code Search", url: `https://github.com/search?q=${encodeURIComponent(query)}&type=code` }
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
