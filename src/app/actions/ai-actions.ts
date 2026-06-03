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
      1. Headlines: 3 styles (160-220 chars).
      2. About: 2 versions (800-1200 chars).
      3. Strategy: 5 specific tips.
      4. Roasts: 3 brutal but helpful roasts.

      RETURN JSON ONLY:
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
        "strategyTips": { "style": string, "content": string }[],
        "roasts": { "section": string, "roast": string, "emoji": string }[]
      }
    `;

    const response = await callAI([{ role: 'user', content: prompt }], "You are a fast, professional LinkedIn auditor. Return ONLY valid JSON.");
    
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
