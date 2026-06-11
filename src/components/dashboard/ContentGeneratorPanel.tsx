'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LinkedInProfile, AIAnalysisResponse, ContentRewrite } from '@/types';
import { generateHeadlines, generateAboutSections, generateExperienceRewrites, generatePosts } from '@/lib/content-generator';

interface ContentGeneratorPanelProps {
  profile: LinkedInProfile;
  aiData?: AIAnalysisResponse | null;
  loading?: boolean;
}

const tabs = ['Headlines', 'About Section', 'Experience', 'Posts'];

export default function ContentGeneratorPanel({ profile, aiData, loading }: ContentGeneratorPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const headlines = useMemo(() => {
    if (aiData?.headlines && aiData.headlines.length > 0) return aiData.headlines;
    return generateHeadlines(profile.jobRoleTarget, profile.skills, profile.experienceLevel);
  }, [aiData, profile]);

  const abouts = useMemo(() => {
    if (aiData?.abouts && aiData.abouts.length > 0) return aiData.abouts;
    return generateAboutSections(profile.jobRoleTarget, profile.skills, profile.experienceLevel, profile.industry);
  }, [aiData, profile]);

  const expRewrites = useMemo(() => {
    if (aiData?.experienceRewrites && aiData.experienceRewrites.length > 0) return aiData.experienceRewrites;
    const lastExp = profile.experience[0];
    return generateExperienceRewrites(lastExp?.title || profile.jobRoleTarget, lastExp?.company || 'Company', lastExp?.description || '', profile.skills);
  }, [aiData, profile]);

  const posts = useMemo(() => {
    if (aiData?.posts && aiData.posts.length > 0) return aiData.posts;
    return generatePosts(profile.jobRoleTarget, profile.skills);
  }, [aiData, profile]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentItems = [headlines, abouts, expRewrites, posts][activeTab] || [];

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

      <div className="glass-card" style={{ padding: 24, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'linear-gradient(to right, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Profile Rewrite Suggestions</h3>
          <p style={{ color: 'rgba(226,232,240,0.7)', fontSize: 14 }}>
            {loading ? 'AI is crafting high-impact copy for your profile...' : (aiData ? 'Optimized content for your LinkedIn sections based on your target role and current profile.' : 'Template-based suggestions to optimize your LinkedIn sections.')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading && (!aiData || currentItems.length === 0) ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ fontSize: 48, marginBottom: 20 }}>📝</motion.div>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 16 }}>AI is writing your {tabs[activeTab]}...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
             <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 15 }}>No suggestions generated for this section yet.</p>
             <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: 13, marginTop: 8 }}>Try adding more details to your profile to get better results.</p>
          </div>
        ) : (
          currentItems.map((item, i) => {
            const rewriteItem = item as ContentRewrite;
            const itemStyle = rewriteItem.style || 'Suggested';
            const itemContent = rewriteItem.content || '';
            return (
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
                    {itemStyle}
                  </span>
                  <button
                    onClick={() => handleCopy(itemContent, `${activeTab}-${i}`)}
                    style={{
                      padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: copied === `${activeTab}-${i}` ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.12)',
                      border: '1px solid ' + (copied === `${activeTab}-${i}` ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.2)'),
                      color: copied === `${activeTab}-${i}` ? '#6ee7b7' : '#a5b4fc', cursor: 'pointer',
                    }}
                  >
                    {copied === `${activeTab}-${i}` ? ' Copied!' : 'Copy'}
                  </button>
                </div>
                <p style={{ color: 'rgba(226,232,240,0.8)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {itemContent}
                </p>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

