'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AuditResult } from '@/types';

export default function BeforeAfterPreview({ result, aiData }: { result: AuditResult; aiData: any }) {
  const optimized = useMemo(() => {
    const aiHeadline = aiData?.headlines?.[0]?.content || `${result.profile.jobRoleTarget} | ${result.profile.skills.slice(0, 3).join(' • ')} | Building Impactful Solutions`;
    const aiAbout = aiData?.abouts?.[0]?.content || `Passionate ${result.profile.jobRoleTarget} with expertise in ${result.profile.skills.slice(0, 3).join(', ')}. Focused on delivering high-impact solutions in the ${result.profile.industry || 'Tech'} space.`;
    return {
      headline: aiHeadline,
      about: aiAbout.slice(0, 180) + (aiAbout.length > 180 ? '...' : ''),
      score: Math.min(result.overallScore + 25, 98),
    };
  }, [result, aiData]);

  const currentAbout = (result.profile.about || 'No about section written yet.').slice(0, 180) + ((result.profile.about?.length || 0) > 180 ? '...' : '');

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
          Before vs After Preview
        </h3>
        <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, margin: 0 }}>
          See how your profile transforms after applying AI suggestions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* BEFORE */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            padding: 24, borderRadius: 16,
            background: 'rgba(239,68,68,0.04)',
            border: '1px solid rgba(239,68,68,0.15)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Label */}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            padding: '4px 12px', borderRadius: 20,
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            fontSize: 10, fontWeight: 800, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: 1,
          }}>
            Before
          </div>

          {/* Profile mock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: result.profile.profilePhoto ? 'linear-gradient(135deg, #6b7280, #4b5563)' : 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 800, color: 'rgba(226,232,240,0.4)',
            }}>
              {result.profile.name?.[0] || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(226,232,240,0.6)' }}>{result.profile.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.3)', marginTop: 2 }}>{result.profile.location}</div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(239,68,68,0.6)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Headline</div>
            <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.5)', lineHeight: 1.5, margin: 0 }}>{result.profile.headline || 'No headline set'}</p>
          </div>

          {/* About */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(239,68,68,0.6)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>About</div>
            <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.4)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>{currentAbout}</p>
          </div>

          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fca5a5' }}>{result.overallScore}</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(226,232,240,0.3)', textTransform: 'uppercase' }}>Current Score</div>
              <div style={{ fontSize: 11, color: '#fca5a5' }}>Needs improvement</div>
            </div>
          </div>
        </motion.div>

        {/* AFTER */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            padding: 24, borderRadius: 16,
            background: 'rgba(16,185,129,0.04)',
            border: '1px solid rgba(16,185,129,0.15)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Label */}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            padding: '4px 12px', borderRadius: 20,
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            fontSize: 10, fontWeight: 800, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: 1,
          }}>
            After
          </div>

          {/* Glow effect */}
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 120, height: 120,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1), transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Profile mock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: '2px solid rgba(16,185,129,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 800, color: 'white',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
            }}>
              {result.profile.name?.[0] || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{result.profile.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.5)', marginTop: 2 }}>{result.profile.location}</div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(16,185,129,0.7)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Optimized Headline</div>
            <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>{optimized.headline}</p>
          </div>

          {/* About */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(16,185,129,0.7)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Optimized About</div>
            <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.7)', lineHeight: 1.5, margin: 0 }}>{optimized.about}</p>
          </div>

          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
              style={{ fontSize: 24, fontWeight: 800, color: '#6ee7b7' }}
            >
              {optimized.score}
            </motion.div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(226,232,240,0.3)', textTransform: 'uppercase' }}>Projected Score</div>
              <div style={{ fontSize: 11, color: '#6ee7b7' }}>+{optimized.score - result.overallScore} points improvement</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Improvement summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          marginTop: 20, padding: 16, borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(10,102,194,0.08), rgba(139,92,246,0.08))',
          border: '1px solid rgba(10,102,194,0.15)',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 13, margin: 0 }}>
          Applying AI suggestions could improve your score by up to <strong style={{ color: '#6ee7b7' }}>+{optimized.score - result.overallScore} points</strong> and increase recruiter profile views by <strong style={{ color: '#70b5f9' }}>3.5x</strong>.
        </p>
      </motion.div>
    </div>
  );
}
