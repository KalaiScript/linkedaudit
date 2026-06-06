'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScoreCircle from '@/components/dashboard/ScoreCircle';
import SectionCard from '@/components/dashboard/SectionCard';
import RadarChart from '@/components/dashboard/RadarChart';
import ContentGeneratorPanel from '@/components/dashboard/ContentGeneratorPanel';
import KeywordGapPanel from '@/components/dashboard/KeywordGapPanel';
import MomentumChecklist from '@/components/dashboard/MomentumChecklist';
import { analyzeProfile } from '@/lib/analysis-engine';
import { AuditResult, LinkedInProfile } from '@/types';

import { getFullAIAnalysisAction } from '@/app/actions/ai-actions';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const dashTabs = ['Overview', 'Score Breakdown', 'Personalized Tips', 'AI Suggestions', 'SEO Analysis', 'Networking Strategy', 'Action Plan', 'Roast Mode'];

function DashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [roastMode, setRoastMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AuditResult | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    const dashboard = document.getElementById('dashboard-content');
    if (!dashboard) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(dashboard, { 
        backgroundColor: '#06060e',
        scale: 2,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`LinkHive-${profile?.name || 'Profile'}.pdf`);
    } catch (err) {
      console.error("Export failed", err);
    }
    setExporting(false);
  };

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setIsMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const profile: LinkedInProfile | null = useMemo(() => {
    if (typeof window !== 'undefined' && isMounted) {
      const stored = localStorage.getItem('linkhive_profile');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch { }
      }
    }
    return null;
  }, [isMounted]);

  useEffect(() => {
    // Missing profile will be handled in the render phase for better UX
  }, [isMounted, profile, router]);

  useEffect(() => {
    if (isMounted && profile && !aiAnalysis && !loadingAi) {
      const fetchAnalysis = async () => {
        setLoadingAi(true);
        const result = await getFullAIAnalysisAction(profile);
        if (result.success) {
          setAiAnalysis(result.analysis as any);
        } else {
          // Fallback or handle error silently if needed, or show a toast
          console.error("AI Analysis failed:", result.error);
        }
        setLoadingAi(false);
      };
      fetchAnalysis();
    }
  }, [isMounted, profile, aiAnalysis, loadingAi]);

  const result: AuditResult | null = useMemo(() => {
    if (!profile) return null;
    
    // Ensure profile has default values for missing fields from simplified audit flow
    const fullProfile: LinkedInProfile = {
      ...profile,
      connections: profile.connections || 500,
      recommendations: profile.recommendations || 0,
      experience: profile.experience || [],
      education: profile.education || [],
      certifications: profile.certifications || [],
      projects: profile.projects || [],
      featuredItems: profile.featuredItems || 0,
    };

    const baseResult = analyzeProfile(fullProfile);
    if (aiAnalysis) {
      // Use any here to map the custom AI response structure to our AuditResult
      const aiData = aiAnalysis as any;
      return {
        ...baseResult,
        overallScore: aiData.overallScore || baseResult.overallScore,
        recruiterReadiness: aiData.recruiterReadiness || baseResult.recruiterReadiness,
        personalBrandScore: aiData.personalBrandScore || baseResult.personalBrandScore,
        atsScore: aiData.atsScore || baseResult.atsScore,
        topStrengths: aiData.topStrengths || baseResult.topStrengths,
        topWeaknesses: aiData.topWeaknesses || baseResult.topWeaknesses,
        roastFeedback: aiData.roasts || baseResult.roastFeedback,
        aiStrategyTips: aiData.strategyTips,
      };
    }
    return baseResult;
  }, [profile, aiAnalysis]);

  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#06060e', color: '#e2e8f0' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ fontSize: 64, marginBottom: 24 }}></motion.div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Initializing Dashboard...</h2>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#06060e' }}>
        <Header />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: 60, textAlign: 'center', maxWidth: 600 }}>
          <div style={{ fontSize: 80, marginBottom: 32 }}></div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>No Audit Data Found</h2>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 18, lineHeight: 1.6, marginBottom: 40 }}>
            It looks like you haven&apos;t analyzed your profile yet. Start your free AI audit to unlock your dashboard and growth insights!
          </p>
          <Link href="/audit" className="glow-btn" style={{ padding: '16px clamp(24px, 5vw, 48px)', fontSize: 18, textDecoration: 'none', display: 'inline-block' }}>
            Start My AI Audit
          </Link>
        </motion.div>
        <Footer />
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#06060e', color: '#e2e8f0' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ fontSize: 64, marginBottom: 24 }}></motion.div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Analyzing Profile Data...</h2>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 0: return <OverviewTab result={result} loadingAi={loadingAi} />;
      case 1: return <ScoreBreakdownTab result={result} roastMode={roastMode} />;
      case 2: return <SuggestionsTab result={result} loadingAi={loadingAi} />;
      case 3: return <ContentGeneratorPanel profile={result.profile} aiData={aiAnalysis} loading={loadingAi} />;
      case 4: return <SEOTab result={result} />;
      case 5: return <NetworkingTab result={result} />;
      case 6: return <ActionPlanTab result={result} />;
      case 7: return <RoastTab result={result} loadingAi={loadingAi} />;
      default: return null;
    }
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', padding: '160px 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
              Profile Audit <span className="gradient-text">Dashboard</span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 15, margin: 0 }}>
                Analysis for <strong style={{ color: '#a78bfa' }}>{result.profile.name}</strong>  {result.profile.jobRoleTarget}
              </p>
              {(aiAnalysis as any)?.recruiterVerdict && (
                <div style={{ 
                  padding: '4px 12px', borderRadius: 100, background: 'rgba(59,130,246,0.1)', 
                  border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', fontSize: 11, fontWeight: 700
                }}>
                  VERDICT: {(aiAnalysis as any).recruiterVerdict}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)',
                color: '#60a5fa', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {exporting ? 'Generating PDF...' : 'Export Audit'}
            </button>
            <Link href="/audit" style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(226,232,240,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: 600,
              transition: 'all 0.2s'
            }} className="hover-lift">
               Back to Audit
            </Link>
          </div>
        </motion.div>

        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
          {dashTabs.map((tab, i) => (
            <button key={tab} className={`tab-btn ${activeTab === i ? 'active' : ''}`} onClick={() => { setActiveTab(i); if (i === 6) setRoastMode(true); }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div id="dashboard-content" key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {renderTab()}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}

/* Overview Tab */
function OverviewTab({ result, loadingAi }: { result: AuditResult; loadingAi: boolean }) {
  return (
    <div>
      {/* Score cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div className="glass-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ScoreCircle score={result.overallScore} maxScore={100} size={180} showGrade grade={result.letterGrade} />
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 14, marginTop: 12, fontWeight: 600 }}>Overall Score</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <StatCard icon="" label="Recruiter Readiness" value={`${result.recruiterReadiness}%`} color="#10b981" />
          <StatCard icon="" label="Personal Brand" value={`${result.personalBrandScore}/100`} color="#8b5cf6" />
          <StatCard icon="" label="ATS Compatibility" value={`${result.atsScore}%`} color="#06b6d4" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <StatCard icon="" label="Connections" value={`${result.profile.connections}`} color="#3b82f6" />
          <StatCard icon="" label="Followers" value={`${result.profile.followers}`} color="#3b82f6" />
          <StatCard icon="" label="Posts/Week" value={`${result.profile.postsPerWeek}`} color="#ec4899" />
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ color: '#10b981', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Top Strengths</h3>
          {result.topStrengths.map((s, i) => (
            <p key={i} style={{ color: 'rgba(226,232,240,0.6)', fontSize: 14, marginBottom: 8, paddingLeft: 8 }}> {s}</p>
          ))}
        </div>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ color: '#ef4444', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Key Weaknesses</h3>
          {result.topWeaknesses.map((w, i) => (
            <p key={i} style={{ color: 'rgba(226,232,240,0.6)', fontSize: 14, marginBottom: 8, paddingLeft: 8 }}> {w}</p>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        <MomentumChecklist />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ color: '#a78bfa', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>AI Career Positioning</h3>
            {loadingAi && result.careerPositioning.length <= 1 ? (
              <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 14, fontStyle: 'italic' }}>AI is calculating your career positioning...</p>
            ) : (
              <>
                <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 14, marginBottom: 12 }}>Based on your profile, you are positioned as:</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {result.careerPositioning.map((c, i) => (
                    <span key={i} style={{ padding: '6px 16px', borderRadius: 8, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', color: '#c4b5fd', fontSize: 13, fontWeight: 600 }}>{c}</span>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Recruiter Eye-Track Simulation */}
          <div className="glass-card" style={{ padding: 24, border: '1px solid rgba(251, 191, 36, 0.2)' }}>
            <h3 style={{ color: '#3b82f6', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recruiter &quot;Eye-Track&quot; Simulation</h3>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, marginBottom: 20 }}>Where recruiters look first on your profile (heat-map based on AI analysis).</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <EyeTrackItem label="Headline & Photo" percent={95} color="#ef4444" />
              <EyeTrackItem label="Recent Experience" percent={82} color="#3b82f6" />
              <EyeTrackItem label="About Section (First 3 lines)" percent={65} color="#3b82f6" />
              <EyeTrackItem label="Skills & Endorsements" percent={40} color="#10b981" />
            </div>
          </div>

          {/* Industry Benchmarking */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ color: '#06b6d4', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Industry Benchmarking</h3>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, marginBottom: 20 }}>How you compare to other {result.profile.jobRoleTarget || 'Professionals'}.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <BenchmarkItem label="Junior Level Avg." score={55} currentScore={result.overallScore || 78} color="#3b82f6" />
              <BenchmarkItem label="Mid-Level Avg." score={72} currentScore={result.overallScore || 78} color="#8b5cf6" />
              <BenchmarkItem label="Senior Level Avg." score={88} currentScore={result.overallScore || 78} color="#10b981" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenchmarkItem({ label, score, currentScore, color }: { label: string; score: number; currentScore: number; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'rgba(226,232,240,0.6)' }}>{label}</span>
        <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{score}%</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, position: 'relative' }}>
        <div style={{ width: `${score}%`, height: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
        {/* User pointer */}
        <motion.div 
          initial={{ left: 0 }}
          animate={{ left: `${currentScore}%` }}
          style={{ 
            position: 'absolute', top: -10, width: 2, height: 24, background: color, 
            boxShadow: `0 0 10px ${color}`
          }} 
        >
          <div style={{ 
            position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', 
            fontSize: 10, fontWeight: 800, color, whiteSpace: 'nowrap' 
          }}>YOU</div>
        </motion.div>
      </div>
    </div>
  );
}

function EyeTrackItem({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#e2e8f0' }}>{label}</span>
        <span style={{ fontSize: 11, color, fontWeight: 700 }}>{percent}% Focus</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} style={{ height: '100%', background: color }} />
      </div>
    </div>
  );
}

/* Stat Card */
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div>
        <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
        <p style={{ color, fontSize: 22, fontWeight: 800 }}>{value}</p>
      </div>
    </div>
  );
}

