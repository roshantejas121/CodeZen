import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Pull key from secure environment variables
  const apiKey = process.env.GROQ_API_KEY;
  
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

    // Diagnostic feedback if the API returns an error
    return NextResponse.json({ 
      role: "assistant", 
      content: data.error ? `Engine Diagnostic: ${data.error.message}` : "Intelligence Fault: Invalid response from Groq infrastructure." 
    });

  } catch (error: any) {
    console.error("Groq AI Error:", error);
    return NextResponse.json({ 
      role: "assistant", 
      content: "System Offline: The Intelligence Engine is unreachable. Ensure your network is active." 
    });
  }
}
