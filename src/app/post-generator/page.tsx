'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { LinkedInProfile } from '@/types';
import { generateViralHooks } from '@/lib/content-generator';
import { generatePostAction } from '@/app/actions/ai-actions';

const templates = [
  { id: 'tips', label: 'Value Tips', content: "5 things I wish I knew when starting [Topic]...\n\n1. [Point 1]\n2. [Point 2]\n3. [Point 3]\n\nConsistency is key. What would you add?\n\n#Career #Tips #Growth" },
  { id: 'story', label: 'Personal Story', content: "I&apos;ll never forget the day [Story Introduction]...\n\nIt taught me that [Key Lesson].\n\nSometimes we need to [Actionable Advice].\n\nHow has your journey been?" },
  { id: 'announcement', label: 'Announcement', content: "Big news! I&apos;m excited to share that [Event/Project]...\n\nThis is a huge milestone for [Context].\n\nThank you to [People] for the support!\n\n#BuildingInPublic #Milestone" },
  { id: 'debate', label: 'Engagement/Debate', content: "Hot Take: [Topic] is overrated. Here&apos;s why:\n\n1. [Reason 1]\n2. [Reason 2]\n\nAgree or disagree? Let&apos;s discuss in the comments." },
];

export default function PostGeneratorPage() {
  const [postText, setPostText] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState<string | null>(null);
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [hooks, setHooks] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('linkhive_profile');
    if (stored) {
      try {
        /* eslint-disable react-hooks/set-state-in-effect */
        setProfile(JSON.parse(stored));
        /* eslint-enable react-hooks/set-state-in-effect */
      } catch { }
    }
  }, []);

  const handleGenerateHooks = () => {
    if (!profile) return;
    const newHooks = generateViralHooks(profile.jobRoleTarget, profile.skills);
    setHooks(newHooks);
  };

  const handleTemplateSelect = (content: string) => {
    let replaced = content;
    if (profile) {
      replaced = content
        .replace(/\[Topic\]/g, profile.skills[0] || 'Modern Tech')
        .replace(/\[Story Introduction\]/g, `I started my journey as a ${profile.jobRoleTarget}`)
        .replace(/\[Key Lesson\]/g, `perseverance and mastering ${profile.skills.slice(0, 2).join(' & ')} are the keys to growth`)
        .replace(/\[Context\]/g, `the ${profile.industry} industry`)
        .replace(/\[People\]/g, 'my mentors and network');
    }
    setPostText(replaced);
  };

  const handleGeneratePost = async () => {
    if (!postText.trim()) return;
    setIsGenerating(true);
    setActiveAssistant('generating');
    
    const result = await generatePostAction(postText, profile);
    if (result.success && result.content) {
      setPostText(result.content);
    } else {
      alert('Failed to generate post: ' + result.error);
    }
    
    setIsGenerating(false);
    setActiveAssistant(null);
  };

  const runAssistant = (action: string) => {
    if (!postText) return;
    setIsGenerating(true);
    setActiveAssistant(action);
    
    // Simulate AI processing
    setTimeout(() => {
      let newText = postText;
      switch(action) {
        case 'improve': newText = `Enhanced: ${postText}\n\n(AI refined for maximum clarity and professional impact)`; break;
        case 'rephrase': newText = `Rephrased: ${postText.split(' ').reverse().join(' ')}... just kidding! \n\nActually, the AI would rephrase your core message for better flow here.`; break;
        case 'shorten': newText = postText.slice(0, Math.floor(postText.length * 0.7)) + "..."; break;
        case 'emoji': newText = postText + " (AI would normally add emojis here, but they are currently disabled)"; break;
        case 'hashtags': newText = postText + "\n\n#LinkHive #ProfessionalGrowth #AI"; break;
      }
      setPostText(newText);
      setIsGenerating(false);
      setActiveAssistant(null);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(postText);
    alert('Post copied to clipboard!');
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingTop: '160px', paddingBottom: '60px', background: '#0a0a0f' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <Link href="/" style={{ color: 'rgba(226,232,240,0.5)', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
               Back to Home
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40, textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>
              Free LinkedIn <span className="gradient-text">Post Generator</span>
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              Streamline your content creation with the best AI Post Maker.
            </p>
          </motion.div>

          <div className="responsive-grid-2" style={{ alignItems: 'start' }}>
            
            {/* Editor Side */}
            <div>
              {/* Viral Hooks Section */}
              <div className="glass-card" style={{ padding: 24, marginBottom: 24, border: '1px solid rgba(10,102,194,0.1)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-blue-light)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Viral Hook Generator
                </h3>
                <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, marginBottom: 16 }}>
                  Get catchy opening lines to stop the scroll.
                </p>
                <button 
                  onClick={handleGenerateHooks} 
                  className="tab-btn" 
                  disabled={!profile}
                  style={{ width: '100%', marginBottom: 16, background: 'rgba(10,102,194,0.1)', borderColor: 'rgba(251,191,36,0.2)', color: 'var(--accent-blue-light)' }}
                >
                  Generate Hooks
                </button>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {hooks.map((hook, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -5 }} 
                      animate={{ opacity: 1, x: 0 }}
                      style={{ 
                        padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(251,191,36,0.05)', 
                        borderRadius: 8, fontSize: 12, color: '#e2e8f0', cursor: 'pointer'
                      }}
                      onClick={() => { setPostText(hook + '\n\n' + postText); }}
                      title="Click to add to editor"
                    >
                      &quot;{hook}&quot;
                    </motion.div>
                  ))}
                  {profile && hooks.length === 0 && <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: 11, textAlign: 'center' }}>Click the button above to generate hooks!</p>}
                  {!profile && <p style={{ color: '#fca5a5', fontSize: 11, textAlign: 'center' }}>Complete an audit first to use this feature.</p>}
                </div>
              </div>

              <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <button onClick={handleGeneratePost} className="action-pill" disabled={isGenerating} style={{ background: 'rgba(10,102,194,0.2)', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue-light)' }}>Generate with AI</button>
                  <button onClick={() => runAssistant('improve')} className="action-pill" disabled={isGenerating}>Improve</button>
                  <button onClick={() => runAssistant('rephrase')} className="action-pill" disabled={isGenerating}>Rephrase</button>
                  <button onClick={() => runAssistant('shorten')} className="action-pill" disabled={isGenerating}>Shorten</button>
                  <button onClick={() => runAssistant('hashtags')} className="action-pill" disabled={isGenerating}># Hashtags</button>
                </div>

                <div style={{ position: 'relative' }}>
                  <textarea 
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Type your topic or paste your draft here..."
                    style={{ 
                      width: '100%', 
                      height: 300, 
                      background: 'rgba(15,23,42,0.6)', 
                      border: '1px solid rgba(226,232,240,0.1)', 
                      padding: 20, 
                      borderRadius: 12, 
                      color: '#f1f5f9', 
                      fontSize: 16, 
                      lineHeight: 1.6,
                      resize: 'none',
                      outline: 'none'
                    }}
                  />
                  <AnimatePresence>
                    {isGenerating && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}
                      >
                        <div className="gradient-text" style={{ fontWeight: 700 }}>AI is {activeAssistant}...</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div style={{ marginTop: 20 }}>
                  <button onClick={handleCopy} className="glow-btn" style={{ width: '100%', padding: '14px', borderRadius: 10, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    Copy to Clipboard
                  </button>
                </div>
              </div>

              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Select a Template</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {templates.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => handleTemplateSelect(t.content)}
                      className="tab-btn" 
                      style={{ padding: '10px', fontSize: 14, textAlign: 'center' }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Side */}
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
                <button onClick={() => setPreviewMode('desktop')} className={`action-pill ${previewMode === 'desktop' ? 'active' : ''}`}>Desktop</button>
                <button onClick={() => setPreviewMode('mobile')} className={`action-pill ${previewMode === 'mobile' ? 'active' : ''}`}>Mobile</button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ 
                  width: previewMode === 'mobile' ? 375 : '100%', 
                  maxWidth: 550,
                  background: 'white', 
                  borderRadius: 12, 
                  padding: 16, 
                  color: '#1a1a1a',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  minHeight: 400
                }}>
                  {/* LinkedIn Mock Header */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
                      {profile?.name ? profile.name[0] : 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{profile?.name || 'User Name'}</div>
                      <div style={{ fontSize: 12, color: '#666', lineHeight: 1.2 }}>{profile?.headline || 'Your Professional Headline'}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>12h</div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                    {postText || "Your post content will appear here..."}
                  </div>

                  {/* Mock Stats */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 12, color: '#666' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      64 likes
                    </div>
                    <div>27 comments  4 reposts</div>
                  </div>

                  {/* Mock Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 8, fontSize: 14, fontWeight: 600, color: '#666' }}>
                    <span>Like</span>
                    <span>Comment</span>
                    <span>Repost</span>
                    <span>Send</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <style jsx>{`
        .action-pill {
          padding: 8px 16px;
          border-radius: 100px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-pill:hover {
          background: rgba(99, 102, 241, 0.2);
          border-color: rgba(99, 102, 241, 0.4);
        }
        .action-pill.active {
          background: #8b5cf6;
          color: white;
          border-color: #8b5cf6;
        }
        .action-pill:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <Footer />
    </>
  );
}
