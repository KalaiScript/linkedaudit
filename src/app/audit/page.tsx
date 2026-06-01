'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';

const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'Data Analyst', 'Data Scientist', 'AI/ML Engineer', 'DevOps Engineer', 'Product Manager', 'Mobile Developer', 'Cybersecurity Analyst', 'Cloud Architect', 'QA Engineer', 'Other'];
const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Media', 'Consulting', 'Manufacturing', 'Government', 'Startup', 'Other'];
const levels = ['Fresher', 'Junior (1-2 years)', 'Mid (3-5 years)', 'Senior (5-10 years)', 'Lead/Manager', 'Executive'];
const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Germany', 'Australia', 'Singapore', 'UAE', 'Other'];

export default function AuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Target Goals
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [level, setLevel] = useState('');
  const [country, setCountry] = useState('');

  // Step 2: Professional Identity
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [location, setLocation] = useState('');
  const [skillsText, setSkillsText] = useState('');

  // Step 3: Metrics & Activity
  const [connections, setConnections] = useState('');
  const [followers, setFollowers] = useState('');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [hasBanner, setHasBanner] = useState(false);
  const [experienceCount, setExperienceCount] = useState('');
  const [experienceDesc, setExperienceDesc] = useState('');
  const [projectCount, setProjectCount] = useState('');
  const [certCount, setCertCount] = useState('');
  const [postsPerWeek, setPostsPerWeek] = useState('');
  const [avgEngagement, setAvgEngagement] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [creatorMode, setCreatorMode] = useState(false);
  const [customUrl, setCustomUrl] = useState(true);
  const [featuredItems, setFeaturedItems] = useState('');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      handleAnalyze();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    } else {
      router.back();
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);

    // Use manually entered data
    const profileData = {
      url: 'manual',
      name: name || 'User',
      headline: headline || `${role} | Tech Enthusiast`,
      about: about || `Passionate ${role} with expertise in tech.`,
      location: location || country || 'India',
      connections: parseInt(connections) || 0,
      followers: parseInt(followers) || 0,
      profilePhoto: hasPhoto,
      customBanner: hasBanner,
      bannerDescription: 'Professional tech banner',
      experience: Array.from({ length: parseInt(experienceCount) || 0 }).map((_, i) => ({
        title: role,
        company: `Company ${i + 1}`,
        duration: 'Past - Present',
        description: experienceDesc || '',
        hasMetrics: /\d/.test(experienceDesc),
        hasActionVerbs: true,
      })),
      education: [{ school: 'University', degree: 'Degree', field: 'Field', year: '2024' }],
      skills: skillsText.split(',').map(s => s.trim()).filter(Boolean),
      certifications: Array.from({ length: parseInt(certCount) || 0 }, (_, i) => ({ name: `Certified ${i + 1}`, issuer: 'Organization', year: '2024' })),
      projects: Array.from({ length: parseInt(projectCount) || 0 }, (_, i) => ({ name: `Project ${i + 1}`, description: 'A project.' })),
      featuredItems: parseInt(featuredItems) || 0,
      postsPerWeek: parseFloat(postsPerWeek) || 0,
      averageEngagement: parseInt(avgEngagement) || 0,
      recommendations: parseInt(recommendations) || 0,
      searchAppearances: 50,
      creatorMode,
      seoKeywords: skillsText.split(',').slice(0, 5).map(s => s.trim().toLowerCase()).filter(Boolean),
      contactInfo: true,
      customUrl,
      jobRoleTarget: role || 'Software Engineer',
      industry: industry || 'Technology',
      experienceLevel: level || 'Mid',
      country: country || 'India',
    };

    localStorage.setItem('profilepulse_profile', JSON.stringify(profileData));
    
    // Simulate a brief loading for AI processing feel
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const isStep1Valid = role && industry && level && country;
  const isStep2Valid = name && headline && about && skillsText;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 700, width: '100%' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>
              Audit Your <span className="gradient-text">LinkedIn Profile</span>
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 16 }}>
              {step === 1 ? 'Step 1: Define your target goals' : step === 2 ? 'Step 2: Your professional identity' : 'Step 3: Your network and activity'}
            </p>
            
            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 24 }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ 
                  width: 36, height: 36, borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: 14, fontWeight: 700, 
                  background: step >= s ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                  border: step >= s ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  color: step >= s ? 'white' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 40, position: 'relative' }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>What are your career goals?</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Target Role</label>
                      <select className="select-field" value={role} onChange={e => setRole(e.target.value)}>
                        <option value="">Select Role</option>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Industry</label>
                      <select className="select-field" value={industry} onChange={e => setIndustry(e.target.value)}>
                        <option value="">Select Industry</option>
                        {industries.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Experience Level</label>
                      <select className="select-field" value={level} onChange={e => setLevel(e.target.value)}>
                        <option value="">Select Level</option>
                        {levels.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Country</label>
                      <select className="select-field" value={country} onChange={e => setCountry(e.target.value)}>
                        <option value="">Select Country</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <button onClick={handleNext} disabled={!isStep1Valid} className="glow-btn" style={{ width: '100%', padding: '16px', fontSize: 17, opacity: isStep1Valid ? 1 : 0.6 }}>
                    Next: Professional Identity →
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Tell us who you are</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    <InputField label="Full Name" value={name} onChange={setName} placeholder="John Doe" />
                    <InputField label="Current Location" value={location} onChange={setLocation} placeholder="City, Country" />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <InputField label="Current Headline" value={headline} onChange={setHeadline} placeholder="Senior Software Engineer | React • Node.js | Ex-Google" />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>About / Summary</label>
                    <textarea className="input-field" rows={5} placeholder="Paste your LinkedIn About section here..." value={about} onChange={e => setAbout(e.target.value)} style={{ resize: 'vertical' }} />
                  </div>

                  <div style={{ marginBottom: 32 }}>
                    <InputField label="Skills (comma-separated)" value={skillsText} onChange={setSkillsText} placeholder="React, Node.js, Python, TypeScript, AWS" />
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={handleBack} style={{ flex: '0 0 auto', padding: '14px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a5b4fc', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                      ← Back
                    </button>
                    <button onClick={handleNext} disabled={!isStep2Valid} className="glow-btn" style={{ flex: 1, padding: '14px', fontSize: 16, opacity: isStep2Valid ? 1 : 0.6 }}>
                      Next: Network & Metrics →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Your LinkedIn activity</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                    <InputField label="Connections" value={connections} onChange={setConnections} placeholder="500+" type="number" />
                    <InputField label="Followers" value={followers} onChange={setFollowers} placeholder="2500" type="number" />
                    <InputField label="Recommendations" value={recommendations} onChange={setRecommendations} placeholder="5" type="number" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                    <InputField label="Experience Count" value={experienceCount} onChange={setExperienceCount} placeholder="3" type="number" />
                    <InputField label="Projects Count" value={projectCount} onChange={setProjectCount} placeholder="4" type="number" />
                    <InputField label="Featured Items" value={featuredItems} onChange={setFeaturedItems} placeholder="2" type="number" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <InputField label="Posts per Week" value={postsPerWeek} onChange={setPostsPerWeek} placeholder="2" type="number" />
                    <InputField label="Avg Engagement" value={avgEngagement} onChange={setAvgEngagement} placeholder="45" type="number" />
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Experience Description (Best Role)</label>
                    <textarea className="input-field" rows={3} placeholder="Briefly describe your main achievements in your current or best role..." value={experienceDesc} onChange={e => setExperienceDesc(e.target.value)} style={{ resize: 'vertical' }} />
                  </div>

                  <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
                    <ToggleField label="Profile Photo" checked={hasPhoto} onChange={setHasPhoto} />
                    <ToggleField label="Custom Banner" checked={hasBanner} onChange={setHasBanner} />
                    <ToggleField label="Creator Mode" checked={creatorMode} onChange={setCreatorMode} />
                    <ToggleField label="Custom URL" checked={customUrl} onChange={setCustomUrl} />
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={handleBack} disabled={loading} style={{ flex: '0 0 auto', padding: '14px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a5b4fc', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                      ← Back
                    </button>
                    <button onClick={handleAnalyze} disabled={loading} className="glow-btn" style={{ flex: 1, padding: '14px', fontSize: 16, opacity: loading ? 0.7 : 1 }}>
                      {loading ? '⚡ Processing with AI...' : '🚀 Start AI Audit'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      <input type={type} className="input-field" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={{ padding: '10px 14px', fontSize: 14 }} />
    </div>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: 40, height: 22, borderRadius: 11, padding: 2, cursor: 'pointer', border: 'none',
          background: checked ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'rgba(99,102,241,0.2)',
          transition: 'all 0.3s', position: 'relative',
        }}
      >
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', transform: checked ? 'translateX(18px)' : 'translateX(0)', transition: 'transform 0.3s' }} />
      </button>
      <span style={{ color: 'rgba(226,232,240,0.6)', fontSize: 13, fontWeight: 500 }}>{label}</span>
    </label>
  );
}
