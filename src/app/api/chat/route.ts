import { NextResponse } from 'next/server';
import { callAI } from '@/lib/ai-service';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const systemPrompt = `
      You are "HiveMind" 🐝, the AI assistant for LinkHive. 
      Your goal is to help users optimize their LinkedIn profiles and personal brands.
      Be professional, encouraging, and highly knowledgeable about LinkedIn trends, SEO, and networking.
      You can also answer questions about the LinkHive website features (Audit, Post Generator, Dashboard).
      Keep your answers concise and actionable. Use emojis occasionally (especially 🐝).
    `;

    const chatHistory = history.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const fullPrompt = `${chatHistory}\nUSER: ${message}\nASSISTANT:`;

    const reply = await callAI(fullPrompt, systemPrompt);

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
