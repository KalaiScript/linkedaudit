import { ContentRewrite } from '@/types';

export function generateHeadlines(role: string, skills: string[], level: string): ContentRewrite[] {
  const s = skills.slice(0, 3).join('  ');
  const majorSkills = skills.slice(0, 4).join(' | ');
  
  // Detect if the user is a Brand Creator/Strategist based on role
  const isBrandOriented = role.toLowerCase().includes('brand') || role.toLowerCase().includes('creator') || role.toLowerCase().includes('strategist');

  if (isBrandOriented) {
    return [
      { type: 'headline', style: 'Authority-Boosted', content: `${role} | Helping 30+ Professionals Dominate LinkedIn | 3.5M+ Impressions | ${skills[0]}  ${skills[1]}` },
      { type: 'headline', style: 'Metric-Heavy', content: `${role} & Tech Enthusiast | 6K+ Followers | Building High-Impact Personal Brands | Expert in ${s}` },
      { type: 'headline', style: 'Strategic-Flow', content: `Personal Brand Strategist | ${role} | ${majorSkills} | Transforming Profiles into Recruiter Magnets` },
      { type: 'headline', style: 'Mission-Driven', content: `Empowering Students & Developers to Scale their Careers through Branded Content | ${role} | ${skills[0]} Specialist` },
      { type: 'headline', style: 'The Closer', content: `${role} | 30+ Profiles Optimized | Content Strategy & Growth | Let's build your legacy.` },
    ];
  }
  
  return [
    { type: 'headline', style: 'Professional', content: `${level === 'Fresher' ? 'Aspiring' : 'Results-Driven'} ${role} | ${s} | Building Scalable & Impactful Solutions` },
    { type: 'headline', style: 'Keyword-Rich', content: `${role} | ${majorSkills} | Open to ${level === 'Fresher' ? 'Internships' : 'Strategic Opportunities'} | Problem Solver` },
    { type: 'headline', style: 'Value-Driven', content: `Helping businesses scale through efficient ${skills[0] || 'software'} solutions | ${role} | ${skills[1] || 'Tech'} Enthusiast` },
    { type: 'headline', style: 'Brand-Focused', content: `Turning Complex Challenges into Simple Code | ${role} | Passionate about ${skills[0]} & ${skills[1]}` },
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
      content: `${level === 'Fresher' ? 'Aspiring' : 'Dedicated'} ${role} with a deep passion for ${industry} innovation.\n\nMy focus is on leveraging ${topSkill} to solve real-world problems and drive user engagement.\n\nTechnical Arsenal:\n- Languages: ${skills.slice(0, 3).join(', ')}\n- Frameworks: ${skills.slice(3, 6).join(', ')}\n- Tools: Git, Docker, AWS, CI/CD\n\nWhat I Bring to the Table:\n- High-quality, maintainable code standards\n- Agile mindset and collaborative spirit\n- Proven ability to learn and adapt to new tech stacks quickly\n\nI'm always open to discussing ${level === 'Fresher' ? 'internships and entry-level roles' : 'innovative projects and leadership opportunities'}. Let's build the future together!`
    },
    {
      type: 'about', style: 'Story-Based',
      content: `My journey into ${industry} started with a single line of code and an insatiable curiosity about how things work.\n\nToday, as a ${role}, I specialize in ${s}, building solutions that bridge the gap between complex backend logic and seamless user experiences.\n\nI don't just write code; I build products that matter.\n\nKey Philosophy:\n- Code is for humans, not just machines\n- User experience is the ultimate metric of success\n- Continuous iteration beats delayed perfection\n\nWhen I'm not coding, you'll find me exploring ${skills[skills.length-1] || 'new tech'} or contributing to open-source projects.\n\nLet's connect!`
    },
    {
      type: 'about', style: 'Value-Focused',
      content: `I help companies in ${industry} optimize their technical infrastructure and deliver superior digital products.\n\nAs a ${role}, I've focused my career on mastering ${topSkill}. Whether it's architecting a new system or refactoring legacy code, my goal is always the same: efficiency, scalability, and reliability.\n\nKey Highlights:\n- Optimized performance in multiple high-impact projects\n- Integrated modern tech stacks to reduce system latency\n- Collaborated with design teams to improve UI responsiveness\n\nCurrently exploring the intersection of ${skills[0]} and AI.\n\nOpen to networking with fellow ${role}s and industry leaders.`
    },
    {
      type: 'about', style: 'Modern & Minimal',
      content: `${role} | ${skills.slice(0, 4).join('  ')}\n\nPassionate about building clean, efficient, and user-centric applications. \n\nFocus: ${skills[0]}, ${skills[1]}, ${skills[2]}\n\nInterest: ${industry}, Open Source, Tech Mentorship\n\n"Simplicity is the ultimate sophistication."\n\nLet's connect.`
    },
  ];
}

