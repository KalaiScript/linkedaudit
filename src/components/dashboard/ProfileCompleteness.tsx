'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LinkedInProfile } from '@/types';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  impact: 'high' | 'medium' | 'low';
  tip: string;
}

export default function ProfileCompleteness({ profile }: { profile: LinkedInProfile }) {
  const checklist: ChecklistItem[] = useMemo(() => [
    { id: 'photo', label: 'Professional profile photo', completed: profile.profilePhoto, impact: 'high', tip: 'Profiles with photos get 21x more views' },
    { id: 'banner', label: 'Custom banner image', completed: profile.customBanner, impact: 'high', tip: 'Brand yourself with a relevant banner' },
    { id: 'headline', label: 'Headline longer than 60 characters', completed: profile.headline.length > 60, impact: 'high', tip: 'Use keywords and separators for max visibility' },
    { id: 'about', label: 'About section (200+ characters)', completed: (profile.about?.length || 0) > 200, impact: 'high', tip: 'Tell your story with achievements and skills' },
    { id: 'experience', label: 'At least 1 experience entry', completed: (profile.experience?.length || 0) >= 1, impact: 'high', tip: 'Add your roles with metrics and action verbs' },
    { id: 'skills5', label: '5+ skills listed', completed: (profile.skills?.length || 0) >= 5, impact: 'medium', tip: 'Top 3 skills should match your target role' },
    { id: 'skills10', label: '10+ skills listed', completed: (profile.skills?.length || 0) >= 10, impact: 'medium', tip: 'More skills = more search matches' },
    { id: 'customurl', label: 'Custom profile URL', completed: profile.customUrl, impact: 'medium', tip: 'Clean URLs look better on resumes and emails' },
    { id: 'creator', label: 'Creator mode enabled', completed: profile.creatorMode, impact: 'medium', tip: 'Unlock Follow button and content tools' },
    { id: 'connections', label: '500+ connections', completed: (profile.connections || 0) >= 500, impact: 'medium', tip: 'A strong network signals credibility' },
    { id: 'posts', label: 'Active poster (1+ per week)', completed: (profile.postsPerWeek || 0) >= 1, impact: 'low', tip: 'Consistent posting grows your visibility' },
    { id: 'contact', label: 'Contact info visible', completed: profile.contactInfo, impact: 'low', tip: 'Make it easy for recruiters to reach you' },
  ], [profile]);

  const completedCount = checklist.filter(c => c.completed).length;
  const totalCount = checklist.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <h3 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
        Profile Completeness
      </h3>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Progress Ring */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <svg width="130" height="130" viewBox="0 0 120 120" style={{ filter: `drop-shadow(0 0 12px ${getColor()}40)` }}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke={getColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="55" textAnchor="middle" fill={getColor()} fontSize="28" fontWeight="800">{percentage}%</text>
            <text x="60" y="72" textAnchor="middle" fill="rgba(226,232,240,0.4)" fontSize="10" fontWeight="600">{completedCount}/{totalCount} Done</text>
          </svg>
        </div>

        {/* Checklist */}
        <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {checklist.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 10,
                background: item.completed ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.03)',
                border: `1px solid ${item.completed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)'}`,
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                background: item.completed ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${item.completed ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#10b981',
              }}>
                {item.completed && '✓'}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: item.completed ? 'rgba(226,232,240,0.5)' : '#e2e8f0',
                  textDecoration: item.completed ? 'line-through' : 'none',
                }}>
                  {item.label}
                </span>
              </div>
              <span style={{
                padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                background: item.impact === 'high' ? 'rgba(239,68,68,0.1)' : item.impact === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                color: item.impact === 'high' ? '#fca5a5' : item.impact === 'medium' ? '#fcd34d' : '#93c5fd',
              }}>
                {item.impact}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
