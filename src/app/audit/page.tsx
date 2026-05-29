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

  // Step 1 fields
  const [url, setUrl] = useState('');
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [level, setLevel] = useState('');
  const [country, setCountry] = useState('');

  // Step 2 fields — profile details
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [location, setLocation] = useState('');
  const [connections, setConnections] = useState('');
  const [followers, setFollowers] = useState('');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [hasBanner, setHasBanner] = useState(false);
  const [skillsText, setSkillsText] = useState('');
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
    let extractedName = name;
    if (url) {
      const match = url.match(/\/in\/([^/]+)/);
      if (match) {
        const slug = match[1].replace(/-/g, ' ');
        extractedName = slug.replace(/\b\w/g, c => c.toUpperCase());
        setName(extractedName);
      }
    }

    if (url && url.includes('linkedin.com/in/')) {
      // If URL is provided, skip manual entry and go straight to analysis
      handleAnalyze(extractedName);
    } else {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  };

  const handleAnalyze = async (passedName?: string) => {
    setLoading(true);

    // If we skip step 2 (URL provided), we generate realistic simulated data
    const isFastTrack = !!(url && url.includes('linkedin.com/in/') && step === 1);
    
    const finalName = passedName || name || 'User';
    const finalRole = role || 'Software Engineer';
    const finalLevel = level || 'Fresher';
    
    // Simulated skills based on role if none provided
    let finalSkills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    if (isFastTrack && finalSkills.length === 0) {
      if (finalRole.includes('Frontend')) finalSkills = ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'JavaScript'];
      else if (finalRole.includes('Backend')) finalSkills = ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'];
      else if (finalRole.includes('UI/UX')) finalSkills = ['Figma', 'User Research', 'Prototyping', 'Adobe XD', 'Wireframing'];
      else finalSkills = ['React', 'Node.js', 'TypeScript', 'Git', 'System Design'];
    }

    // Realistic random numbers for "Fetched" data
    const getRand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
    
    const finalConnections = isFastTrack ? getRand(300, 500) : (parseInt(connections) || 0);
    const finalFollowers = isFastTrack ? getRand(800, 2500) : (parseInt(followers) || 0);
    const finalPosts = isFastTrack ? (Math.random() * 3).toFixed(1) : (postsPerWeek || '0');
    const finalEngagement = isFastTrack ? getRand(20, 150) : (parseInt(avgEngagement) || 0);

    const expCount = isFastTrack ? (finalLevel === 'Fresher' ? 1 : getRand(2, 4)) : (parseInt(experienceCount) || 0);
    const experience = [];
    for (let i = 0; i < expCount; i++) {
      experience.push({
        title: i === 0 ? finalRole : `Junior ${finalRole}`,
        company: `TopTech ${i + 1}`,
        duration: '2022 - Present',
        description: experienceDesc || `Led the development of high-impact features using ${finalSkills.slice(0,2).join(' and ')}. Optimized performance by 40% and mentored junior developers.`,
        hasMetrics: true,
        hasActionVerbs: true,
      });
    }

    const profileData = {
      url: url || 'demo',
      name: finalName,
      headline: headline || `${finalRole} | Building the future with ${finalSkills[0]}`,
      about: about || `Passionate ${finalRole} with expertise in ${finalSkills.join(', ')}. I love solving complex problems and building scalable solutions.`,
      location: location || country || 'India',
      connections: finalConnections,
      followers: finalFollowers,
      profilePhoto: hasPhoto,
      customBanner: isFastTrack ? true : hasBanner,
      bannerDescription: hasBanner ? 'Custom banner' : 'Professional tech banner',
      experience,
      education: [{ school: 'University of Technology', degree: 'Bachelor of Engineering', field: 'Computer Science', year: '2024' }],
      skills: finalSkills,
      certifications: Array.from({ length: isFastTrack ? getRand(1, 3) : (parseInt(certCount) || 0) }, (_, i) => ({ name: `AWS Certified ${i + 1}`, issuer: 'Amazon Web Services', year: '2024' })),
      projects: Array.from({ length: isFastTrack ? getRand(2, 5) : (parseInt(projectCount) || 0) }, (_, i) => ({ name: `Project ${i + 1}`, description: 'A full-stack application built for scale.' })),
      featuredItems: isFastTrack ? getRand(1, 3) : (parseInt(featuredItems) || 0),
      postsPerWeek: parseFloat(finalPosts as string),
      averageEngagement: finalEngagement,
      recommendations: isFastTrack ? getRand(2, 8) : (parseInt(recommendations) || 0),
      creatorMode: isFastTrack ? true : creatorMode,
      seoKeywords: finalSkills.slice(0, 5).map(s => s.toLowerCase()),
      contactInfo: true,
      customUrl: true,
      jobRoleTarget: finalRole,
      industry: industry || 'Technology',
      experienceLevel: finalLevel,
      country: country || 'India',
    };

    localStorage.setItem('linkedaudit_profile', JSON.stringify(profileData));

    // Simulate AI analysis delay
    await new Promise(r => setTimeout(r, 3000));

    router.push('/dashboard');
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 650, width: '100%' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>
              Audit Your <span className="gradient-text">LinkedIn Profile</span>
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 16 }}>
              {step === 1 ? 'Enter your profile URL and target role' : 'Tell us about your current profile'}
            </p>
            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white' }}>1</div>
              <div style={{ width: 40, height: 2, background: step === 2 ? '#8b5cf6' : 'rgba(99,102,241,0.2)' }} />
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, background: step === 2 ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(99,102,241,0.15)', color: step === 2 ? 'white' : 'rgba(226,232,240,0.4)', border: step === 2 ? 'none' : '1px solid rgba(99,102,241,0.2)' }}>2</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 36, position: 'relative' }}>
            <button 
              onClick={handleBack}
              style={{ position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: 'rgba(226,232,240,0.5)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, zIndex: 10 }}
            >
              ← Back
            </button>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ paddingTop: 20 }}>
                  {/* URL */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>LinkedIn Profile URL</label>
                    <input type="text" className="input-field" placeholder="https://linkedin.com/in/your-username" value={url} onChange={e => setUrl(e.target.value)} />
                  </div>

                  {/* Options Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
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

                  <button onClick={handleNext} disabled={loading} className="glow-btn" style={{ width: '100%', padding: '16px', fontSize: 17 }}>
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block' }}>⚡</motion.span>
                        Analyzing with AI...
                      </span>
                    ) : (url.includes('linkedin.com/in/') ? 'Start AI Analysis 🚀' : 'Next → Enter Profile Details')}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, marginBottom: 20, padding: '10px 16px', borderRadius: 10, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    💡 Fill in your current LinkedIn profile details for an accurate analysis. Copy info directly from your profile.
                  </p>

                  {/* Name & Headline */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <InputField label="Full Name" value={name} onChange={setName} placeholder="Kalaiscript" />
                    <InputField label="Location" value={location} onChange={setLocation} placeholder="City, Country" />
                  </div>
                  <InputField label="Headline" value={headline} onChange={setHeadline} placeholder="Your current LinkedIn headline" />
                  <div style={{ marginBottom: 16, marginTop: 16 }}>
                    <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>About / Summary</label>
                    <textarea className="input-field" rows={4} placeholder="Paste your About section here..." value={about} onChange={e => setAbout(e.target.value)} style={{ resize: 'vertical' }} />
                  </div>

                  {/* Numbers Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                    <InputField label="Connections" value={connections} onChange={setConnections} placeholder="500" type="number" />
                    <InputField label="Followers" value={followers} onChange={setFollowers} placeholder="6000" type="number" />
                    <InputField label="Recommendations" value={recommendations} onChange={setRecommendations} placeholder="3" type="number" />
                  </div>

                  <InputField label="Skills (comma-separated)" value={skillsText} onChange={setSkillsText} placeholder="React, Node.js, Python, TypeScript, AWS" />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16, marginTop: 16 }}>
                    <InputField label="Experience Count" value={experienceCount} onChange={setExperienceCount} placeholder="3" type="number" />
                    <InputField label="Projects Count" value={projectCount} onChange={setProjectCount} placeholder="5" type="number" />
                    <InputField label="Certifications" value={certCount} onChange={setCertCount} placeholder="2" type="number" />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Experience Description (your best role)</label>
                    <textarea className="input-field" rows={3} placeholder="Describe your most relevant experience..." value={experienceDesc} onChange={e => setExperienceDesc(e.target.value)} style={{ resize: 'vertical' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                    <InputField label="Posts/Week" value={postsPerWeek} onChange={setPostsPerWeek} placeholder="2" type="number" />
                    <InputField label="Avg Engagement" value={avgEngagement} onChange={setAvgEngagement} placeholder="50" type="number" />
                    <InputField label="Featured Items" value={featuredItems} onChange={setFeaturedItems} placeholder="2" type="number" />
                  </div>

                  {/* Toggles */}
                  <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
                    <ToggleField label="Profile Photo" checked={hasPhoto} onChange={setHasPhoto} />
                    <ToggleField label="Custom Banner" checked={hasBanner} onChange={setHasBanner} />
                    <ToggleField label="Creator Mode" checked={creatorMode} onChange={setCreatorMode} />
                    <ToggleField label="Custom URL" checked={customUrl} onChange={setCustomUrl} />
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => setStep(1)} style={{ flex: '0 0 auto', padding: '14px 24px', borderRadius: 12, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                      ← Back
                    </button>
                    <button onClick={() => handleAnalyze()} disabled={loading} className="glow-btn" style={{ flex: 1, padding: '14px', fontSize: 16, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                      {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                          <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block' }}>⚡</motion.span>
                          Analyzing with AI...
                        </span>
                      ) : '🚀 Analyze My Profile'}
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
