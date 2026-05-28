import { ContentRewrite } from '@/types';

export function generateHeadlines(role: string, skills: string[], level: string): ContentRewrite[] {
  const s = skills.slice(0, 3).join(' • ');
  return [
    { type: 'headline', style: 'Professional', content: `${level === 'Fresher' ? 'Aspiring' : ''} ${role} | ${s} | Building Impactful Solutions` },
    { type: 'headline', style: 'Keyword-Rich', content: `${role} | ${s} | Open to ${level === 'Fresher' ? 'Internships' : 'Opportunities'} | ${skills[0]} Expert` },
    { type: 'headline', style: 'Brand-Focused', content: `Turning Ideas into Code 🚀 | ${role} | Passionate about ${skills[0]} & ${skills[1]}` },
    { type: 'headline', style: 'Recruiter-Optimized', content: `${role} with expertise in ${s} | Seeking impactful roles in tech` },
  ];
}

export function generateAboutSections(role: string, skills: string[], level: string, industry: string): ContentRewrite[] {
  const s = skills.slice(0, 5).join(', ');
  return [
    {
      type: 'about', style: 'Professional',
      content: `🚀 ${level === 'Fresher' ? 'Aspiring' : 'Experienced'} ${role} passionate about building innovative solutions in ${industry}.\n\n💡 Technical Expertise:\n• ${skills.slice(0, 6).join('\n• ')}\n\n🎯 I thrive on solving complex problems and creating seamless user experiences. My approach combines technical excellence with creative problem-solving.\n\n📫 Open to ${level === 'Fresher' ? 'internships, collaborations, and learning opportunities' : 'new challenges and collaborations'}. Let's connect!`
    },
    {
      type: 'about', style: 'Story-Based',
      content: `My journey into ${industry} started with curiosity and a passion for creating things that matter.\n\nToday, I specialize in ${s}, building solutions that make a real difference. Every project I take on is an opportunity to learn, grow, and push boundaries.\n\nWhat drives me:\n✅ Clean, maintainable code\n✅ User-centric design thinking\n✅ Continuous learning and improvement\n✅ Collaborative problem-solving\n\nI believe technology should simplify lives, and I'm committed to making that happen — one project at a time.\n\nLet's connect and build something amazing together! 🤝`
    },
    {
      type: 'about', style: 'Technical',
      content: `${role} | ${s}\n\n🔧 Tech Stack:\nFrontend: ${skills.filter(s => ['React', 'Vue', 'Angular', 'Next.js', 'HTML', 'CSS', 'JavaScript', 'TypeScript'].includes(s)).join(', ') || skills.slice(0, 3).join(', ')}\nBackend: ${skills.filter(s => ['Node.js', 'Python', 'Java', 'Go', 'Express'].includes(s)).join(', ') || 'Exploring backend technologies'}\nTools: Git, VS Code, Docker\n\n📊 Key Highlights:\n• ${skills.length}+ technical skills\n• Hands-on project experience\n• Strong problem-solving abilities\n\n🎯 Currently focused on deepening expertise in ${skills[0]} and ${skills[1]}.\n\n💬 Always happy to connect with fellow professionals. Reach out!`
    },
  ];
}

export function generateExperienceRewrites(title: string, company: string, description: string, skills: string[]): ContentRewrite[] {
  return [
    {
      type: 'experience', style: 'Impact-Focused',
      content: `• Spearheaded development of key features using ${skills[0]} and ${skills[1]}, delivering measurable business impact\n• Collaborated with cross-functional teams to ship high-quality products ahead of schedule\n• Implemented best practices and code review processes, improving team code quality by 30%\n• Mentored junior team members and contributed to technical documentation`
    },
    {
      type: 'experience', style: 'Metrics-Driven',
      content: `• Built and deployed production-ready applications using ${skills.slice(0, 3).join(', ')}\n• Reduced page load time by 40% through performance optimization and code splitting\n• Increased user engagement by 25% with improved UI/UX implementations\n• Wrote 50+ unit tests achieving 85% code coverage across the project`
    },
  ];
}

export function generatePosts(role: string, skills: string[]): ContentRewrite[] {
  return [
    {
      type: 'post', style: 'Project Showcase',
      content: `🚀 Excited to share my latest project!\n\nI just built a [Project Name] using ${skills[0]} and ${skills[1]}.\n\nKey features:\n✅ Feature 1\n✅ Feature 2\n✅ Feature 3\n\nBiggest challenge? [Describe challenge]\nHow I solved it? [Describe solution]\n\nCheck it out: [Link]\n\n#${skills[0].replace(/[.\s]/g, '')} #${role.replace(/\s/g, '')} #BuildInPublic #OpenSource`
    },
    {
      type: 'post', style: 'Learning Update',
      content: `📚 Week [X] of my ${skills[0]} learning journey!\n\nThis week I learned:\n1️⃣ [Topic 1]\n2️⃣ [Topic 2]\n3️⃣ [Topic 3]\n\nKey takeaway: [Main insight]\n\nResources that helped:\n📖 [Resource 1]\n🎥 [Resource 2]\n\nWhat are you learning this week? Drop a comment! 👇\n\n#Learning #${skills[0].replace(/[.\s]/g, '')} #GrowthMindset`
    },
    {
      type: 'post', style: 'Career Tips',
      content: `💡 5 things I wish I knew when starting as a ${role}:\n\n1. Build projects, not just tutorials\n2. Your LinkedIn profile IS your resume\n3. Networking > Applying blindly\n4. Learn ${skills[0]} deeply before moving to the next thing\n5. Document everything you build\n\nWhich one resonates with you most?\n\n#CareerAdvice #${role.replace(/\s/g, '')} #TechCareers`
    },
  ];
}
