'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionScore } from '@/types';

interface SectionCardProps {
  section: SectionScore;
  index: number;
  roastMode: boolean;
  roast?: string;
}

export default function SectionCard({ section, index, roastMode, roast }: SectionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const pct = (section.score / section.maxScore) * 100;

  const barColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#3b82f6' : pct >= 40 ? '#f59e0b' : '#ef4444';

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card"
      style={{ padding: 24, cursor: 'pointer' }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{section.icon}</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{section.name}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: barColor }}>
            {section.score}/{section.maxScore}
          </span>
          <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: 18, transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
            ▾
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(99,102,241,0.1)', overflow: 'hidden', marginBottom: expanded ? 20 : 0 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay: index * 0.1, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${barColor}, ${section.color})` }}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            {roastMode && roast && (
              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 16 }}>
                <p style={{ color: '#fca5a5', fontSize: 14 }}>🔥 {roast}</p>
              </div>
            )}

            {section.strengths.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ color: '#10b981', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>✅ Strengths</h4>
                {section.strengths.map((s, i) => (
                  <p key={i} style={{ color: 'rgba(226,232,240,0.6)', fontSize: 14, marginBottom: 4, paddingLeft: 16 }}>• {s}</p>
                ))}
              </div>
            )}

            {section.weaknesses.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>❌ Needs Improvement</h4>
                {section.weaknesses.map((w, i) => (
                  <p key={i} style={{ color: 'rgba(226,232,240,0.6)', fontSize: 14, marginBottom: 4, paddingLeft: 16 }}>• {w}</p>
                ))}
              </div>
            )}

            {section.suggestions.length > 0 && (
              <div>
                <h4 style={{ color: '#8b5cf6', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>💡 AI Suggestions</h4>
                {section.suggestions.map((sg, i) => (
                  <div key={i} style={{ padding: 14, borderRadius: 10, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)', marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ color: '#c4b5fd', fontSize: 13, fontWeight: 600 }}>{sg.title}</span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: sg.impact === 'high' ? 'rgba(239,68,68,0.15)' : sg.impact === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
                        color: sg.impact === 'high' ? '#fca5a5' : sg.impact === 'medium' ? '#fcd34d' : '#93c5fd',
                      }}>
                        {sg.impact} impact
                      </span>
                    </div>
                    {sg.current && (
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: 11, textTransform: 'uppercase' }}>Current</span>
                        <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, fontStyle: 'italic', marginTop: 2 }}>{sg.current}</p>
                      </div>
                    )}
                    {sg.suggested && (
                      <div>
                        <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: 11, textTransform: 'uppercase' }}>Suggested</span>
                        <p style={{ color: '#a5f3fc', fontSize: 13, marginTop: 2, whiteSpace: 'pre-line' }}>{sg.suggested}</p>
                        <button
                          onClick={() => handleCopy(sg.suggested!, i)}
                          style={{
                            marginTop: 8, padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: copied === i ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.15)',
                            border: '1px solid ' + (copied === i ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.2)'),
                            color: copied === i ? '#6ee7b7' : '#a5b4fc', cursor: 'pointer',
                          }}
                        >
                          {copied === i ? '✓ Copied!' : '📋 Copy'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
