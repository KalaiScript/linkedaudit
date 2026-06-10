export interface LinkedInProfile {
  url: string;
  name: string;
  headline: string;
  about: string;
  location: string;
  connections: number;
  followers: number;
  profilePhoto: boolean;
  customBanner: boolean;
  bannerDescription?: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  featuredItems: number;
  postsPerWeek: number;
  averageEngagement: number;
  recommendations: number;
  searchAppearances: number;
  creatorMode: boolean;
  seoKeywords: string[];
  contactInfo: boolean;
  customUrl: boolean;
  jobRoleTarget: string;
  industry: string;
  experienceLevel: string;
  country: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string;
  hasMetrics: boolean;
  hasActionVerbs: boolean;
}

export interface EducationItem {
  school: string;
  degree: string;
  field: string;
  year: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  url?: string;
}

export interface SectionScore {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  icon: string;
  color: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: AISuggestion[];
}

export interface AISuggestion {
  type: 'improvement' | 'rewrite' | 'tip' | 'warning';
  title: string;
  current?: string;
  suggested?: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export interface AuditResult {
  profile: LinkedInProfile;
  overallScore: number;
  letterGrade: string;
  recruiterReadiness: number;
  sections: SectionScore[];
  topStrengths: string[];
  topWeaknesses: string[];
  opportunities: string[];
  actionPlan: ActionPlanDay[];
  careerPositioning: string[];
  personalBrandScore: number;
  atsScore: number;
  roastFeedback: RoastItem[];
}

export interface ActionPlanDay {
  day: number;
  title: string;
  description: string;
  tasks: string[];
  impact: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface RoastItem {
  section: string;
  roast: string;
  emoji: string;
}

export interface AIAnalysisResponse {
  overallScore: number;
  recruiterReadiness: number;
  personalBrandScore: number;
  atsScore: number;
  topStrengths: string[];
  topWeaknesses: string[];
  headlines: { style: string; content: string }[];
  abouts: { style: string; content: string }[];
  experienceRewrites: { style: string; content: string }[];
  posts: { style: string; content: string }[];
  seoKeywords: { keyword: string; importance: 'high' | 'medium'; reason: string }[];
  recruiterVerdict: string;
  roasts: RoastItem[];
  strategyTips?: { style: string; content: string; impact: 'high' | 'medium' | 'low'; category: string }[];
}

export interface ContentRewrite {
  type: 'headline' | 'about' | 'experience' | 'post';
  style: string;
  content: string;
}

export interface CompetitorData {
  percentile: number;
  category: string;
  areaScores: { label: string; you: number; average: number; top: number }[];
}