export function generateExperienceRewrites(title: string, company: string, description: string, skills: string[]): ContentRewrite[] {
  return [
    {
      type: 'experience', style: 'Impact-Focused',
      content: ` Spearheaded the development of high-traffic modules using ${skills[0]} and ${skills[1]}, resulting in measurable system reliability improvements.\n Collaborated with cross-functional teams to deliver comprehensive ${skills[2]} solutions ahead of schedule.\n Optimized existing codebases, reducing technical debt and improving developer productivity.\n Conducted regular code reviews and mentored junior developers to ensure high standards of code quality.`
    },
    {
      type: 'experience', style: 'Metrics-Driven',
      content: ` Engineered and deployed scalable features using ${skills.slice(0, 3).join(', ')}.\n Improved application load time by 40% through advanced performance optimization techniques.\n Managed complex data workflows that improved processing speed for large datasets.\n Reduced production bugs significantly by implementing a robust automated testing suite.`
    },
    {
      type: 'experience', style: 'Leadership-Oriented',
      content: ` Led the technical design and implementation of core product features using ${skills[0]}.\n Facilitated agile ceremonies, improving team velocity and collaboration.\n Established new documentation standards that reduced onboarding time for new team members.\n Represented the engineering team in stakeholder meetings, translating technical requirements into business value.`
    },
  ];
}

export function generatePosts(role: string, skills: string[]): ContentRewrite[] {
  const topSkill = skills[0] || 'Software Development';
  const secondarySkill = skills[1] || 'Modern Tech Stack';
  
  return [
    {
      type: 'post', style: 'Technical Tutorial',
      content: `Post: 'Build a Serverless Image Recognition App with AWS Rekognition and Python'\n\nHave you ever wondered how to build a scalable image recognition system without managing servers? Today, I'm sharing a complete breakdown of how to leverage AWS Rekognition for this exact purpose.\n\nArchitecture Overview:\n- S3 Bucket: Stores the uploaded images.\n- Lambda Trigger: Automatically fires when a new image is uploaded.\n- AWS Rekognition: Analyzes the image and detects objects/labels.\n- DynamoDB: Stores the results for quick querying.\n\nStep-by-Step Implementation:\n1. Create an S3 bucket and enable event notifications.\n2. Write a Python Lambda function using Boto3.\n3. import boto3\\nrekognition = boto3.client('rekognition')\\nresponse = rekognition.detect_labels(Image={'S3Object': {'Bucket': bucket, 'Name': key}})\n4. Parse the JSON response and log results to DynamoDB.\n\nWhy this stack works:\n- Cost Efficiency: You only pay per request. Perfect for startups.\n- Infinite Scalability: AWS handles the heavy lifting as your traffic grows.\n- Zero Maintenance: Focus on code, not patching servers.\n\nCheck out the full code and architecture diagram in my GitHub repo: [Link]\n\nBuilding serverless applications has completely changed my approach to system design in ${topSkill}. It's about working smarter, not harder.\n\nWhat serverless project should I build next? Let me know in the comments!\n\n#AWS #Serverless #Python #ImageRecognition #CloudComputing #LinkHive #SoftwareEngineering #CodingTutorial`
    },
    {
      type: 'post', style: 'Personal Story',
      content: `Post: 'How Daily Content Creation Made Me a Better Software Engineer'\n\nWhen I started sharing my journey as a ${role}, I didn't realize how much it would impact my technical skills. Most people see content creation as a "distraction," but I've found it to be the ultimate learning accelerator.\n\nHere are 3 lessons I've learned from 365 days of consistent posting:\n\n1. Breaking Down Complex Problems: To explain a concept like ${skills[0]} to an audience, you have to truly understand it yourself. If you can't explain it simply, you don't know it well enough. This "Feynman Technique" has made my code cleaner and more modular.\n\n2. Communicating with Stakeholders: Writing for an audience is practice for writing for product managers and clients. I've learned how to translate "technical jargon" into "business value," which has been a game-changer in my professional career.\n\n3. Staying Consistent: Coding every day is hard. Creating content every day is harder. But the discipline of showing up, even when the "algorithm" is against you, translates directly to solving that impossible bug at 2 AM.\n\nTeaching others deepens your own understanding. It forces you to verify your facts and stay up-to-date with the latest trends in ${topSkill}.\n\nMy advice for aspiring SWEs? Don't just build in silence. Share your process. Document your failures. Build your network while you build your apps.\n\nHow has sharing your work helped you grow?\n\n#PersonalBranding #TechJourney #SoftwareEngineer #LinkHive #BuildInPublic #CareerGrowth #LearningByTeaching`
    },
    {
      type: 'post', style: 'Thought Leadership',
      content: `Post: 'Why Every Software Engineer Needs to Understand Cloud Infrastructure in 2025'\n\nThe days of a developer just "writing code" are over. In 2025, the most valuable engineers are those who understand where that code lives and how it scales.\n\nWe're seeing a massive shift towards cloud-native development. If you're a ${role} who doesn't understand VPCs, IAM roles, or container orchestration, you're building on a shaky foundation.\n\nMy experience with AWS has taught me that infrastructure IS part of the application. Optimizing a database query is great, but choosing the right instance type or serverless strategy can save thousands of dollars and prevent critical downtime.\n\nWhere to start your cloud journey:\n- Learn the Big Three: AWS, Azure, or GCP.\n- Master Docker: Containerization is the entry point for modern cloud apps.\n- Understand Serverless: Know when to go FaaS vs. K8s.\n\nI've curated a list of my favorite learning resources for anyone looking to level up their cloud game this year: [Link]\n\nThe barrier to entry for cloud is high, but the rewardsin terms of salary, impact, and job securityare even higher. Don't get left behind in the "code-only" era.\n\nQuick Poll: Are you cloud-certified or learning cloud now? \n1. Already Certified\n2. Currently Learning\n3. On my roadmap\n4. Not interested\n\nLet's discuss!\n\n#CloudNative #AWS #FutureOfTech #LinkHive #SoftwareArchitecture #DevOps #TechTrends #CloudComputing`
    },
  ];
}

