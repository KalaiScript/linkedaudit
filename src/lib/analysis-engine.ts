import { LinkedInProfile, AuditResult, SectionScore, AISuggestion, ActionPlanDay, RoastItem } from '@/types';
import { getLetterGrade } from './utils';

function analyzePhoto(profile: LinkedInProfile): SectionScore {
  const score = profile.profilePhoto ? 10 : 2;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (profile.profilePhoto) {
    strengths.push('Profile photo is present and professional');
  } else {
    weaknesses.push('No profile photo detected');
    suggestions.push({ type: 'warning', title: 'Add a professional headshot', impact: 'high', category: 'Photo', suggested: 'Use a well-lit photo with a clean background and professional attire' });
  }
  return { name: 'Profile Photo', score, maxScore: 10, weight: 10, icon: '', color: '#8b5cf6', strengths, weaknesses, suggestions };
}

function analyzeBanner(profile: LinkedInProfile): SectionScore {
  const score = profile.customBanner ? 10 : 3;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (profile.customBanner) {
    strengths.push('High-impact custom banner detected');
  } else {
    weaknesses.push('Default LinkedIn banner detected');
    suggestions.push({ type: 'rewrite', title: 'Create a custom banner', impact: 'high', category: 'Banner', current: 'Default LinkedIn banner', suggested: 'Design a custom banner featuring your role, key skills, and personal brand' });
  }
  return { name: 'Banner', score, maxScore: 10, weight: 5, icon: '', color: '#06b6d4', strengths, weaknesses, suggestions };
}

function isHighImpact(h: string): boolean {
  return h.includes('Impressions') || h.includes('Followers') || h.includes('Optimized') || h.includes('Strategist');
}

function analyzeHeadline(profile: LinkedInProfile): SectionScore {
  const h = profile.headline;
  let score = 3;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  
  if (h.length > 50) { score += 1; strengths.push('Good headline length'); }
  if (h.length > 100) { score += 2; strengths.push('Detailed, informative headline'); }
  else if (h.length < 40) { weaknesses.push('Headline is too short'); }

  if (h.includes('|') || h.includes('•') || h.includes('·')) { score += 2; strengths.push('Uses separators for clarity'); }
  else { weaknesses.push('No keyword separators used'); }

  const keywords = ['developer', 'engineer', 'designer', 'analyst', 'manager', 'lead', 'architect', 'consultant', 'specialist', 'founder', 'strategist', 'creator', 'optimization'];
  if (keywords.some(k => h.toLowerCase().includes(k))) { score += 3; strengths.push('Contains high-intent role keywords'); }
  else { weaknesses.push('Missing role-specific keywords'); }

  if (isHighImpact(h)) { score += 2; strengths.push('Showcases measurable social proof'); }

  if (h.toLowerCase().includes('student at') && !isHighImpact(h)) {
    score = Math.max(score - 2, 2);
    weaknesses.push('Generic student headline');
  }

  score = Math.min(score, 10);
  
  // Custom suggestion based on current headline and role
  let suggestedHeadline = `${profile.jobRoleTarget} | ${profile.skills.slice(0, 3).join(' • ')} | Helping companies build impactful solutions through tech innovation | ${profile.followers > 0 ? profile.followers + '+ Followers' : 'Building in Public'}`;
  
  if (profile.jobRoleTarget.toLowerCase().includes('engineer') || profile.jobRoleTarget.toLowerCase().includes('developer')) {
    suggestedHeadline = `${profile.jobRoleTarget} • ${profile.skills.slice(0, 4).join(' • ')} | Optimizing Scalable Systems & High-Performance Web Apps | 6K+ Reach & Growing`;
  }

  suggestions.push({
    type: 'rewrite', title: 'AI-Optimized Headline', impact: 'high', category: 'Headline',
    current: profile.headline,
    suggested: suggestedHeadline
  });
  return { name: 'Headline', score, maxScore: 10, weight: 15, icon: '', color: 'var(--accent-blue)', strengths, weaknesses, suggestions };
}

function analyzeAbout(profile: LinkedInProfile): SectionScore {
  const a = profile.about;
  let score = 2;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (!a || a.length < 20) { weaknesses.push('About section is missing or too short'); }
  else {
    if (a.length > 200) { score += 2; strengths.push('Good length for storytelling'); }
    if (a.length > 500) { score += 2; strengths.push('Comprehensive summary'); }
    if (a.includes('•') || a.includes('-')) { score += 2; strengths.push('Uses formatting for readability'); }
    else { weaknesses.push('Lacks visual formatting (bullets)'); }
    const achievementWords = ['built', 'led', 'increased', 'reduced', 'achieved', 'launched', 'created', 'developed', 'improved', 'optimized', 'helped'];
    if (achievementWords.some(w => a.toLowerCase().includes(w))) { score += 2; strengths.push('Contains achievement-oriented language'); }
    else { weaknesses.push('Missing achievement-oriented language'); }
  }
  score = Math.min(score, 10);

  const suggestedAbout = `Passionate ${profile.jobRoleTarget} with expertise in ${profile.skills.slice(0, 3).join(', ')}.

What I Do:
I specialize in building robust solutions that solve complex technical challenges and deliver business value.

Key Achievements:
• Spearheaded development of core features for ${profile.industry} projects
• Optimized application performance, resulting in improved user engagement
• Collaborated with cross-functional teams to deliver high-quality codebases

Technical Stack:
${profile.skills.join(' • ')}

Let's connect and discuss how I can add value to your team!`;

  suggestions.push({
    type: 'rewrite', title: 'High-Impact About Section', impact: 'high', category: 'About',
    current: profile.about,
    suggested: suggestedAbout
  });

  return { name: 'About Section', score, maxScore: 10, weight: 15, icon: '', color: '#10b981', strengths, weaknesses, suggestions };
}

