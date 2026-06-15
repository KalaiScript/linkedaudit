'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { LinkedInProfile } from '@/types';
import { generateRepliesAction } from '@/app/actions/ai-actions';

const replyTones = [
  { id: 'Insightful', label: '💡 Insightful', desc: 'Adds value, extensions, or industry context' },
  { id: 'Supporting', label: '🤝 Supporting', desc: 'Warm agreement and validation' },
  { id: 'Contrarian', label: '🤔 Contrarian', desc: 'Polite, constructive counterpoints' },
  { id: 'Humorous', label: '😂 Humorous', desc: 'Witty, relatable, and lighthearted' }
];

const mockReplies = [
  "This is a great point. I would also add that building consistency is a muscle—the more you write, the easier it gets to find your voice. Thanks for sharing!",
  "Spot on! I've noticed that the posts that perform best are always the ones where I share raw personal lessons rather than generic corporate updates. Authenticity wins.",
  "Interesting perspective. While consistency is crucial, do you think there's a risk of dilution? Sometimes fewer, higher-quality posts build more trust than daily noise."
];

export default function ReplyAssistantPage() {
  const [postText, setPostText] = useState('');
  const [activeTone, setActiveTone] = useState('Insightful');
  const [replies, setReplies] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  const handleGenerate = async () => {
    if (!postText.trim()) return;
    setIsGenerating(true);
    const result = await generateRepliesAction(postText, activeTone, profile);
    if (result.success && result.replies) {
      setReplies(result.replies);
    } else {
      alert(result.error || 'Failed to generate comments.');
    }
    setIsGenerating(false);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentReplies = replies.length > 0 ? replies : mockReplies;

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingTop: '160px', paddingBottom: '60px', background: '#06060e' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Link href="/" style={{ color: 'rgba(226,232,240,0.5)', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
               Back to Home
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>
              LinkedIn <span className="gradient-text">Comment Reply Assistant</span>
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: 16, maxWidth: 650, margin: '0 auto' }}>
              Scale your networking and visibility. Paste a post, choose your engagement strategy, and generate high-value comments that build meaningful professional relationships.
            </p>
          </div>

          <div className="responsive-grid-2" style={{ alignItems: 'start', gap: 32 }}>
            
            {/* Input & Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Paste LinkedIn Post</h3>
                
                <div style={{ marginBottom: 20 }}>
                  <textarea 
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Paste the post you want to comment on here..."
                    rows={8}
                    style={{ 
                      width: '100%', 
                      background: 'rgba(15,23,42,0.6)', 
                      border: '1px solid rgba(226,232,240,0.1)', 
                      padding: 16, 
                      borderRadius: 12, 
                      color: '#f1f5f9', 
                      fontSize: 15, 
                      lineHeight: 1.5,
                      resize: 'vertical',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 12, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>Reply Engagement Strategy</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {replyTones.map(tone => (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setActiveTone(tone.id)}
                        className={`tab-btn ${activeTone === tone.id ? 'active' : ''}`}
                        style={{ 
                          padding: '12px', 
                          fontSize: '13px', 
                          textAlign: 'center',
                          borderRadius: '10px',
                          border: activeTone === tone.id ? '1px solid var(--accent-blue-light)' : '1px solid rgba(255,255,255,0.08)',
                          background: activeTone === tone.id ? 'var(--accent-blue)' : 'rgba(255,255,255,0.03)'
                        }}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !postText.trim()} 
                  className="glow-btn"
                  style={{ width: '100%', padding: '14px', fontSize: 16, opacity: (isGenerating || !postText.trim()) ? 0.6 : 1 }}
                >
                  {isGenerating ? 'AI Generating Replies...' : 'Generate Replies'}
                </button>
              </div>

            </div>

            {/* Generated Outputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              <div className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>Suggested Comments</h3>
                  <span style={{ fontSize: 12, color: 'rgba(226,232,240,0.4)', fontWeight: 600 }}>
                    {replies.length > 0 ? 'Live AI Generated' : 'Showing Templates'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {currentReplies.map((reply, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        padding: 20,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 12,
                        position: 'relative'
                      }}
                    >
                      {/* Tone tag */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ 
                          fontSize: 10, 
                          fontWeight: 700, 
                          textTransform: 'uppercase', 
                          color: '#a78bfa',
                          background: 'rgba(167,139,250,0.1)',
                          padding: '2px 8px',
                          borderRadius: 4
                        }}>
                          Option {index + 1}
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)' }}>
                          {reply.length} chars
                        </span>
                      </div>

                      <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
                        {reply}
                      </p>

                      <button
                        onClick={() => handleCopy(reply, index)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: copiedIndex === index ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(99,102,241,0.2)',
                          background: copiedIndex === index ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.08)',
                          color: copiedIndex === index ? '#6ee7b7' : '#a5b4fc',
                        }}
                      >
                        {copiedIndex === index ? '✓ Copied to Clipboard!' : 'Copy Comment'}
                      </button>
                    </motion.div>
                  ))}
                </div>

              </div>

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
