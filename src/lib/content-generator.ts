import { ContentRewrite } from '@/types';

export function generateHeadlines(role: string, skills: string[], level: string): ContentRewrite[] {
  const s = skills.slice(0, 3).join(' • ');
  const majorSkills = skills.slice(0, 4).join(' | ');
  
  return [
    { type: 'headline', style: 'Professional', content: `${level === 'Fresher' ? 'Aspiring' : 'Results-Driven'} ${role} | ${s} | Building Scalable & Impactful Solutions` },
    { type: 'headline', style: 'Keyword-Rich', content: `${role} | ${majorSkills} | Open to ${level === 'Fresher' ? 'Internships' : 'Strategic Opportunities'} | Problem Solver` },
    { type: 'headline', style: 'Value-Driven', content: `Helping businesses scale through efficient ${skills[0] || 'software'} solutions | ${role} | ${skills[1] || 'Tech'} Enthusiast` },
    { type: 'headline', style: 'Brand-Focused', content: `Turning Complex Challenges into Simple Code 🚀 | ${role} | Passionate about ${skills[0]} & ${skills[1]}` },
    { type: 'headline', style: 'Recruiter-Optimized', content: `${role} with expertise in ${s} | Specialized in ${skills[3] || 'Development'} | Let's connect!` },
    { type: 'headline', style: 'Thought-Leader', content: `${role} | ${skills.slice(0, 2).join(' & ')} Specialist | Sharing insights on Modern Tech Trends` },
    { type: 'headline', style: 'Action-Oriented', content: `${role} | Architecting the future with ${skills[0]} | Constant Learner` },
  ];
}

export function generateAboutSections(role: string, skills: string[], level: string, industry: string): ContentRewrite[] {
  const s = skills.slice(0, 5).join(', ');
  const topSkill = skills[0] || 'Software Engineering';
  
  return [
    {
      type: 'about', style: 'Executive Summary',
      content: `🚀 ${level === 'Fresher' ? 'Aspiring' : 'Dedicated'} ${role} with a deep passion for ${industry} innovation. My focus is on leveraging ${topSkill} to solve real-world problems and drive user engagement.\n\n🛠 Technical Arsenal:\n• Languages: ${skills.slice(0, 3).join(', ')}\n• Frameworks: ${skills.slice(3, 6).join(', ')}\n• Tools: Git, Docker, AWS, CI/CD\n\n🎯 What I Bring to the Table:\n- High-quality, maintainable code standards\n- Agile mindset and collaborative spirit\n- Proven ability to learn and adapt to new tech stacks quickly\n\n📫 I'm always open to discussing ${level === 'Fresher' ? 'internships and entry-level roles' : 'innovative projects and leadership opportunities'}. Let's build the future together!`
    },
    {
      type: 'about', style: 'Story-Based',
      content: `My journey into ${industry} started with a single line of code and an insatiable curiosity about how things work.\n\nToday, as a ${role}, I specialize in ${s}, building solutions that bridge the gap between complex backend logic and seamless user experiences. I don't just write code; I build products that matter.\n\nKey Philosophy:\n✅ Code is for humans, not just machines\n✅ User experience is the ultimate metric of success\n✅ Continuous iteration beats delayed perfection\n\nWhen I'm not coding, you'll find me exploring ${skills[skills.length-1] || 'new tech'} or contributing to open-source projects. Let's connect!`
    },
    {
      type: 'about', style: 'Value-Focused',
      content: `I help companies in ${industry} optimize their technical infrastructure and deliver superior digital products.\n\nAs a ${role}, I've focused my career on mastering ${topSkill}. Whether it's architecting a new system or refactoring legacy code, my goal is always the same: efficiency, scalability, and reliability.\n\n📊 Key Highlights:\n- Optimized performance in multiple high-impact projects\n- Integrated modern tech stacks to reduce system latency\n- Collaborated with design teams to improve UI responsiveness\n\nCurrently exploring the intersection of ${skills[0]} and AI. Open to networking with fellow ${role}s and industry leaders.`
    },
    {
      type: 'about', style: 'Modern & Minimal',
      content: `${role} | ${skills.slice(0, 4).join(' • ')}\n\nPassionate about building clean, efficient, and user-centric applications. \n\nFocus: ${skills[0]}, ${skills[1]}, ${skills[2]}\nInterest: ${industry}, Open Source, Tech Mentorship\n\n"Simplicity is the ultimate sophistication."\n\nLet's connect. 📧`
    },
  ];
}

