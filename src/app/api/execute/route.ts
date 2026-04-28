import { NextResponse } from "next/server";

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const API_KEY = process.env.JUDGE0_API_KEY;

export async function POST(req: Request) {
  try {
    const { language_id, source_code, stdin } = await req.json();

    if (!API_KEY) {
      return NextResponse.json({ error: "Judge0 API key not configured" }, { status: 500 });
    }

    const response = await fetch(`${JUDGE0_URL}?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: {
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        language_id,
        source_code,
        stdin,
      }),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
