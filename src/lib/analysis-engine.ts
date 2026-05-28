import { LinkedInProfile, AuditResult, SectionScore, AISuggestion, ActionPlanDay, RoastItem } from '@/types';
import { getLetterGrade } from './utils';

function analyzePhoto(profile: LinkedInProfile): SectionScore {
  const score = profile.profilePhoto ? 8 : 2;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (profile.profilePhoto) {
    strengths.push('Profile photo is present');
    suggestions.push({ type: 'tip', title: 'Ensure professional lighting and clean background', impact: 'medium', category: 'Photo' });
  } else {
    weaknesses.push('No profile photo detected');
    suggestions.push({ type: 'warning', title: 'Add a professional headshot immediately', impact: 'high', category: 'Photo', suggested: 'Use a well-lit photo with a clean background, professional attire, and a friendly smile' });
  }
  return { name: 'Profile Photo', score, maxScore: 10, weight: 10, icon: '📸', color: '#8b5cf6', strengths, weaknesses, suggestions };
}

function analyzeBanner(profile: LinkedInProfile): SectionScore {
  const score = profile.customBanner ? 8 : 3;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (profile.customBanner) {
    strengths.push('Custom banner image detected');
  } else {
    weaknesses.push('Default LinkedIn banner detected');
    suggestions.push({ type: 'rewrite', title: 'Create a custom banner showcasing your brand', impact: 'high', category: 'Banner', current: 'Default LinkedIn banner', suggested: 'Design a custom banner featuring your role, key skills, and personal brand using Canva or Figma' });
  }
  return { name: 'Banner', score, maxScore: 10, weight: 5, icon: '🖼️', color: '#06b6d4', strengths, weaknesses, suggestions };
}

function analyzeHeadline(profile: LinkedInProfile): SectionScore {
  const h = profile.headline;
  let score = 3;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (h.length > 50) { score += 2; strengths.push('Good headline length'); }
  else { weaknesses.push('Headline is too short'); }
  if (h.includes('|') || h.includes('•') || h.includes('·')) { score += 2; strengths.push('Uses separators for clarity'); }
  else { weaknesses.push('No keyword separators used'); }
  const keywords = ['developer', 'engineer', 'designer', 'analyst', 'manager', 'lead', 'architect', 'consultant', 'specialist', 'founder'];
  if (keywords.some(k => h.toLowerCase().includes(k))) { score += 2; strengths.push('Contains role-specific keywords'); }
  else { weaknesses.push('Missing role-specific keywords'); }
  if (h.toLowerCase().includes('student at') || h.toLowerCase().includes('studying')) {
    score = Math.max(score - 2, 2);
    weaknesses.push('Generic student headline detected');
  }
  score = Math.min(score, 10);
  suggestions.push({
    type: 'rewrite', title: 'AI-Optimized Headline', impact: 'high', category: 'Headline',
    current: profile.headline,
    suggested: `Aspiring ${profile.jobRoleTarget} | ${profile.skills.slice(0, 3).join(' • ')} | Open to Opportunities`
  });
  return { name: 'Headline', score, maxScore: 10, weight: 15, icon: '✏️', color: '#f59e0b', strengths, weaknesses, suggestions };
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
    if (a.length > 500) { score += 1; }
    if (a.includes('•') || a.includes('-') || a.includes('✅') || a.includes('🚀')) { score += 1; strengths.push('Uses formatting for readability'); }
    else { weaknesses.push('Lacks visual formatting (bullets, emojis)'); }
    const achievementWords = ['built', 'led', 'increased', 'reduced', 'achieved', 'launched', 'created', 'developed', 'improved'];
    if (achievementWords.some(w => a.toLowerCase().includes(w))) { score += 2; strengths.push('Contains achievement-oriented language'); }
    else { weaknesses.push('Missing achievement-oriented language'); }
    if (a.split(/[.!?]/).length > 3) { score += 1; }
  }
  score = Math.min(score, 10);
  suggestions.push({
    type: 'rewrite', title: 'AI-Rewritten About Section', impact: 'high', category: 'About',
    current: profile.about,
    suggested: `🚀 Passionate ${profile.experienceLevel === 'Fresher' ? 'aspiring' : 'experienced'} ${profile.jobRoleTarget} with a focus on building impactful solutions.\n\n💡 Core Skills: ${profile.skills.slice(0, 5).join(', ')}\n\n🎯 Currently seeking opportunities in ${profile.industry} where I can leverage my technical expertise and drive innovation.\n\n📫 Let's connect and build something amazing together!`
  });
  return { name: 'About Section', score, maxScore: 10, weight: 15, icon: '📝', color: '#10b981', strengths, weaknesses, suggestions };
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
    if (hasMetrics) { score += 2; strengths.push('Uses quantifiable metrics'); }
    else { weaknesses.push('Missing quantifiable metrics in descriptions'); }
    const actionVerbs = ['led', 'built', 'developed', 'implemented', 'designed', 'launched', 'managed', 'architected', 'optimized', 'created'];
    const hasActions = exp.some(e => actionVerbs.some(v => e.description.toLowerCase().includes(v)));
    if (hasActions) { score += 2; strengths.push('Uses strong action verbs'); }
    else { weaknesses.push('Weak action verbs — use "Built", "Led", "Launched" instead of "Worked on"'); }
    if (exp.some(e => e.description.length > 100)) { score += 1; strengths.push('Detailed descriptions present'); }
  }
  score = Math.min(score, 10);
  if (exp.length > 0) {
    suggestions.push({
      type: 'rewrite', title: 'Improved Experience Description', impact: 'high', category: 'Experience',
      current: exp[0].description,
      suggested: `• Spearheaded development of key features using ${profile.skills.slice(0, 2).join(' and ')}, resulting in measurable impact\n• Collaborated with cross-functional teams to deliver projects 20% ahead of schedule\n• Implemented best practices that improved code quality and team productivity`
    });
  }
  return { name: 'Experience', score, maxScore: 10, weight: 20, icon: '💼', color: '#3b82f6', strengths, weaknesses, suggestions };
}

