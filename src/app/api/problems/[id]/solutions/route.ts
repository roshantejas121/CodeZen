import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Solution from "@/lib/models/Solution";
import User from "@/lib/models/User";
import { z } from "zod";

const solutionSchema = z.object({
  code: z.string().min(10),
  explanation: z.string().optional(),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const solutions = await Solution.find({ problemId: params.id })
      .populate("authorId", "username avatarUrl reputation")
      .sort({ upvotes: -1, createdAt: -1 });

    return NextResponse.json(solutions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { code, explanation } = solutionSchema.parse(body);

    const solution = await Solution.create({
      problemId: params.id,
      authorId: session.user.id,
      code,
      explanation,
    });

    // Increment user's solution count
    await User.findByIdAndUpdate(session.user.id, { $inc: { "stats.totalSolutions": 1 } });

    return NextResponse.json(solution, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
