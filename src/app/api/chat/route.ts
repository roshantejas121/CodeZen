import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  
  try {
    const { messages } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ 
        role: "assistant", 
        content: "I'm currently operating in 'Core Mode'. Please add your GROQ_API_KEY to the .env file to activate the Hyper-Speed Intelligence Engine. I am ready to provide elite architectural guidance once the key is synced." 
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { 
            role: "system", 
            content: "You are the Lead Technical Architect of CodeZen, an elite engineering platform. Your goal is to provide concise, high-performance technical advice, code reviews, and architectural guidance. Focus on clean code, scalability, and modern web standards." 
          },
          ...messages
        ],
        temperature: 0.5,
        max_tokens: 2048,
        top_p: 1,
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

    throw new Error("Groq API Error: Invalid response structure");

  } catch (error: any) {
    console.error("Groq AI Error:", error);
    
    return NextResponse.json({ 
      role: "assistant", 
      content: "System Check: The Hyper-Speed Engine is experiencing high load. Recommended Strategy: Review your system's architectural integrity and ensure your Groq credentials are valid." 
    });
  }
}
