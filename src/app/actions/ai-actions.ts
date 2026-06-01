'use server';

import { callAI } from '@/lib/ai-service';
import { LinkedInProfile } from '@/types';

export async function getFullAIAnalysisAction(profile: LinkedInProfile) {
  try {
    const prompt = `
      You are a world-class LinkedIn Profile Auditor and Career Brand Strategist. 
      Analyze the following profile data and provide a comprehensive, high-impact audit in JSON format.

      PROFILE DATA:
      Name: ${profile.name}
      Target Role: ${profile.jobRoleTarget}
      Industry: ${profile.industry}
      Headline: ${profile.headline}
      About: ${profile.about || 'EMPTY - PLEASE GENERATE A HIGH-IMPACT ABOUT SECTION BASED ON HEADLINE AND SKILLS'}
      Skills: ${profile.skills.join(', ')}
      Followers: ${profile.followers}
      Connections: ${profile.connections}
      Years of Experience: ${(profile as any).yearsOfExperience || 'N/A'}
      Is Fresher: ${(profile as any).isFresher ? 'Yes' : 'No'}

      REQUIREMENTS:
      1. Headlines: 3 distinct multi-line styles (160-220 chars).
      2. About Sections: 2 comprehensive versions (1000-1500 chars). IF input About was EMPTY, craft these from scratch using the brand identity provided.
      3. Strategy Tips: 5 specific, multi-step execution plans.
      4. Experience: Rewrite the provided experience or craft a "Fresher/Aspiring" summary if they are a fresher.

      EXPECTED JSON STRUCTURE:
      {
        "overallScore": number (0-100),
        "recruiterReadiness": number (0-100),
        "personalBrandScore": number (0-100),
        "atsScore": number (0-100),
        "topStrengths": string[],
        "topWeaknesses": string[],
        "headlines": { style: string, content: string }[],
        "abouts": { style: string, content: string }[],
        "experienceRewrites": { style: string, content: string }[],
        "posts": { style: string, content: string }[],
        "strategyTips": { style: string, content: string }[],
        "roasts": { section: string, roast: string, emoji: string }[]
      }

      CRITICAL: Return ONLY valid JSON. Be professional, metrics-oriented, and sophisticated. The "abouts" and "strategyTips" MUST be detailed, not one-liners.
    `;

    const response = await callAI(prompt, "You are a professional LinkedIn API analyst. Return ONLY a valid JSON object.");
    
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
  } catch (error: any) {
    console.error("AI Action Error:", error);
    return { success: false, error: error.message };
  }
}
