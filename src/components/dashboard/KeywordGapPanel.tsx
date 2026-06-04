'use client';
import { motion } from 'framer-motion';

interface SEOKeyword {
  keyword: string;
  importance: 'high' | 'medium';
  reason: string;
}

interface KeywordGapPanelProps {
  keywords?: SEOKeyword[];
}

export default function KeywordGapPanel({ keywords = [] }: KeywordGapPanelProps) {
  if (keywords.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 24 }}></span>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>LinkedIn SEO Keyword Gap</h3>
          <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13 }}>Missing keywords recruiters search for in your role.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {keywords.map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid ' + (k.importance === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'),
              flex: '1 1 calc(50% - 12px)',
              minWidth: 200
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{k.keyword}</span>
              <span style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '2px 6px',
                borderRadius: 4,
                background: k.importance === 'high' ? '#ef4444' : '#3b82f6',
                color: '#fff'
              }}>
                {k.importance}
              </span>
            </div>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 12, lineHeight: 1.4 }}>{k.reason}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
