import { NextResponse } from 'next/server';
import { callAI } from '@/lib/ai-service';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const systemPrompt = `
      You are "HiveMind", the AI assistant for LinkHive. 
      Your goal is to help users optimize their LinkedIn profiles and personal brands.
      Be professional, encouraging, and highly knowledgeable about LinkedIn trends, SEO, and networking.
      You can also answer questions about the LinkHive website features (Audit, Post Generator, Dashboard).
      Keep your answers concise and actionable. Do not use emojis in your responses.

      COMMANDS:
      If a user wants to go to a specific page or perform an action, include a command at the end of your message in the format: [ACTION:NAVIGATE:/path]
      Available paths:
      - Home: /
      - Profile Audit: /audit
      - Dashboard: /dashboard
      - Post Generator: /post-generator
      - Demo: /demo

      Example: "Sure, let's head over to the Post Generator! [ACTION:NAVIGATE:/post-generator]"
    `;

    const messages: { role: 'user' | 'assistant' | 'system'; content: string }[] = [
      ...history,
      { role: 'user', content: message }
    ];

    const reply = await callAI(messages, systemPrompt);

    return NextResponse.json({ success: true, reply });
  } catch (error: unknown) {
    console.error('Chat API Error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