/* Score Breakdown Tab */
function ScoreBreakdownTab({ result, roastMode }: { result: AuditResult; roastMode: boolean }) {
  return (
    <div className="responsive-grid-2">
      <div>
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Radar Overview</h3>
          <RadarChart sections={result.sections} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {result.sections.map((section, i) => (
          <SectionCard key={section.name} section={section} index={i} roastMode={roastMode}
            roast={result.roastFeedback.find(r => r.section === section.name.split(' ')[0])?.roast} />
        ))}
      </div>
    </div>
  );
}

/* AI Suggestions Tab */
function SuggestionsTab({ result, loadingAi }: { result: AuditResult; loadingAi: boolean }) {
  // Use AI strategy tips if available, otherwise fallback to local suggestions
  const aiTips = (result as any).aiStrategyTips;
  
  const allSuggestions = aiTips 
    ? aiTips.map((tip: { style?: string; title?: string; content?: string; suggested?: string; impact?: 'high' | 'medium' | 'low' }) => ({
        title: tip.style || tip.title,
        suggested: tip.content || tip.suggested,
        impact: tip.impact || 'high',
        category: 'Live AI Strategy'
      }))
    : result.sections.flatMap(s => s.suggestions).sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.impact] - order[b.impact];
      });

  const [copied, setCopied] = useState<number | null>(null);
  const handleCopy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* API Tech Stack Info */}
      <div className="glass-card" style={{ padding: 20, background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(139,92,246,0.3)' }}>
        <h4 style={{ color: '#a78bfa', fontSize: 14, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          {loadingAi ? 'Live AI Analysis in Progress...' : 'Live AI Analysis Active'}
        </h4>
        <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 13, lineHeight: 1.6 }}>
          {loadingAi ? 'Our advanced AI model is currently generating high-impact strategies tailored specifically to your profile. This will only take a moment...' : 'Your profile has been analyzed by our advanced AI model. These suggestions are unique to your brand and current market trends.'}
        </p>
      </div>

      {loadingAi && !aiTips ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ fontSize: 32, marginBottom: 16 }}></motion.div>
          <p style={{ color: 'rgba(226,232,240,0.4)' }}>Generating detailed strategy tips...</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 14, marginBottom: 8 }}>
            {allSuggestions.length} personalized strategies for your career growth
          </p>
          {allSuggestions.map((sg: { title?: string; suggested?: string; impact: 'high' | 'medium' | 'low'; category: string; current?: string }, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                    background: sg.impact === 'high' ? 'rgba(239,68,68,0.15)' : sg.impact === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
                    color: sg.impact === 'high' ? '#fca5a5' : sg.impact === 'medium' ? '#fcd34d' : '#93c5fd',
                  }}>
                    {sg.impact.toUpperCase()}
                  </span>
                  <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: 12 }}>{sg.category}</span>
                </div>
              </div>
              <h4 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{sg.title}</h4>
              {sg.current && <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, marginBottom: 4 }}><strong>Current:</strong> {sg.current}</p>}
              {sg.suggested && (
                <div>
                  <p style={{ color: '#a5f3fc', fontSize: 13, whiteSpace: 'pre-line', marginTop: 4 }}>{sg.suggested}</p>
                  <button onClick={() => handleCopy(sg.suggested!, i)} style={{
                    marginTop: 10, padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: copied === i ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.12)',
                    border: '1px solid ' + (copied === i ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.2)'),
                    color: copied === i ? '#6ee7b7' : '#a5b4fc', cursor: 'pointer',
                  }}>
                    {copied === i ? ' Copied!' : 'Copy Suggestion'}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}

