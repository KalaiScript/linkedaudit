'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateHeadlines, generateAboutSections, generateExperienceRewrites, generatePosts } from '@/lib/content-generator';
import { LinkedInProfile } from '@/types';
import Link from 'next/link';

interface ContentGeneratorPanelProps {
  profile: LinkedInProfile;
}

const tabs = ['Headlines', 'About Section', 'Experience', 'Posts'];

export default function ContentGeneratorPanel({ profile }: ContentGeneratorPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const headlines = generateHeadlines(profile.jobRoleTarget, profile.skills, profile.experienceLevel);
  const abouts = generateAboutSections(profile.jobRoleTarget, profile.skills, profile.experienceLevel, profile.industry);
  const expRewrites = profile.experience.length > 0
    ? generateExperienceRewrites(profile.experience[0].title, profile.experience[0].company, profile.experience[0].description, profile.skills)
    : [];
  const posts = generatePosts(profile.jobRoleTarget, profile.skills);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const items = [headlines, abouts, expRewrites, posts];

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map((tab, i) => (
          <button key={tab} className={`tab-btn ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>✨ New: AI Carousel Generator</h3>
          <p style={{ color: 'rgba(226,232,240,0.7)', fontSize: 14 }}>Turn your ideas into visually stunning LinkedIn carousels and export to PDF.</p>
        </div>
        <Link href="/carousel" className="glow-btn" style={{ padding: '10px 20px', fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Open Carousel Maker →
        </Link>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items[activeTab].map((item, i) => (
          <motion.div
            key={`${activeTab}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="glass-card"
            style={{ padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{
                padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: 'rgba(139,92,246,0.12)', color: '#c4b5fd',
              }}>
                {item.style}
              </span>
              <button
                onClick={() => handleCopy(item.content, `${activeTab}-${i}`)}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: copied === `${activeTab}-${i}` ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.12)',
                  border: '1px solid ' + (copied === `${activeTab}-${i}` ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.2)'),
                  color: copied === `${activeTab}-${i}` ? '#6ee7b7' : '#a5b4fc', cursor: 'pointer',
                }}
              >
                {copied === `${activeTab}-${i}` ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <p style={{ color: 'rgba(226,232,240,0.8)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {item.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