function analyzeSkills(profile: LinkedInProfile): SectionScore {
  const s = profile.skills;
  let score = 2;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (s.length >= 10) { score += 3; strengths.push(`${s.length} skills listed — great coverage`); }
  else if (s.length >= 5) { score += 2; strengths.push(`${s.length} skills listed`); weaknesses.push('Add more skills to reach 10+'); }
  else { weaknesses.push(`Only ${s.length} skills — aim for 10+`); }
  const trending = ['TypeScript', 'Next.js', 'Docker', 'AWS', 'Kubernetes', 'GraphQL', 'AI', 'Machine Learning', 'Python', 'Go', 'Rust'];
  const hasTrending = trending.filter(t => s.some(sk => sk.toLowerCase() === t.toLowerCase()));
  if (hasTrending.length >= 3) { score += 3; strengths.push(`Has trending skills: ${hasTrending.join(', ')}`); }
  else if (hasTrending.length >= 1) { score += 1; }
  const missing = trending.filter(t => !s.some(sk => sk.toLowerCase() === t.toLowerCase())).slice(0, 5);
  if (missing.length > 0) {
    suggestions.push({ type: 'improvement', title: 'Add trending skills', impact: 'medium', category: 'Skills', suggested: `Consider adding: ${missing.join(', ')}` });
  }
  score = Math.min(score, 10);
  return { name: 'Skills', score, maxScore: 10, weight: 10, icon: '⚡', color: '#ec4899', strengths, weaknesses, suggestions };
}

