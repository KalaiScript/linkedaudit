'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import { fetchLinkedInProfileAction } from '@/app/actions/linkedin-actions';

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

  const handleNext = async () => {
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
      // If URL is provided, skip manual entry and try to fetch real data
      await handleAnalyze(url, extractedName);
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

  const handleAnalyze = async (profileUrl?: string, passedName?: string) => {
    setLoading(true);

    let profileData: any = null;

    if (profileUrl) {
      // Attempt live fetch
      const fetchRes = await fetchLinkedInProfileAction(profileUrl);
      if (fetchRes.success && fetchRes.data) {
        profileData = {
          ...fetchRes.data,
          jobRoleTarget: role || fetchRes.data.headline || 'Software Engineer',
          industry: industry || 'Technology',
          experienceLevel: level || 'Mid',
          country: country || 'United States',
          seoKeywords: fetchRes.data.skills?.slice(0, 5).map(s => s.toLowerCase()) || [],
        };
      } else {
        alert(fetchRes.error || "Failed to fetch LinkedIn profile");
        setLoading(false);
        setStep(2); // Fallback to manual entry if API fails
        return;
      }
    } else {
      // Use manually entered data
      profileData = {
        url: 'manual',
        name: name || passedName || 'User',
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
    }

    localStorage.setItem('profilepulse_profile', JSON.stringify(profileData));
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

                  <button onClick={handleNext} disabled={loading || (step === 1 && !url && (!role || !industry || !level || !country))} className="glow-btn" style={{ width: '100%', padding: '16px', fontSize: 17, opacity: (step === 1 && !url && (!role || !industry || !level || !country)) ? 0.6 : 1 }}>
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block' }}>⚡</motion.span>
                        Analyzing with AI...
                      </span>
                    ) : 'Start AI Analysis 🚀'}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, marginBottom: 20, padding: '10px 16px', borderRadius: 10, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    💡 Fill in your current LinkedIn profile details for an accurate analysis. Copy info directly from your profile.
                  </p>

                  {/* Name & Headline */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <InputField label="Full Name" value={name} onChange={setName} placeholder="John Doe" />
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
