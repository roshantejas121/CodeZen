import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Pull key from secure environment variables
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
      role: "assistant", 
      content: "System Note: Intelligence Engine requires a valid GROQ_API_KEY in your environment variables. Please add it to your Vercel Dashboard to enable the AI Mentor." 
    });
  }
  
  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // High-reliability model
        messages: [
          { 
            role: "system", 
            content: "You are the Lead Technical Architect of CodeZen. Provide concise, elite engineering guidance. Focus on clean code, scalability, and performance." 
          },
          ...messages
        ],
        temperature: 0.6,
        max_tokens: 2048,
        stream: false
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      return NextResponse.json({ 
        role: "assistant", 
        content: data.choices[0].message.content 
      });
    }

    // High-Quality Technical Fallback (No-Crash Architecture)
    const fallbacks = [
      "As the Lead Architect of CodeZen, I recommend focusing on 'Composition over Inheritance' for your current React components to ensure maximum scalability.",
      "To optimize performance in your Next.js 15 application, ensure you are utilizing Server Components for data fetching to reduce the client-side JavaScript bundle.",
      "For robust state management, I suggest exploring the 'Signals' pattern or lightweight stores like Zustand to keep your reactivity predictable and efficient.",
      "Security Audit Note: Always sanitize your inputs and use ORMs with built-in SQL injection protection for all database interactions in CodeZen."
    ];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];

    return NextResponse.json({ 
      role: "assistant", 
      content: `[Architect Mode] ${randomFallback}` 
    });

  } catch (error: any) {
    console.error("Groq AI Error:", error);
    return NextResponse.json({ 
      role: "assistant", 
      content: "System Offline: The Intelligence Engine is unreachable. Ensure your network is active." 
    });
  }
}
