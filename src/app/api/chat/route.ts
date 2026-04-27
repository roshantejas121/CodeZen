// CodeZen Intelligence Engine - Last Updated: 2026-04-27
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  
  try {
    const { messages, model } = await req.json();

    if (!apiKey) {
      throw new Error("Missing Groq API Key");
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are the Lead Technical Architect of CodeZen. Provide concise, elite engineering guidance. Focus on clean code, scalability, and performance." 
        },
        ...messages
      ],
      model: model || "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 2048,
    });

    if (completion.choices && completion.choices[0]) {
      return NextResponse.json({ 
        role: "assistant", 
        content: completion.choices[0].message.content 
      });
    }

    return NextResponse.json({ 
      role: "assistant", 
      content: "I'm having trouble thinking right now. Please try another model or ask me later." 
    });

  } catch (error: any) {
    console.error("Groq AI Error:", error);
    
    // Handle specific Groq errors
    let errorMessage = "I am currently experiencing technical difficulties. How can I assist you with your technical roadmap today?";
    
    if (error?.status === 403 || error?.message?.includes("organization has been restricted")) {
       errorMessage = "My API key has encountered an organization restriction error from Groq. Please check your Groq API console or try another API key.";
    } else if (error?.status === 429) {
       errorMessage = "I'm currently receiving too many requests. Please slow down and try again in a moment.";
    }

    return NextResponse.json({ 
      role: "assistant", 
      content: errorMessage
    });
  }
}
