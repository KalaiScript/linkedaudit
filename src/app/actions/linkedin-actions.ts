'use server';

import { LinkedInProfile } from '@/types';

export async function fetchLinkedInProfileAction(url: string): Promise<{ success: boolean; data?: Partial<LinkedInProfile>; error?: string }> {
  try {
    const apiKey = process.env.PROXYCURL_API_KEY;
    
    if (!apiKey) {
      return { 
        success: false, 
        error: "PROXYCURL_API_KEY is missing. LinkedIn blocks direct web scraping. To enable live data fetching, please add your Proxycurl API key to .env.local (https://nubela.co/proxycurl/)." 
      };
    }

    const response = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Proxycurl API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Map Proxycurl response to our LinkedInProfile structure
    return {
      success: true,
      data: {
        url: url,
        name: data.full_name,
        headline: data.headline,
        about: data.summary,
        location: `${data.city ? data.city + ', ' : ''}${data.country_full_name || ''}`,
        connections: data.connections || 0,
        followers: data.follower_count || 0,
        profilePhoto: !!data.profile_pic_url,
        customBanner: !!data.background_cover_image_url,
        experience: data.experiences?.map((exp: { title: string; company: string; starts_at?: { year?: number }; ends_at?: { year?: number }; description?: string }) => ({
          title: exp.title,
          company: exp.company,
          duration: `${exp.starts_at?.year || ''} - ${exp.ends_at?.year || 'Present'}`,
          description: exp.description || '',
          hasMetrics: /\d/.test(exp.description || ''),
          hasActionVerbs: true
        })) || [],
        skills: data.skills || [],
        certifications: data.certifications?.map((cert: { name: string; authority: string; starts_at?: { year?: number } }) => ({
          name: cert.name,
          issuer: cert.authority,
          year: cert.starts_at?.year ? cert.starts_at.year.toString() : '2024'
        })) || [],
        projects: data.projects || [],
        postsPerWeek: 2, // Proxycurl doesn't provide this directly on this endpoint
        averageEngagement: 50,
        recommendations: data.recommendations?.length || 0,
        searchAppearances: 50, // Simulated as it's private data
        creatorMode: true,
        contactInfo: true,
        customUrl: true
      }
    };

  } catch (error: unknown) {
    console.error("LinkedIn Fetch Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}
