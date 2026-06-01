import { LinkedInProfile } from '@/types';

export const demoProfile: LinkedInProfile = {
  url: 'https://linkedin.com/in/alex-johnson-dev',
  name: 'Alex Johnson',
  headline: 'Student at XYZ College',
  about: 'I am interested in coding. I like building websites and learning new technologies. Currently pursuing B.Tech in Computer Science.',
  location: 'Bangalore, India',
  connections: 243,
  followers: 180,
  profilePhoto: true,
  customBanner: false,
  bannerDescription: '',
  experience: [
    {
      title: 'Web Development Intern',
      company: 'TechStart Solutions',
      duration: 'Jun 2025 - Aug 2025',
      description: 'Worked on web development projects. Used React and Node.js. Helped the team with various tasks.',
      hasMetrics: false,
      hasActionVerbs: false,
    },
    {
      title: 'Campus Ambassador',
      company: 'HackathonHub',
      duration: 'Jan 2025 - May 2025',
      description: 'Promoted hackathon events on campus. Managed social media handles.',
      hasMetrics: false,
      hasActionVerbs: false,
    },
  ],
  education: [
    {
      school: 'XYZ Institute of Technology',
      degree: 'B.Tech',
      field: 'Computer Science and Engineering',
      year: '2022 - 2026',
    },
  ],
  skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Python', 'Git'],
  certifications: [
    {
      name: 'Web Development Bootcamp',
      issuer: 'Udemy',
      year: '2024',
    },
  ],
  projects: [
    {
      name: 'Portfolio Website',
      description: 'Built a personal portfolio using React',
    },
    {
      name: 'Todo App',
      description: 'Simple task management application',
    },
  ],
  featuredItems: 0,
  postsPerWeek: 0.2,
  averageEngagement: 5,
  recommendations: 0,
  searchAppearances: 25,
  creatorMode: false,
  seoKeywords: ['student', 'coding', 'web development'],
  contactInfo: true,
  customUrl: true,
  jobRoleTarget: 'Software Engineer',
  industry: 'Technology',
  experienceLevel: 'Fresher',
  country: 'India',
};

export const strongProfile: LinkedInProfile = {
  url: 'https://linkedin.com/in/sarah-tech-lead',
  name: 'Sarah Chen',
  headline: 'Senior Full Stack Engineer | React • Node.js • AWS | Building Scalable SaaS Products | Ex-Google',
  about: `🚀 Passionate software engineer with 6+ years of experience building high-performance web applications that serve millions of users.

Currently leading a team of 8 engineers at TechCorp, where I architect and develop scalable microservices handling 10M+ daily requests. Previously at Google, I contributed to core infrastructure projects that improved search latency by 23%.

💡 Core Expertise:
• Frontend: React, Next.js, TypeScript, Vue.js
• Backend: Node.js, Python, Go, GraphQL
• Cloud: AWS (Certified Solutions Architect), GCP, Docker, Kubernetes
• Data: PostgreSQL, MongoDB, Redis, Elasticsearch

🏆 Key Achievements:
• Led migration to microservices architecture, reducing deployment time by 60%
• Built real-time analytics dashboard processing 5M events/day
• Open source contributor with 2,000+ GitHub stars
• Speaker at ReactConf 2025 and NodeConf EU

📫 Always open to connecting with fellow engineers and discussing technology trends. Let's build something amazing together!`,
  location: 'San Francisco, CA',
  connections: 2847,
  followers: 5200,
  profilePhoto: true,
  customBanner: true,
  bannerDescription: 'Custom branded banner with tech stack and role',
  experience: [
    {
      title: 'Senior Full Stack Engineer',
      company: 'TechCorp Inc.',
      duration: 'Mar 2023 - Present',
      description: 'Led team of 8 engineers building a SaaS platform serving 500K+ users. Architected microservices infrastructure reducing deployment time by 60%. Implemented real-time analytics dashboard processing 5M events daily.',
      hasMetrics: true,
      hasActionVerbs: true,
    },
    {
      title: 'Software Engineer',
      company: 'Google',
      duration: 'Jan 2020 - Feb 2023',
      description: 'Contributed to core search infrastructure improvements, reducing latency by 23%. Developed internal tools used by 10,000+ engineers. Mentored 5 junior engineers through the promotion process.',
      hasMetrics: true,
      hasActionVerbs: true,
    },
  ],
  education: [
    {
      school: 'Stanford University',
      degree: 'M.S.',
      field: 'Computer Science',
      year: '2018 - 2020',
    },
    {
      school: 'UC Berkeley',
      degree: 'B.S.',
      field: 'Computer Science',
      year: '2014 - 2018',
    },
  ],
  skills: [
    'React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker',
    'Kubernetes', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis',
    'Go', 'Next.js', 'Vue.js', 'Elasticsearch', 'CI/CD',
  ],
  certifications: [
    { name: 'AWS Solutions Architect Professional', issuer: 'Amazon', year: '2023' },
    { name: 'Google Cloud Professional Engineer', issuer: 'Google', year: '2022' },
  ],
  projects: [
    { name: 'OpenMetrics Dashboard', description: 'Open-source real-time metrics visualization tool with 1.2K GitHub stars', url: 'https://github.com/sarahchen/openmetrics' },
    { name: 'AI Code Reviewer', description: 'ML-powered code review assistant processing 500+ PRs/day', url: 'https://github.com/sarahchen/ai-reviewer' },
    { name: 'CloudDeploy CLI', description: 'Infrastructure-as-code CLI tool for multi-cloud deployments', url: 'https://github.com/sarahchen/clouddeploy' },
  ],
  featuredItems: 4,
  postsPerWeek: 3,
  averageEngagement: 250,
  recommendations: 12,
  searchAppearances: 156,
  creatorMode: true,
  seoKeywords: ['full stack engineer', 'react', 'node.js', 'aws', 'microservices', 'saas', 'scalable', 'senior engineer', 'tech lead'],
  contactInfo: true,
  customUrl: true,
  jobRoleTarget: 'Senior Software Engineer',
  industry: 'Technology',
  experienceLevel: 'Senior',
  country: 'United States',
};