export function generateExperienceRewrites(title: string, company: string, description: string, skills: string[]): ContentRewrite[] {
  return [
    {
      type: 'experience', style: 'Impact-Focused',
      content: `• Spearheaded the development of high-traffic modules using ${skills[0]} and ${skills[1]}, resulting in measurable system reliability improvements.\n• Collaborated with cross-functional teams to deliver comprehensive ${skills[2]} solutions ahead of schedule.\n• Optimized existing codebases, reducing technical debt and improving developer productivity.\n• Conducted regular code reviews and mentored junior developers to ensure high standards of code quality.`
    },
    {
      type: 'experience', style: 'Metrics-Driven',
      content: `• Engineered and deployed scalable features using ${skills.slice(0, 3).join(', ')}.\n• Improved application load time by 40% through advanced performance optimization techniques.\n• Managed complex data workflows that improved processing speed for large datasets.\n• Reduced production bugs significantly by implementing a robust automated testing suite.`
    },
    {
      type: 'experience', style: 'Leadership-Oriented',
      content: `• Led the technical design and implementation of core product features using ${skills[0]}.\n• Facilitated agile ceremonies, improving team velocity and collaboration.\n• Established new documentation standards that reduced onboarding time for new team members.\n• Represented the engineering team in stakeholder meetings, translating technical requirements into business value.`
    },
  ];
}

export function generatePosts(role: string, skills: string[]): ContentRewrite[] {
  const topSkill = skills[0] || 'Software Development';
  return [
    {
      type: 'post', style: 'Technical Insight',
      content: `Have you ever wondered why [Technical Concept] is so critical in ${topSkill}?\n\nAfter working with ${skills[1]} for a while, I realized that many people overlook [Common Mistake].\n\nHere are 3 tips to avoid it:\n1️⃣ Tip One: Focus on [Detail]\n2️⃣ Tip Two: Implement [Best Practice]\n3️⃣ Tip Three: Test with [Tool]\n\nMastering these small details is what separates good code from great code.\n\nWhat's your take on this? Let's discuss in the comments! 👇\n\n#${topSkill.replace(/[.\s]/g, '')} #CodingTips #SoftwareEngineering #TechInsights`
    },
    {
      type: 'post', style: 'Project Launch',
      content: `🚀 I'm thrilled to share my latest project: [Project Name]!\n\nThis project solves [Problem] using a modern stack: ${skills[0]}, ${skills[1]}, and ${skills[2]}.\n\nWhat I learned during this build:\n🔹 Building for scale requires strategic planning\n🔹 ${skills[0]} is incredibly powerful for [Specific Task]\n🔹 User feedback is the best debugger\n\nCheck it out here: [Link]\n\nWould love to hear your thoughts! 💬\n\n#BuildInPublic #OpenSource #DeveloperCommunity #${skills[0].replace(/[.\s]/g, '')}`
    },
    {
      type: 'post', style: 'Career Reflection',
      content: `The tech industry moves fast. 💨\n\nWhen I started as a ${role}, I thought technical skills were everything. I quickly learned that soft skills and a growth mindset are just as vital.\n\nMy top 3 career lessons so far:\n1. Never stop being a student.\n2. Collaboration > Competition.\n3. Documentation is a gift to your future self.\n\nTo all my fellow developers: What's one lesson you wish you knew earlier?\n\n#CareerGrowth #TechLife #DevJourney #${role.replace(/\s/g, '')}`
    },
    {
      type: 'post', style: 'Industry Trend',
      content: `Is ${skills[0]} the future of [Specific Domain]? 🧐\n\nI've been seeing a huge shift towards [Trend] recently. As a ${role}, it's exciting to keep up with these innovations.\n\nKey benefits of this trend:\n✅ Scalability\n✅ Efficiency\n✅ Security\n\nAre you adopting this in your workflow? Why or why not?\n\n#TechTrends #FutureOfWork #${skills[0].replace(/[.\s]/g, '')} #Innovation`
    },
  ];
}

export function generateAISuggestions(role: string, skills: string[], level: string): ContentRewrite[] {
  return [
    {
      type: 'about' as any, style: 'Profile Strategy',
      content: `💡 AI Suggestion: Your headline should focus on the *value* you provide, not just your job title. Instead of "${role}", try "Helping companies build ${skills[0] || 'scalable'} solutions as a ${role}". This makes you stand out to recruiters immediately.`
    },
    {
      type: 'about' as any, style: 'Content Strategy',
      content: `💡 AI Suggestion: You have great expertise in ${skills.slice(0, 2).join(' and ')}. Start sharing weekly insights about these. Engagement increases by 40% when you post consistent, value-driven content rather than just personal updates.`
    },
    {
      type: 'about' as any, style: 'Experience Strategy',
      content: `💡 AI Suggestion: In your experience section, use "Action Verbs" like "Spearheaded", "Architected", and "Optimized". Ensure every bullet point follows the X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]".`
    },
    {
      type: 'about' as any, style: 'Networking Strategy',
      content: `💡 AI Suggestion: Since you are a ${level} ${role}, focus on connecting with senior engineers and tech leads in the ${skills[0] || 'tech'} space. Personalized connection requests mentioning their recent work can lead to a 3x higher acceptance rate.`
    },
  ];
}