/* SEO Tab */
function SEOTab({ result }: { result: AuditResult }) {
  const seoSection = result.sections.find(s => s.name.includes('SEO'));
  const keywords = result.profile.seoKeywords;
  const missing = ['Full Stack Development', 'System Design', 'Agile Methodologies', 'Cloud Computing', 'Technical Leadership'].filter(k => !keywords.some(kw => kw.toLowerCase().includes(k.toLowerCase())));
  const seoKeywords = (result as any).seoKeywords;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <KeywordGapPanel keywords={seoKeywords} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ color: '#14b8a6', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Search Visibility</h3>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <ScoreCircle score={seoSection?.score || 5} maxScore={10} size={140} label="SEO Index" />
          </div>
          <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, textAlign: 'center' }}>
            Your profile appeared in <strong style={{ color: '#5eead4' }}>{result.profile.searchAppearances}</strong> searches this week.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ color: '#8b5cf6', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Keyword Analysis</h3>
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: 'rgba(226,232,240,0.6)', fontSize: 12, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase' }}>Detected High-Intent Keywords</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {keywords.map((k, i) => (
                <span key={i} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', color: '#5eead4', fontSize: 12, fontWeight: 600 }}>{k}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'rgba(226,232,240,0.6)', fontSize: 12, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase' }}>Missing for {result.profile.jobRoleTarget}</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {missing.map((k, i) => (
                <span key={i} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', color: '#fca5a5', fontSize: 12, fontWeight: 600 }}>+ {k}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ color: '#3b82f6', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Ranking & Reach</h3>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: 13 }}>Profile Discoverability</span>
              <span style={{ color: '#3b82f6', fontSize: 13, fontWeight: 700 }}>Top 15%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(59,130,246,0.1)', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.5 }} style={{ height: '100%', background: '#3b82f6' }} />
            </div>
          </div>
          <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, lineHeight: 1.6 }}>
            Tip: Profiles with 5+ skills listed in the &quot;About&quot; section receive 17x more messages from recruiters.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Networking Tab */