function analyzeExperience(profile: LinkedInProfile): SectionScore {
  const exp = profile.experience;
  let score = 2;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (exp.length === 0) { weaknesses.push('No experience entries found'); }
  else {
    if (exp.length >= 2) { score += 2; strengths.push(`${exp.length} experience entries found`); }
    else { score += 1; }
    const hasMetrics = exp.some(e => e.hasMetrics || /\d+%|\d+x|\d+\+/.test(e.description));
    if (hasMetrics) { score += 3; strengths.push('Uses quantifiable metrics'); }
    else { weaknesses.push('Missing quantifiable metrics in descriptions'); }
    const actionVerbs = ['led', 'built', 'developed', 'implemented', 'designed', 'launched', 'managed', 'architected', 'optimized', 'created', 'helped'];
    const hasActions = exp.some(e => actionVerbs.some(v => e.description.toLowerCase().includes(v)));
    if (hasActions) { score += 2; strengths.push('Uses strong action verbs'); }
    else { weaknesses.push('Weak action verbs'); }
    if (exp.some(e => e.description.length > 100)) { score += 1; strengths.push('Detailed descriptions'); }
  }
  score = Math.min(score, 10);
  return { name: 'Experience', score, maxScore: 10, weight: 20, icon: '', color: '#3b82f6', strengths, weaknesses, suggestions };
}

function analyzeSkills(profile: LinkedInProfile): SectionScore {
  const s = profile.skills;
  let score = 2;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (s.length >= 10) { score += 4; strengths.push(`${s.length} skills listed — great coverage`); }
  else if (s.length >= 5) { score += 2; strengths.push(`${s.length} skills listed`); }
  else { weaknesses.push('Add more skills to reach 10+'); }
  const trending = ['TypeScript', 'Next.js', 'Docker', 'AWS', 'AI', 'Machine Learning', 'Python', 'Go', 'Rust', 'DSA'];
  const hasTrending = trending.filter(t => s.some(sk => sk.toLowerCase() === t.toLowerCase()));
  if (hasTrending.length >= 2) { score += 4; strengths.push(`Has trending skills: ${hasTrending.join(', ')}`); }
  score = Math.min(score, 10);
  return { name: 'Skills', score, maxScore: 10, weight: 10, icon: '', color: '#ec4899', strengths, weaknesses, suggestions };
}

function analyzePosts(profile: LinkedInProfile): SectionScore {
  let score = 2;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (profile.postsPerWeek >= 4) { score += 5; strengths.push('High content frequency'); }
  else if (profile.postsPerWeek >= 1) { score += 2; strengths.push('Regular posting activity'); }
  else { weaknesses.push('Low posting activity'); }
  if (profile.averageEngagement >= 100) { score += 3; strengths.push('Exceptional engagement'); }
  else if (profile.averageEngagement >= 20) { score += 1; strengths.push('Good engagement'); }
  if (profile.creatorMode) { score += 1; strengths.push('Creator mode enabled'); }
  score = Math.min(score, 10);
  return { name: 'Content & Posts', score, maxScore: 10, weight: 10, icon: '', color: '#06b6d4', strengths, weaknesses, suggestions };
}

function analyzeSEO(profile: LinkedInProfile): SectionScore {
  let score = 2;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  
  if (profile.customUrl) { score += 2; strengths.push('Custom profile URL set'); }
  else { weaknesses.push('Default long URL is less searchable'); }

  if (profile.seoKeywords.length >= 5) { score += 2; strengths.push('Good keyword coverage'); }
  
  const roleInHeadline = profile.headline.toLowerCase().includes(profile.jobRoleTarget.toLowerCase().split(' ')[0]);
  if (roleInHeadline) { score += 2; strengths.push('Target role found in headline'); }
  else { weaknesses.push('Target role missing from headline'); }

  // Dynamic score based on search appearances (thresholds)
  if (profile.searchAppearances > 100) { score += 2; strengths.push('High search frequency'); }
  else if (profile.searchAppearances > 50) { score += 1; strengths.push('Moderate search frequency'); }
  else { weaknesses.push('Low search appearances'); }

  score = Math.min(score, 10);
  return { name: 'SEO & Keywords', score, maxScore: 10, weight: 10, icon: '', color: '#14b8a6', strengths, weaknesses, suggestions };
}

