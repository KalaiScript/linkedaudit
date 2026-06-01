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
      About: ${profile.about}
      Skills: ${profile.skills.join(', ')}
      Followers: ${profile.followers}
      Connections: ${profile.connections}
      Search Appearances: ${profile.searchAppearances}

      REQUIREMENTS FOR CONTENT GENERATION:
      1. Headlines: Provide 3 distinct styles (e.g., "Keyword Optimized", "Storytelling", "Metric-Driven"). Each headline should be 160-220 characters, using separators (| or •), and include a clear value proposition + social proof.
      2. About Sections: Provide 2 comprehensive versions. Structure each with:
         - A "Hook" (1-2 lines to grab attention)
         - "What I Do" (Value proposition)
         - "Key Achievements" (3-5 bullet points with QUANTIFIABLE METRICS like %, $, or #)
         - "Core Expertise" (Tech stack or skills)
         - "Call to Action" (How to reach out)
         Each version should be 1000-1500 characters.
      3. Strategy Tips: Provide 5 detailed, multi-line actionable strategies. Don't give simple advice; provide specific steps on HOW to execute.
      4. Experience Rewrites: Take their "Experience Description" and rewrite it into a high-impact, results-oriented format using the STAR method.

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