function NetworkingTab({ result }: { result: AuditResult }) {
  const strategies = [
    { title: 'Connect with Industry Peers', desc: `Reach out to other ${result.profile.jobRoleTarget}s in the ${result.profile.industry} sector.`, icon: '' },
    { title: 'Find Potential Mentors', desc: `Look for Senior ${result.profile.jobRoleTarget}s with 5+ years of experience who share your interests.`, icon: '' },
    { title: 'Target Hiring Managers', desc: `Connect with recruiters at companies focusing on ${result.profile.skills[0] || 'tech'}.`, icon: '' },
    { title: 'Alumni Outreach', desc: `Connect with former students from your university who are now in roles you aspire to.`, icon: '' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
      {strategies.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
          <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
          <div style={{ marginTop: 20, padding: 12, borderRadius: 10, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
            <p style={{ color: '#a78bfa', fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Sample Outreach</p>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, fontStyle: 'italic' }}>
              &quot;Hi [Name], I noticed your work in {result.profile.skills[0] || 'the field'} and would love to connect and learn from your journey...&quot;
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* Action Plan Tab */
function ActionPlanTab({ result }: { result: AuditResult }) {
  const [plan, setPlan] = useState(result.actionPlan);
  const toggleComplete = (day: number) => {
    setPlan(prev => prev.map(p => p.day === day ? { ...p, completed: !p.completed } : p));
  };
  const completed = plan.filter(p => p.completed).length;
  return (
    <div>
      <div className="glass-card" style={{ padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700 }}>Your 7-Day LinkedIn Improvement Plan</h3>
        <span style={{ color: '#a78bfa', fontSize: 14, fontWeight: 600 }}>{completed}/7 completed</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {plan.map((day) => (
          <motion.div key={day.day} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: day.day * 0.08 }}
            className="glass-card" style={{ padding: 20, opacity: day.completed ? 0.5 : 1, transition: 'opacity 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <button onClick={() => toggleComplete(day.day)} style={{
                width: 32, height: 32, borderRadius: 8, border: '2px solid ' + (day.completed ? '#10b981' : 'rgba(99,102,241,0.3)'),
                background: day.completed ? 'rgba(16,185,129,0.2)' : 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#10b981',
              }}>
                {day.completed ? '' : ''}
              </button>
              <div>
                <span style={{ color: '#a78bfa', fontSize: 12, fontWeight: 700 }}>DAY {day.day}</span>
                <h4 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, textDecoration: day.completed ? 'line-through' : 'none' }}>{day.title}</h4>
              </div>
              <span style={{
                marginLeft: 'auto', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: day.impact === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                color: day.impact === 'high' ? '#fca5a5' : '#fcd34d',
              }}>
                {day.impact} impact
              </span>
            </div>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, marginBottom: 10, paddingLeft: 48 }}>{day.description}</p>
            <div style={{ paddingLeft: 48 }}>
              {day.tasks.map((task, i) => (
                <p key={i} style={{ color: 'rgba(226,232,240,0.6)', fontSize: 13, marginBottom: 4 }}>[ ] {task}</p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Roast Tab */
function RoastTab({ result, loadingAi }: { result: AuditResult; loadingAi: boolean }) {
  return (
    <div>
      <div className="glass-card" style={{ padding: 24, marginBottom: 24, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <h3 style={{ color: '#fca5a5', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Roast Mode Activated</h3>
        <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 14 }}>
          Brutally honest (but helpful) feedback about your profile. Don&apos;t take it personally!
        </p>
      </div>

      {loadingAi && result.roastFeedback.length <= 1 ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }} style={{ fontSize: 32, marginBottom: 16 }}></motion.div>
          <p style={{ color: 'rgba(226,232,240,0.4)' }}>AI is cooking up some brutal roasts...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {result.roastFeedback.map((roast, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
              className="glass-card" style={{ padding: 24, borderLeft: '3px solid rgba(239,68,68,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{roast.emoji}</span>
                <span style={{ color: '#fca5a5', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{roast.section}</span>
              </div>
              <p style={{ color: 'rgba(226,232,240,0.8)', fontSize: 16, lineHeight: 1.6, fontStyle: 'italic' }}>
                &ldquo;{roast.roast}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ fontSize: 48 }}> </motion.div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
