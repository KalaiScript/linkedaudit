import { ContentRewrite } from '@/types';

export function generateHeadlines(role: string, skills: string[], level: string): ContentRewrite[] {
  const s = skills.slice(0, 3).join(' • ');
  const majorSkills = skills.slice(0, 4).join(' | ');
  
  // Detect if the user is a Brand Creator/Strategist based on role
  const isBrandOriented = role.toLowerCase().includes('brand') || role.toLowerCase().includes('creator') || role.toLowerCase().includes('strategist');

  if (isBrandOriented) {
    return [
      { type: 'headline', style: 'Authority-Boosted', content: `${role} | Helping 30+ Professionals Dominate LinkedIn 🚀 | 3.5M+ Impressions | ${skills[0]} • ${skills[1]}` },
      { type: 'headline', style: 'Metric-Heavy', content: `${role} & Tech Enthusiast | 6K+ Followers | Building High-Impact Personal Brands | Expert in ${s}` },
      { type: 'headline', style: 'Strategic-Flow', content: `Personal Brand Strategist | ${role} | ${majorSkills} | Transforming Profiles into Recruiter Magnets 🎯` },
      { type: 'headline', style: 'Mission-Driven', content: `Empowering Students & Developers to Scale their Careers through Branded Content | ${role} | ${skills[0]} Specialist` },
      { type: 'headline', style: 'The Closer', content: `${role} | 30+ Profiles Optimized | Content Strategy & Growth | Let's build your legacy.` },
    ];
  }
  
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
  const secondarySkill = skills[1] || 'Modern Tech Stack';
  
  return [
    {
      type: 'post', style: 'Technical Insight',
      content: `Have you ever wondered why [Technical Concept] is so critical in ${topSkill}?\n\nAfter working with ${secondarySkill} for a while, I realized that many people overlook [Common Mistake]. It's a subtle issue that can lead to significant technical debt if left unchecked. \n\nHere are my top 5 tips to avoid this and build more robust systems:\n\n1️⃣ Tip One: Focus on [Detail] - This is the foundation of clean code.\n2️⃣ Tip Two: Implement [Best Practice] - Consistency across your team is key.\n3️⃣ Tip Three: Test with [Tool] - Never trust your code until it's verified.\n4️⃣ Tip Four: Document [Reasoning] - Future you will thank you for the context.\n5️⃣ Tip Five: Peer Reviews - A second pair of eyes catches what you miss.\n\nMastering these small details is what separates good code from great code. In the fast-paced world of ${topSkill}, staying disciplined with your engineering standards is the only way to scale effectively. \n\nI've seen projects succeed and fail based solely on how they handled these fundamental concepts. Don't let your project be the one that fails because of a skipped step.\n\nWhat's your take on this? Do you think [Technical Concept] is overhyped, or is it the secret sauce for your team? \n\nLet's discuss in the comments! 👇\n\n#${topSkill.replace(/[.\s]/g, '')} #CodingTips #SoftwareEngineering #TechInsights #CleanCode #WebDev #EngineeringExcellence`
    },
    {
      type: 'post', style: 'Project Launch',
      content: `🚀 I'm thrilled to share my latest project: [Project Name]!\n\nThis project solves [Problem] using a modern stack: ${skills[0]}, ${skills[1]}, and ${skills[2]}. It's been an incredible journey from the initial whiteboard sketch to the final deployment. \n\nKey features include:\n✨ Real-time [Feature Name]\n✨ Highly scalable [Backend Component]\n✨ Seamless UI/UX built with [Frontend Tool]\n\nWhat I learned during this intensive build:\n\n🔹 Building for scale requires strategic planning from Day 1. You can't just bolt it on later.\n🔹 ${skills[0]} is incredibly powerful for [Specific Task] when configured correctly.\n🔹 User feedback is the best debugger - early testing saved me weeks of rework.\n🔹 Automation is your best friend - CI/CD pipelines made deployment a breeze.\n\nCheck out the live demo here: [Link]\nAnd the source code is open for review: [GitHub Link]\n\nThis project pushed me to master ${skills[2]} in ways I hadn't imagined. I'm excited to apply these learnings to my next big challenge. \n\nWould love to hear your thoughts or answer any questions about the architecture! 💬\n\n#BuildInPublic #OpenSource #DeveloperCommunity #${skills[0].replace(/[.\s]/g, '')} #ProjectLaunch #SoftwareArchitecture #IndieDev`
    },
    {
      type: 'post', style: 'Career Reflection',
      content: `The tech industry moves fast. 💨\n\nWhen I started my journey as a ${role}, I thought technical skills were everything. I spent all my time mastering ${skills[0]} and ${skills[1]}, thinking that was the only path to success. \n\nI quickly learned that while code is important, the human element is what truly drives innovation. Soft skills and a growth mindset are just as vital as your ability to debug a complex system.\n\nMy top 5 career lessons from the trenches:\n\n1. Never stop being a student. The moment you think you know it all is the moment you start falling behind.\n2. Collaboration > Competition. We build better products when we work together and share knowledge.\n3. Documentation is a gift to your future self. Write it down now, so you don't have to remember it in 6 months.\n4. Fail fast and learn faster. Mistakes are just data points on the road to success.\n5. Personal branding matters. Sharing your work opens doors you didn't even know existed.\n\nTo all my fellow developers: What's one lesson you wish you knew when you first started? Whether it's a technical tip or a piece of career advice, I'd love to hear it. \n\nLet's help the next generation of engineers grow! 🚀\n\n#CareerGrowth #TechLife #DevJourney #${role.replace(/\s/g, '')} #Mentorship #TechCareers #ContinuousLearning`
    },
    {
      type: 'post', style: 'Industry Trend',
      content: `Is ${skills[0]} the future of [Specific Domain]? 🧐\n\nI've been seeing a huge shift towards [Trend] recently, especially within the ${topSkill} community. As a ${role}, it's exciting (and a bit daunting) to keep up with these rapid innovations.\n\nKey benefits of this trend that I've observed:\n\n✅ Massive Scalability: Handling millions of users with ease.\n✅ Improved Developer Velocity: Getting features to market faster than ever.\n✅ Enhanced Security: Protecting user data by default, not as an afterthought.\n✅ Cost Efficiency: Optimizing resource usage and reducing cloud spend.\n\nHowever, it's not without its challenges. [Specific Challenge] remains a significant hurdle for many teams looking to adopt this new approach. \n\nAre you adopting this in your workflow? Why or why not? I'm particularly interested in how smaller teams are handling the transition compared to enterprise environments. \n\nLet's get a discussion going! Is this a revolution or just another buzzword? 🕵️‍♂️\n\n#TechTrends #FutureOfWork #${skills[0].replace(/[.\s]/g, '')} #Innovation #CloudNative #DevOps #TechStrategy`
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
