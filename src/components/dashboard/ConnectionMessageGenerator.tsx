'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkedInProfile } from '@/types';
import { polishConnectionMessageAction } from '@/app/actions/ai-actions';

const contexts = [
  { id: 'recruiter', label: 'Recruiter', icon: '🎯', desc: 'Reaching out to a recruiter or hiring manager' },
  { id: 'mentor', label: 'Mentor', icon: '🧭', desc: 'Seeking guidance from a senior professional' },
  { id: 'peer', label: 'Peer', icon: '🤝', desc: 'Connecting with someone in a similar role' },
  { id: 'alumni', label: 'Alumni', icon: '🎓', desc: 'Reconnecting with a school or college contact' },
];

const templates: Record<string, string> = {
  recruiter: `Hi [Name],\n\nI came across the [Role] position at [Company] and I'm very interested. With my background in [SKILLS], I believe I can contribute meaningfully to your team.\n\nI'd love to connect and learn more about the opportunity.\n\nBest regards,\n[YOUR_NAME]`,
  mentor: `Hi [Name],\n\nI've been following your work in [INDUSTRY] and find your journey incredibly inspiring. As someone aspiring to grow as a [ROLE], I would be honored to connect and learn from your experience.\n\nThank you for considering!\n\n[YOUR_NAME]`,
  peer: `Hi [Name],\n\nI noticed we share a passion for [SKILLS]. I'm currently working as a [ROLE] and would love to connect, share insights, and learn from each other.\n\nLooking forward to connecting!\n\n[YOUR_NAME]`,
  alumni: `Hi [Name],\n\nI saw that you're also from [LOCATION]! It's great to see fellow alumni thriving in the [INDUSTRY] space. I'm currently exploring opportunities as a [ROLE] and would love to connect.\n\nCheers,\n[YOUR_NAME]`,
};

export default function ConnectionMessageGenerator({ profile }: { profile: LinkedInProfile }) {
  const [context, setContext] = useState('recruiter');
  const [targetName, setTargetName] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [message, setMessage] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const generateFromTemplate = () => {
    let tpl = templates[context] || templates.recruiter;
    tpl = tpl.replace(/\[Name\]/g, targetName || '[Name]');
    tpl = tpl.replace(/\[Company\]/g, targetCompany || '[Company]');
    tpl = tpl.replace(/\[Role\]/g, targetRole || profile.jobRoleTarget || '[Role]');
    tpl = tpl.replace(/\[ROLE\]/g, profile.jobRoleTarget || 'Professional');
    tpl = tpl.replace(/\[SKILLS\]/g, profile.skills?.slice(0, 3).join(', ') || 'my technical skills');
    tpl = tpl.replace(/\[INDUSTRY\]/g, profile.industry || 'Technology');
    tpl = tpl.replace(/\[LOCATION\]/g, profile.location || 'our university');
    tpl = tpl.replace(/\[YOUR_NAME\]/g, profile.name || 'Your Name');
    setMessage(tpl);
    setCharCount(tpl.length);
  };

  const handlePolish = async () => {
    if (!message.trim()) return;
    setIsPolishing(true);
    const result = await polishConnectionMessageAction(message, context, profile);
    if (result.success && result.content) {
      setMessage(result.content);
      setCharCount(result.content.length);
    }
    setIsPolishing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMessageChange = (val: string) => {
    setMessage(val);
    setCharCount(val.length);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 24, marginTop: 24 }}>
      <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
        Connection Message Generator
      </h3>
      <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, marginBottom: 20 }}>
        Craft the perfect connection request. Choose a context, fill in details, and let AI polish it.
      </p>

      {/* Context selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        {contexts.map(c => (
          <button key={c.id} onClick={() => setContext(c.id)}
            style={{
              padding: '12px', borderRadius: 12, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
              background: context === c.id ? 'rgba(10,102,194,0.15)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${context === c.id ? 'rgba(10,102,194,0.4)' : 'rgba(255,255,255,0.06)'}`,
            }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: context === c.id ? '#70b5f9' : '#e2e8f0' }}>{c.label}</div>
            <div style={{ fontSize: 10, color: 'rgba(226,232,240,0.3)', marginTop: 2 }}>{c.desc}</div>
          </button>
        ))}
      </div>

      {/* Input fields */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: 'rgba(226,232,240,0.5)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>Target Person</label>
          <input className="input-field" placeholder="John Doe" value={targetName} onChange={e => setTargetName(e.target.value)} style={{ padding: '10px 14px', fontSize: 13 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: 'rgba(226,232,240,0.5)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>Company</label>
          <input className="input-field" placeholder="Google" value={targetCompany} onChange={e => setTargetCompany(e.target.value)} style={{ padding: '10px 14px', fontSize: 13 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: 'rgba(226,232,240,0.5)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>Their Role</label>
          <input className="input-field" placeholder="Engineering Manager" value={targetRole} onChange={e => setTargetRole(e.target.value)} style={{ padding: '10px 14px', fontSize: 13 }} />
        </div>
      </div>

      {/* Generate button */}
      <button onClick={generateFromTemplate}
        style={{ width: '100%', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 16, background: 'rgba(10,102,194,0.1)', border: '1px solid rgba(10,102,194,0.25)', color: '#70b5f9' }}>
        Generate Message from Template
      </button>

      {/* Message editor */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={message}
          onChange={e => handleMessageChange(e.target.value)}
          placeholder="Your connection message will appear here..."
          style={{ width: '100%', height: 200, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(226,232,240,0.1)', padding: 16, borderRadius: 12, color: '#f1f5f9', fontSize: 14, lineHeight: 1.6, resize: 'none', outline: 'none', fontFamily: 'var(--font-sans)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: charCount > 300 ? '#fca5a5' : 'rgba(226,232,240,0.3)', fontWeight: 600 }}>
            {charCount}/300 characters {charCount > 300 && '(LinkedIn limit is 300)'}
          </span>
        </div>
        <AnimatePresence>
          {isPolishing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.5)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
              <div className="gradient-text" style={{ fontWeight: 700 }}>AI is polishing your message...</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        <button onClick={handlePolish} disabled={!message || isPolishing}
          className="glow-btn" style={{ flex: 1, padding: '12px', fontSize: 14, opacity: !message ? 0.5 : 1 }}>
          Polish with AI
        </button>
        <button onClick={handleCopy} disabled={!message}
          style={{ padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#6ee7b7' : '#e2e8f0' }}>
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
    </motion.div>
  );
}