export function generateViralHooks(role: string, skills: string[]): string[] {
  const topSkill = skills[0] || 'Software Development';
  const secondarySkill = skills[1] || 'Modern Tech Stack';
  return [
    `How I built a ${secondarySkill} system in 30 days (without burning out).`,
    `I used to think ${topSkill} was just about writing code. I was wrong.`,
    `Unpopular opinion: Most ${role}s are doing ${topSkill} completely backwards.`,
    `Stop using [Old Method]. Here's why ${topSkill} in 2025 is different.`,
    `The 5 secrets senior ${role}s don't tell you about ${skills[0]}.`,
    `I analyzed 100+ LinkedIn profiles for ${role}s. Here's the #1 mistake I found.`,
    `Why your ${topSkill} skills are worthless without this one soft skill.`,
    `The exact roadmap I'd follow if I had to relearn ${topSkill} from scratch today.`,
    `Stop chasing [Trend]. Start mastering ${topSkill}. Here's why.`,
  ];
}

export function generateAISuggestions(role: string, skills: string[], level: string): ContentRewrite[] {
  return [
    {
      type: 'about' as any, style: 'Profile Strategy',
      content: `Your headline should focus on the *value* you provide, not just your job title. Instead of "${role}", try "Helping companies build ${skills[0] || 'scalable'} solutions as a ${role}". This makes you stand out to recruiters immediately.`
    },
    {
      type: 'about' as any, style: 'Content Strategy',
      content: `You have great expertise in ${skills.slice(0, 2).join(' and ')}. Start sharing weekly insights about these topics. Engagement increases by 40% when you post consistent, value-driven content rather than just personal updates.`
    },
    {
      type: 'about' as any, style: 'Experience Strategy',
      content: `In your experience section, use "Action Verbs" like "Spearheaded", "Architected", and "Optimized". Ensure every bullet point follows the X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]".`
    },
    {
      type: 'about' as any, style: 'Networking Strategy',
      content: `Since you are a ${level} ${role}, focus on connecting with senior engineers and tech leads in the ${skills[0] || 'tech'} space. Personalized connection requests mentioning their recent work can lead to a 3x higher acceptance rate.`
    },
  ];
}
