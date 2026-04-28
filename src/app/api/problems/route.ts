import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import { z } from "zod";

const problemSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20),
  initialCode: z.string().optional(),
  language: z.string(),
  difficulty: z.enum(['Easy', 'Intermediate', 'Advanced', 'Elite']),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const language = searchParams.get("language");
    const difficulty = searchParams.get("difficulty");

    const filter: any = {};
    if (query) {
      filter.$text = { $search: query };
    }
    if (language) {
      filter.language = language;
    }
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const problems = await Problem.find(filter)
      .populate("authorId", "username avatarUrl")
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(problems);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const validatedData = problemSchema.parse(body);

    const problem = await Problem.create({
      ...validatedData,
      authorId: session.user.id,
    });

    return NextResponse.json(problem, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