function analyzeEngagement(profile: LinkedInProfile): SectionScore {
  let score = 2;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (profile.connections >= 500) { score += 4; strengths.push('500+ connections — strong network'); }
  else { weaknesses.push(`Only ${profile.connections} connections`); }
  if (profile.followers >= 5000) { score += 3; strengths.push('Significant following (5K+)'); }
  else if (profile.followers >= 1000) { score += 1; strengths.push('Growing following (1K+)'); }
  if (profile.recommendations >= 5) { score += 1; strengths.push('Highly recommended'); }
  score = Math.min(score, 10);
  return { name: 'Engagement', score, maxScore: 10, weight: 5, icon: '', color: '#a855f7', strengths, weaknesses, suggestions };
}

function generateActionPlan(sections: SectionScore[]): ActionPlanDay[] {
  const plan: ActionPlanDay[] = [
    { day: 1, title: 'Visual Presence', description: 'Optimize your visual brand', tasks: ['Review banner for impact', 'Update profile photo if needed'], impact: 'high', completed: false },
    { day: 2, title: 'Headline Strategy', description: 'Maximize search visibility', tasks: ['Add social proof to headline', 'Include core role and secondary skills'], impact: 'high', completed: false },
    { day: 3, title: 'About Section Story', description: 'Narrate your journey', tasks: ['Add clear achievements', 'Use bullet points for readability'], impact: 'high', completed: false },
    { day: 4, title: 'Experience Metrics', description: 'Prove your value', tasks: ['Add % or $ figures to roles', 'Use "Spearheaded" and "Optimized"'], impact: 'high', completed: false },
    { day: 5, title: 'Skills & Endorsements', description: 'Build technical authority', tasks: ['Reorder top 3 skills', 'Get 5 endorsements today'], impact: 'medium', completed: false },
    { day: 6, title: 'Content Engine', description: 'Scale your influence', tasks: ['Schedule 3 posts for next week', 'Engage with top creators'], impact: 'medium', completed: false },
    { day: 7, title: 'Network Optimization', description: 'Deepen your connections', tasks: ['Send 10 personalized invites', 'Update Featured section'], impact: 'medium', completed: false },
  ];
  return plan;
}

function generateRoasts(profile: LinkedInProfile, sections: SectionScore[]): RoastItem[] {
  const roasts: RoastItem[] = [];
  if (profile.followers > 5000) roasts.push({ section: 'Success', roast: "With this many followers, why are you even using this tool? You're practically an influencer.", emoji: '' });
  else if (profile.connections < 200) roasts.push({ section: 'Network', roast: "Only 200 connections? Are you using LinkedIn or a private group chat?", emoji: '' });
  
  if (profile.headline.length > 150) roasts.push({ section: 'Headline', roast: "Your headline is long enough to be a short story. Chill with the keywords.", emoji: '' });
  
  if (roasts.length === 0) roasts.push({ section: 'Overall', roast: "Your profile is dangerously close to being perfect. I'm bored.", emoji: '' });
  return roasts;
}

export function analyzeProfile(profile: LinkedInProfile): AuditResult {
  const sections: SectionScore[] = [
    analyzePhoto(profile),
    analyzeBanner(profile),
    analyzeHeadline(profile),
    analyzeAbout(profile),
    analyzeExperience(profile),
    analyzeSkills(profile),
    analyzePosts(profile),
    analyzeSEO(profile),
    analyzeEngagement(profile),
  ];
  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
  const weightedScore = sections.reduce((sum, s) => sum + (s.score / s.maxScore) * s.weight, 0);
  const overallScore = Math.round((weightedScore / totalWeight) * 100);
  const allStrengths = sections.flatMap(s => s.strengths).slice(0, 5);
  const allWeaknesses = sections.flatMap(s => s.weaknesses).slice(0, 5);
  const recruiterReadiness = Math.min(overallScore + 5, 100);
  const personalBrandScore = Math.min(Math.round((profile.postsPerWeek * 10 + profile.followers / 50 + (profile.creatorMode ? 20 : 0) + profile.recommendations * 5) / 1.5), 100);
  return {
    profile,
    overallScore,
    letterGrade: getLetterGrade(overallScore),
    recruiterReadiness: Math.max(recruiterReadiness, 10),
    sections,
    topStrengths: allStrengths,
    topWeaknesses: allWeaknesses,
    opportunities: ['Collaborate with other creators', 'Diversify content formats', 'Scale post frequency'],
    actionPlan: generateActionPlan(sections),
    careerPositioning: [profile.jobRoleTarget, ...profile.skills.slice(0, 3).map(s => `${s} Specialist`)],
    personalBrandScore: Math.min(personalBrandScore, 100),
    atsScore: Math.min(Math.round(overallScore * 0.98), 100),
    roastFeedback: generateRoasts(profile, sections),
  };
}
