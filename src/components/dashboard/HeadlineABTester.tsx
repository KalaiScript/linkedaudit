'use client';
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkedInProfile, AIAnalysisResponse } from '@/types';
import { generateHeadlines } from '@/lib/content-generator';

interface HeadlineVote { index: number; vote: 'up' | 'down' | null; }

export default function HeadlineABTester({ profile, aiData }: { profile: LinkedInProfile; aiData: AIAnalysisResponse | null }) {
  const [votes, setVotes] = useState<HeadlineVote[]>([]);
  const [showWinner, setShowWinner] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const getCTRScore = useCallback((headline: string, index: number) => {
    let base = 2.1;
    if (headline.length > 100 && headline.length < 200) base += 1.2;
    if (headline.includes('|') || headline.includes('•')) base += 0.8;
    if (/\d/.test(headline)) base += 1.5;
    if (headline.toLowerCase().includes('helping')) base += 0.6;
    const vote = votes.find(v => v.index === index);
    if (vote?.vote === 'up') base += 1.0;
    if (vote?.vote === 'down') base -= 0.5;
    return Math.min(Math.max(base, 1.0), 8.5).toFixed(1);
  }, [votes]);

  const headlines = useMemo(() => {
    const aiHeadlines = aiData?.headlines || [];
    const localHeadlines = generateHeadlines(profile.jobRoleTarget, profile.skills, profile.experienceLevel);
    const all = [
      ...aiHeadlines.map((h: { style: string; content: string }) => ({ style: h.style, content: h.content, source: 'AI Generated' })),
      ...localHeadlines.slice(0, Math.max(0, 4 - aiHeadlines.length)).map(h => ({ style: h.style, content: h.content, source: 'Template' })),
    ];
    return all.slice(0, 4);
  }, [profile, aiData]);

  const handleVote = (index: number, vote: 'up' | 'down') => {
    setVotes(prev => {
      const existing = prev.find(v => v.index === index);
      if (existing) {
        if (existing.vote === vote) return prev.filter(v => v.index !== index);
        return prev.map(v => v.index === index ? { ...v, vote } : v);
      }
      return [...prev, { index, vote }];
    });
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const winnerIndex = useMemo(() => {
    if (!showWinner) return -1;
    let bestIdx = 0, bestScore = 0;
    headlines.forEach((_: unknown, i: number) => {
      const s = parseFloat(getCTRScore(headlines[i].content, i));
      const v = votes.find(v => v.index === i);
      const bonus = v?.vote === 'up' ? 2 : v?.vote === 'down' ? -1 : 0;
      if (s + bonus > bestScore) { bestScore = s + bonus; bestIdx = i; }
    });
    return bestIdx;
  }, [showWinner, headlines, votes, getCTRScore]);

  return (
    <div className="glass-card" style={{ padding: 24, marginTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Headline A/B Tester</h3>
          <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, margin: 0 }}>Compare headline variants. Vote on your favorites to find the winner.</p>
        </div>
        <button onClick={() => setShowWinner(!showWinner)} style={{ padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: showWinner ? 'rgba(16,185,129,0.15)' : 'rgba(10,102,194,0.15)', border: `1px solid ${showWinner ? 'rgba(16,185,129,0.3)' : 'rgba(10,102,194,0.3)'}`, color: showWinner ? '#6ee7b7' : '#70b5f9', cursor: 'pointer' }}>
          {showWinner ? '✓ Winner Shown' : 'Pick Winner'}
        </button>
      </div>

      <div style={{ padding: 16, borderRadius: 12, marginBottom: 20, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Your Current Headline</div>
        <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>{profile.headline}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {headlines.map((h: { style: string; content: string; source: string }, i: number) => {
          const isWinner = showWinner && i === winnerIndex;
          const vote = votes.find(v => v.index === i);
          const ctr = getCTRScore(h.content, i);
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ padding: 20, borderRadius: 14, background: isWinner ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isWinner ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}`, position: 'relative', transition: 'all 0.3s' }}>
              <AnimatePresence>
                {isWinner && (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ position: 'absolute', top: -10, right: -10, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, boxShadow: '0 4px 12px rgba(16,185,129,0.4)' }}>
                    WINNER
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'rgba(10,102,194,0.1)', color: '#70b5f9' }}>{h.style}</span>
                <span style={{ fontSize: 10, color: 'rgba(226,232,240,0.3)', fontWeight: 600 }}>{h.source}</span>
              </div>
              <p style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 1.6, marginBottom: 16, minHeight: 60 }}>{h.content}</p>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: 'rgba(226,232,240,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>Est. Click-Through Rate</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: parseFloat(ctr) > 5 ? '#6ee7b7' : parseFloat(ctr) > 3 ? '#fcd34d' : '#fca5a5' }}>{ctr}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(parseFloat(ctr) / 8.5) * 100}%` }} transition={{ duration: 1, delay: i * 0.15 }}
                    style={{ height: '100%', background: parseFloat(ctr) > 5 ? '#10b981' : parseFloat(ctr) > 3 ? '#f59e0b' : '#ef4444', borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => handleVote(i, 'up')} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 14, cursor: 'pointer', border: 'none', background: vote?.vote === 'up' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', color: vote?.vote === 'up' ? '#6ee7b7' : 'rgba(226,232,240,0.5)' }}>👍</button>
                <button onClick={() => handleVote(i, 'down')} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 14, cursor: 'pointer', border: 'none', background: vote?.vote === 'down' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)', color: vote?.vote === 'down' ? '#fca5a5' : 'rgba(226,232,240,0.5)' }}>👎</button>
                <button onClick={() => handleCopy(h.content, i)} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: copied === i ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.1)', border: `1px solid ${copied === i ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.2)'}`, color: copied === i ? '#6ee7b7' : '#a5b4fc', cursor: 'pointer' }}>
                  {copied === i ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