function analyzePosts(profile: LinkedInProfile): SectionScore {
  let score = 2;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (profile.postsPerWeek >= 3) { score += 4; strengths.push('Active poster — 3+ posts/week'); }
  else if (profile.postsPerWeek >= 1) { score += 2; weaknesses.push('Post more frequently — aim for 3/week'); }
  else { weaknesses.push('Very low posting activity'); }
  if (profile.averageEngagement >= 50) { score += 2; strengths.push('Good engagement on posts'); }
  else { weaknesses.push('Low engagement — improve content quality'); }
  if (profile.creatorMode) { score += 1; strengths.push('Creator mode enabled'); }
  else { suggestions.push({ type: 'tip', title: 'Enable Creator Mode', impact: 'medium', category: 'Content', suggested: 'Turn on Creator Mode to boost visibility and access LinkedIn Live, Newsletters, and Audio' }); }
  score = Math.min(score, 10);
  suggestions.push({ type: 'tip', title: 'Content Strategy', impact: 'high', category: 'Content', suggested: 'Post 3x/week: project showcases, learning updates, industry insights' });
  return { name: 'Content & Posts', score, maxScore: 10, weight: 10, icon: '📢', color: '#f97316', strengths, weaknesses, suggestions };
}

function analyzeSEO(profile: LinkedInProfile): SectionScore {
  let score = 3;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (profile.customUrl) { score += 1; strengths.push('Custom profile URL set'); }
  else { weaknesses.push('Using default profile URL'); }
  if (profile.seoKeywords.length >= 5) { score += 2; strengths.push('Good keyword coverage'); }
  else { weaknesses.push('Add more relevant keywords across your profile'); }
  const roleInHeadline = profile.headline.toLowerCase().includes(profile.jobRoleTarget.toLowerCase().split(' ')[0]);
  if (roleInHeadline) { score += 2; strengths.push('Target role appears in headline'); }
  else { weaknesses.push('Target role missing from headline'); }
  if (profile.about.length > 200) { score += 1; }
  score = Math.min(score, 10);
  suggestions.push({ type: 'improvement', title: 'SEO Optimization', impact: 'high', category: 'SEO', suggested: `Ensure "${profile.jobRoleTarget}" appears in headline, about, and experience sections for maximum search visibility` });
  return { name: 'SEO & Keywords', score, maxScore: 10, weight: 10, icon: '🔍', color: '#14b8a6', strengths, weaknesses, suggestions };
}

function analyzeEngagement(profile: LinkedInProfile): SectionScore {
  let score = 2;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: AISuggestion[] = [];
  if (profile.connections >= 500) { score += 3; strengths.push('500+ connections — strong network'); }
  else if (profile.connections >= 200) { score += 1; weaknesses.push('Grow your network to 500+'); }
  else { weaknesses.push(`Only ${profile.connections} connections — aim for 500+`); }
  if (profile.recommendations >= 3) { score += 2; strengths.push(`${profile.recommendations} recommendations received`); }
  else { weaknesses.push('Get more recommendations from colleagues'); }
  if (profile.featuredItems >= 2) { score += 2; strengths.push('Featured section is populated'); }
  else { weaknesses.push('Add items to your Featured section'); }
  score = Math.min(score, 10);
  suggestions.push({ type: 'tip', title: 'Engagement Boost', impact: 'medium', category: 'Engagement', suggested: 'Comment meaningfully on 5 posts daily, send 10 connection requests weekly' });
  return { name: 'Engagement', score, maxScore: 10, weight: 5, icon: '🤝', color: '#a855f7', strengths, weaknesses, suggestions };
}

