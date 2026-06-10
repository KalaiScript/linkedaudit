'use server';

import { callAI } from '@/lib/ai-service';
import { LinkedInProfile } from '@/types';

export async function getFullAIAnalysisAction(profile: LinkedInProfile) {
  try {
    const prompt = `
      Analyze this LinkedIn profile and provide a high-impact audit in JSON.
      Target Role: ${profile.jobRoleTarget}
      Headline: ${profile.headline}
      About: ${profile.about || 'N/A'}
      Skills: ${profile.skills.join(', ')}
      Followers: ${profile.followers}
      Connections: ${profile.connections}

      REQUIREMENTS:
      1. Headlines: 4 diverse styles (160-220 chars). Include one starting with "Aspiring" if they are a student or fresher.
      2. About Section: 3 distinct versions (800-1200 chars). 
         IMPORTANT: Use double newlines (\n\n) every 2-3 sentences.
      3. Strategy: 5 specific high-impact tips.
      4. Roasts: 3 brutal but helpful roasts.
      5. SEO Analysis: Identify 5 "Essential Keywords" for their role that are MISSING or UNDERUSED in their current profile.
      6. Recruiter Simulation: Write a 1-sentence internal "Recruiter Verdict" on their profile (e.g., "High potential, but lacks technical depth in About section").
      7. Emojis: DO NOT use any emojis in any part of the response.

      RETURN JSON ONLY. IMPORTANT: Do NOT include ANY emojis in the generated content (headlines, about sections, roasts, strategy tips, verdict). Use plain text and standard punctuation only.
      {
        "overallScore": number,
        "recruiterReadiness": number,
        "personalBrandScore": number,
        "atsScore": number,
        "topStrengths": string[],
        "topWeaknesses": string[],
        "headlines": { "style": string, "content": string }[],
        "abouts": { "style": string, "content": string }[],
        "experienceRewrites": { "style": string, "content": string }[],
        "posts": { "style": string, "content": string }[],
        "strategyTips": { "style": string, "content": string, "impact": "high" | "medium" | "low", "category": string }[],
        "seoKeywords": { "keyword": string, "importance": "high" | "medium", "reason": string }[],
        "recruiterVerdict": string,
        "roasts": { "section": string, "roast": string, "emoji": string }[]
      }
      `;

      const response = await callAI([{ role: 'user', content: prompt }], "You are a fast, professional LinkedIn auditor. Return ONLY valid JSON. Ensure the About section has frequent double-newlines for readability. NEVER use emojis.");
    
    // Attempt to parse JSON from the response
    let analysis;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      analysis = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI JSON:", e);
      throw new Error("The AI returned an invalid response format. Please try again.");
    }
    
    return { success: true, analysis };
  } catch (error: unknown) {
    console.error("AI Action Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}

export async function generatePostAction(topic: string, profile: LinkedInProfile | null) {
  try {
    const prompt = `
      Write a viral, high-impact LinkedIn post about the following topic: "${topic}"
      
      User Profile Context (if available):
      Name: ${profile?.name || 'User'}
      Role: ${profile?.jobRoleTarget || 'Professional'}
      Skills: ${profile?.skills.join(', ') || 'N/A'}

      REQUIREMENTS:
      1. Length: Must be 20+ lines of content.
      2. Hook: Start with a scroll-stopping hook (viral style).
      3. Structure: Use short sentences, bullet points, and clear spacing (line breaks).
      4. Value: Provide actionable insights or a compelling story.
      5. Tone: Professional yet engaging and authentic.
      6. Emojis: DO NOT use any emojis.
      7. Hashtags: Include 3-5 relevant hashtags at the end.

      The post should feel like it was written by a top 1% LinkedIn creator.
    `;

    const response = await callAI([{ role: 'user', content: prompt }], "You are a world-class LinkedIn ghostwriter. Return ONLY the post content.");
    
    return { success: true, content: response };
  } catch (error: unknown) {
    console.error("Generate Post Action Error:", error);
    return { success: false, error: String(error) };
  }
}

export async function polishConnectionMessageAction(
  draft: string,
  context: string,
  profile: LinkedInProfile | null
) {
  try {
    const prompt = `
      Polish and improve this LinkedIn connection request message.
      
      Context: Reaching out to a ${context}
      Sender Role: ${profile?.jobRoleTarget || 'Professional'}
      Sender Skills: ${profile?.skills?.join(', ') || 'N/A'}

      REQUIREMENTS:
      1. Keep it under 300 characters (LinkedIn limit for connection requests).
      2. Be professional, warm, and personalized.
      3. Do NOT use emojis.
      4. Keep the core intent of the original message.
      5. Make it feel genuine, not salesy.

      Original draft:
      "${draft}"

      Return ONLY the polished message text, nothing else.
    `;

    const response = await callAI(
      [{ role: 'user', content: prompt }],
      'You are a LinkedIn networking expert. Return ONLY the polished message. No quotes, no preamble.'
    );

    // Clean up any wrapping quotes from AI
    const cleaned = response.replace(/^["']|["']$/g, '').trim();

    return { success: true, content: cleaned };
  } catch (error: unknown) {
    console.error("Polish Message Error:", error);
    return { success: false, error: String(error) };
  }
}
