'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import { fetchLinkedInProfileAction } from '@/app/actions/linkedin-actions';

const userTypes = ['Student', 'Developer', 'Working Professional', 'Other'];
const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'Data Analyst', 'Data Scientist', 'AI/ML Engineer', 'DevOps Engineer', 'Product Manager', 'Mobile Developer', 'Cybersecurity Analyst', 'Cloud Architect', 'QA Engineer', 'Other'];
const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Media', 'Consulting', 'Manufacturing', 'Government', 'Startup', 'Other'];
const levels = ['Fresher', 'Junior (1-2 years)', 'Mid (3-5 years)', 'Senior (5-10 years)', 'Lead/Manager', 'Executive'];
const commonSkills = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'GraphQL', 'REST API', 'Agile', 'DevOps', 'CI/CD', 'Machine Learning', 'Data Science', 'UI/UX', 'Figma'];

export default function AuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingMinimal, setFetchingMinimal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Step 1: Target Goals & URL
  const [url, setUrl] = useState('');
  const [userType, setUserType] = useState('');
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [level, setLevel] = useState('');

  // Step 2: Professional Identity
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [yearsExp, setYearsExp] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  // Step 3: Metrics & Activity
  const [followers, setFollowers] = useState('');
  const [connections, setConnections] = useState('');
  const [postsPerWeek, setPostsPerWeek] = useState('');
  const [avgEngagement, setAvgEngagement] = useState('');
  const [searchAppearances, setSearchAppearances] = useState('');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [hasBanner, setHasBanner] = useState(false);
  const [creatorMode, setCreatorMode] = useState(false);
  const [customUrl, setCustomUrl] = useState(true);
  const [experienceDesc, setExperienceDesc] = useState('');
  const [isFresher, setIsFresher] = useState(false);

  // Persistence: Load on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('linkhive_audit_draft');
    const savedProfile = localStorage.getItem('linkhive_profile');
    
    if (savedDraft || savedProfile) {
      try {
        const data = savedDraft ? JSON.parse(savedDraft) : JSON.parse(savedProfile!);
        /* eslint-disable react-hooks/set-state-in-effect */
        if (data.url) setUrl(data.url);
        if (data.userType) setUserType(data.userType);
        if (data.role || data.jobRoleTarget) setRole(data.role || data.jobRoleTarget);
        if (data.industry) setIndustry(data.industry);
        if (data.level || data.experienceLevel) setLevel(data.level || data.experienceLevel);
        if (data.name) setName(data.name);
        if (data.headline) setHeadline(data.headline);
        if (data.about) setAbout(data.about);
        if (data.location) setLocation(data.location);
        if (data.selectedSkills || data.skills) setSelectedSkills(data.selectedSkills || data.skills);
        if (data.yearsExp || data.yearsOfExperience) setYearsExp(data.yearsExp || data.yearsOfExperience);
        if (data.followers) setFollowers(data.followers.toString());
        if (data.connections) setConnections(data.connections.toString());
        if (data.postsPerWeek) setPostsPerWeek(data.postsPerWeek.toString());
        if (data.avgEngagement || data.averageEngagement) setAvgEngagement((data.avgEngagement || data.averageEngagement).toString());
        if (data.searchAppearances) setSearchAppearances(data.searchAppearances.toString());
        if (data.hasPhoto !== undefined || data.profilePhoto !== undefined) setHasPhoto(data.hasPhoto !== undefined ? data.hasPhoto : data.profilePhoto);
        if (data.hasBanner !== undefined || data.customBanner !== undefined) setHasBanner(data.hasBanner !== undefined ? data.hasBanner : data.customBanner);
        if (data.creatorMode !== undefined) setCreatorMode(data.creatorMode);
        if (data.customUrl !== undefined) setCustomUrl(data.customUrl);
        if (data.experienceDesc) setExperienceDesc(data.experienceDesc);
        if (data.step) setStep(data.step);
        /* eslint-enable react-hooks/set-state-in-effect */
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persistence: Save on change
  useEffect(() => {
    if (!isLoaded) return;
    const draft = {
      url, userType, role, industry, level,
      name, headline, about, location, selectedSkills, yearsExp,
      followers, connections, postsPerWeek, avgEngagement, searchAppearances,
      hasPhoto, hasBanner, creatorMode, customUrl, experienceDesc, step
    };
    localStorage.setItem('linkhive_audit_draft', JSON.stringify(draft));
  }, [url, userType, role, industry, level, name, headline, about, location, selectedSkills, yearsExp, followers, connections, postsPerWeek, avgEngagement, searchAppearances, hasPhoto, hasBanner, creatorMode, customUrl, experienceDesc, step, isLoaded]);

  const handleNext = async () => {
    if (step === 1) {
      if (level.includes('Fresher')) setIsFresher(true);
      else setIsFresher(false);

      if (url && url.includes('linkedin.com/in/')) {
        setFetchingMinimal(true);
        const res = await fetchLinkedInProfileAction(url);
        if (res.success && res.data) {
          if (res.data.name) setName(res.data.name);
          if (res.data.headline) setHeadline(res.data.headline);
          if (res.data.about) setAbout(res.data.about);
          if (res.data.location) setLocation(res.data.location);
          if (res.data.followers) setFollowers(res.data.followers.toString());
          if (res.data.connections) setConnections(res.data.connections.toString());
          // Auto-calculate search appearances based on followers/activity if not provided
          if (res.data.searchAppearances) setSearchAppearances(res.data.searchAppearances.toString());
          else if (res.data.followers) setSearchAppearances(Math.round(res.data.followers / 20).toString());
        }
        setFetchingMinimal(false);
      }
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step < 3) {
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

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);

    const profileData = {
      url: url || 'manual',
      name: name || 'User',
      headline: headline || (userType === 'Student' ? `${role} | Tech Enthusiast` : 'Experienced Professional'),
      about: about || '', // AI will generate this if empty
      location: location || 'India',
      connections: parseInt(connections) || 500,
      followers: parseInt(followers) || 0,
      profilePhoto: hasPhoto,
      customBanner: hasBanner,
      bannerDescription: 'Professional tech banner',
      experience: isFresher ? [] : [{
        title: userType === 'Student' ? role : 'Professional',
        company: 'Your Best Role',
        duration: 'Past - Present',
        description: experienceDesc || '',
        hasMetrics: /\d/.test(experienceDesc),
        hasActionVerbs: true,
      }],
      yearsOfExperience: yearsExp || (isFresher ? '0' : '1'),
      education: [{ school: 'University', degree: 'Degree', field: 'Field', year: '2024' }],
      skills: selectedSkills,
      certifications: [],
      projects: [],
      featuredItems: 2,
      postsPerWeek: parseFloat(postsPerWeek) || 0,
      averageEngagement: parseInt(avgEngagement) || 0,
      recommendations: 0,
      searchAppearances: parseInt(searchAppearances) || Math.round((parseInt(followers) || 0) / 20) || 50,
      creatorMode,
      seoKeywords: selectedSkills.slice(0, 5).map(s => s.toLowerCase()),
      contactInfo: true,
      customUrl,
      jobRoleTarget: userType === 'Student' ? role : 'Professional',
      industry: industry || 'Technology',
      experienceLevel: level || 'Mid',
      userType,
      isFresher
    };

    localStorage.setItem('linkhive_profile', JSON.stringify(profileData));
    localStorage.removeItem('linkhive_audit_draft');
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const isStep1Valid = userType && (userType === 'Student' ? role : true) && industry && level;
  const isStep2Valid = name && headline && selectedSkills.length > 0;

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

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
              Audit Your <span className="gradient-text">LinkHive Profile</span>
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 16 }}>
              {step === 1 ? 'Step 1: Define your target and profile URL' : step === 2 ? 'Step 2: Your professional identity & skills' : 'Step 3: Your LinkedIn activity'}
            </p>
            
            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 24 }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ 
                  width: 36, height: 36, borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: 14, fontWeight: 700, 
                  background: step >= s ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'rgba(255,255,255,0.05)',
                  border: step >= s ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  color: step >= s ? 'white' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 'clamp(20px, 6vw, 40px)', position: 'relative' }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                    Target goals & LinkedIn URL
                  </h3>
                  
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>LinkedIn Profile URL (Optional - to pre-fill photo/name)</label>
                    <input type="text" className="input-field" placeholder="https://linkedin.com/in/your-username" value={url} onChange={e => setUrl(e.target.value)} />
                  </div>

                  <div className="responsive-grid-2" style={{ marginBottom: 32 }}>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>I am a...</label>
                      <select className="select-field" value={userType} onChange={e => setUserType(e.target.value)}>
                        <option value="">Select User Type</option>
                        {userTypes.map(ut => <option key={ut} value={ut}>{ut}</option>)}
                      </select>
                    </div>
                    {userType === 'Student' && (
                      <div>
                        <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Target Role</label>
                        <select className="select-field" value={role} onChange={e => setRole(e.target.value)}>
                          <option value="">Select Role</option>
                          {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    )}
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
                  </div>

                  <button onClick={handleNext} disabled={!isStep1Valid || fetchingMinimal} className="glow-btn" style={{ width: '100%', padding: '16px', fontSize: 17, opacity: isStep1Valid ? 1 : 0.6 }}>
                    {fetchingMinimal ? 'Pre-filling from LinkedIn...' : 'Next: Professional Identity'}
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                    Professional Identity & Skills
                  </h3>
                  
                  <div className="responsive-grid-2" style={{ marginBottom: 20 }}>
                    <InputField label="Full Name" value={name} onChange={setName} placeholder="John Doe" />
                    <InputField label="Current Location" value={location} onChange={setLocation} placeholder="City, Country" />
                  </div>

                  <div className="responsive-grid-2" style={{ marginBottom: 20 }}>
                    <InputField label="Current Headline" value={headline} onChange={setHeadline} placeholder="Senior Software Engineer | React • Node.js" />
                    <InputField label="Years of Experience" value={yearsExp} onChange={setYearsExp} placeholder={isFresher ? '0' : '3'} type="number" />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>About / Summary</label>
                    <textarea className="input-field" rows={4} placeholder="Paste your LinkedIn About section here... (or leave blank for AI to generate one)" value={about} onChange={e => setAbout(e.target.value)} style={{ resize: 'vertical' }} />
                  </div>

                  <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Skills Selector</label>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input 
                          type="text" 
                          placeholder="Add custom skill..." 
                          value={customSkill} 
                          onChange={e => setCustomSkill(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addCustomSkill()}
                          style={{ 
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#fff', width: 140
                          }}
                        />
                        <button onClick={addCustomSkill} style={{ background: '#4f46e5', border: 'none', borderRadius: 6, color: '#fff', padding: '4px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>ADD</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 150, overflowY: 'auto', padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                      {commonSkills.map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          style={{
                            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: selectedSkills.includes(skill) ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'rgba(255,255,255,0.05)',
                            color: selectedSkills.includes(skill) ? 'white' : 'rgba(255,255,255,0.5)',
                            border: '1px solid ' + (selectedSkills.includes(skill) ? 'transparent' : 'rgba(255,255,255,0.1)'),
                            cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    {selectedSkills.length > 0 && (
                      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        <span style={{ fontSize: 12, color: 'rgba(226,232,240,0.4)', alignSelf: 'center' }}>Selected:</span>
                        {selectedSkills.map(s => <span key={s} style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600 }}>{s} •</span>)}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={handleBack} style={{ flex: '0 0 auto', padding: '14px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a5b4fc', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                      Back
                    </button>
                    <button onClick={handleNext} disabled={!isStep2Valid} className="glow-btn" style={{ flex: 1, padding: '14px', fontSize: 16, opacity: isStep2Valid ? 1 : 0.6 }}>
                      Next: Network & Activity
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                    Your LinkedIn activity
                  </h3>

                  <div className="responsive-grid-2" style={{ marginBottom: 20 }}>
                    <InputField label="Followers" value={followers} onChange={setFollowers} placeholder="2500" type="number" />
                    <InputField label="Connections" value={connections} onChange={setConnections} placeholder="500+" type="number" />
                  </div>

                  <div className="responsive-grid-2" style={{ marginBottom: 20 }}>
                    <InputField label="Posts per Week" value={postsPerWeek} onChange={setPostsPerWeek} placeholder="2" type="number" />
                    <InputField label="Avg Engagement" value={avgEngagement} onChange={setAvgEngagement} placeholder="45" type="number" />
                  </div>

                  {!isFresher && (
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Experience Description (Best Role)</label>
                      <textarea className="input-field" rows={4} placeholder="Briefly describe your main achievements..." value={experienceDesc} onChange={e => setExperienceDesc(e.target.value)} style={{ resize: 'vertical' }} />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
                    <ToggleField label="Profile Photo" checked={hasPhoto} onChange={setHasPhoto} />
                    <ToggleField label="Custom Banner" checked={hasBanner} onChange={setHasBanner} />
                    <ToggleField label="Creator Mode" checked={creatorMode} onChange={setCreatorMode} />
                    <ToggleField label="Custom URL" checked={customUrl} onChange={setCustomUrl} />
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={handleBack} disabled={loading} style={{ flex: '0 0 auto', padding: '14px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#a5b4fc', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                      Back
                    </button>
                    <button onClick={handleAnalyze} disabled={loading} className="glow-btn" style={{ flex: 1, padding: '14px', fontSize: 16, opacity: loading ? 0.7 : 1 }}>
                      {loading ? 'Processing with AI...' : 'Start AI Audit'}
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
          background: checked ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'rgba(251,191,36,0.1)',
          transition: 'all 0.3s', position: 'relative',
        }}
      >
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', transform: checked ? 'translateX(18px)' : 'translateX(0)', transition: 'transform 0.3s' }} />
      </button>
      <span style={{ color: 'rgba(226,232,240,0.6)', fontSize: 13, fontWeight: 500 }}>{label}</span>
    </label>
  );
}