function generateActionPlan(sections: SectionScore[]): ActionPlanDay[] {
  const sorted = [...sections].sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore));
  const plan: ActionPlanDay[] = [
    { day: 1, title: 'Update Profile Photo & Banner', description: 'First impressions matter most', tasks: ['Upload professional headshot', 'Create custom banner with Canva', 'Add your role and key skills to banner'], impact: 'high', completed: false },
    { day: 2, title: 'Rewrite Headline', description: 'Your headline is the #1 search factor', tasks: ['Use role | skills | value format', 'Include target keywords', 'Make it unique and compelling'], impact: 'high', completed: false },
    { day: 3, title: 'Revamp About Section', description: 'Tell your professional story', tasks: ['Write 3-5 paragraphs', 'Include achievements with metrics', 'Add call-to-action'], impact: 'high', completed: false },
    { day: 4, title: 'Enhance Experience', description: 'Make every role count', tasks: ['Add quantifiable metrics', 'Use strong action verbs', 'Highlight impact, not just duties'], impact: 'high', completed: false },
    { day: 5, title: 'Optimize Skills & Projects', description: 'Showcase your expertise', tasks: ['Add 10+ relevant skills', 'Add 3+ projects with descriptions', 'Request skill endorsements'], impact: 'medium', completed: false },
    { day: 6, title: 'Start Content Strategy', description: 'Build your personal brand', tasks: ['Post your first learning update', 'Comment on 5 industry posts', 'Share a project case study'], impact: 'medium', completed: false },
    { day: 7, title: 'Network & Engage', description: 'Grow your connections', tasks: ['Send 20 connection requests', 'Request 2 recommendations', 'Enable Creator Mode'], impact: 'medium', completed: false },
  ];
  return plan;
}

function generateRoasts(profile: LinkedInProfile, sections: SectionScore[]): RoastItem[] {
  const roasts: RoastItem[] = [];
  if (!profile.customBanner) roasts.push({ section: 'Banner', roast: "Your banner looks like LinkedIn forgot to load an image. Even a stock photo would be an upgrade.", emoji: '🖼️' });
  if (profile.headline.toLowerCase().includes('student at')) roasts.push({ section: 'Headline', roast: "\"Student at XYZ College\" — congratulations, you've told recruiters absolutely nothing useful.", emoji: '😬' });
  if (profile.about.length < 100) roasts.push({ section: 'About', roast: "Your About section has fewer words than a fortune cookie. Recruiters need more to work with.", emoji: '📝' });
  if (profile.connections < 200) roasts.push({ section: 'Network', roast: `${profile.connections} connections? Even my grandma has more LinkedIn connections.`, emoji: '👵' });
  if (profile.postsPerWeek < 1) roasts.push({ section: 'Content', roast: "Your posting frequency makes ghosts look active. LinkedIn thinks you've left the platform.", emoji: '👻' });
  if (profile.recommendations === 0) roasts.push({ section: 'Recommendations', roast: "Zero recommendations. Not even your mom wrote one for you?", emoji: '💀' });
  if (profile.skills.length < 5) roasts.push({ section: 'Skills', roast: "Your skills section is so empty, it echoes.", emoji: '🕳️' });
  if (profile.projects.length < 3) roasts.push({ section: 'Projects', roast: "With this many projects, recruiters might think coding is just your hobby.", emoji: '🎮' });
  if (roasts.length === 0) roasts.push({ section: 'Overall', roast: "Honestly, your profile is pretty solid. I'm struggling to roast you. Well played.", emoji: '👏' });
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
  const recruiterReadiness = Math.min(overallScore + Math.round(overallScore * 0.05 - 2), 100);
  const personalBrandScore = Math.round((profile.postsPerWeek * 10 + profile.followers / 100 + (profile.creatorMode ? 20 : 0) + profile.recommendations * 5) / 1.5);
  return {
    profile,
    overallScore,
    letterGrade: getLetterGrade(overallScore),
    recruiterReadiness: Math.max(recruiterReadiness, 10),
    sections,
    topStrengths: allStrengths,
    topWeaknesses: allWeaknesses,
    opportunities: ['Increase posting frequency', 'Get endorsements for top skills', 'Add more projects to showcase'],
    actionPlan: generateActionPlan(sections),
    careerPositioning: [profile.jobRoleTarget, ...profile.skills.slice(0, 3).map(s => `${s} Specialist`)],
    personalBrandScore: Math.min(personalBrandScore, 100),
    atsScore: Math.min(Math.round(overallScore * 0.95 + 3), 100),
    roastFeedback: generateRoasts(profile, sections),
  };
}
