'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface SavedAudit {
  id: string;
  name: string;
  headline: string;
  role: string;
  overallScore: number;
  recruiterReadiness: number;
  personalBrandScore: number;
  atsScore: number;
  timestamp: number;
}

export default function HistoryPage() {
  const [audits, setAudits] = useState<SavedAudit[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0);
    const stored = localStorage.getItem('linkhive_audit_history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => setAudits(parsed), 0);
      } catch {}
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = audits.filter(a => a.id !== id);
    setAudits(updated);
    localStorage.setItem('linkhive_audit_history', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setAudits([]);
    localStorage.removeItem('linkhive_audit_history');
  };

  const chartData = useMemo(() => {
    const sorted = [...audits].sort((a, b) => a.timestamp - b.timestamp);
    return {
      labels: sorted.map(a => new Date(a.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Overall Score',
          data: sorted.map(a => a.overallScore),
          borderColor: '#0a66c2',
          backgroundColor: 'rgba(10, 102, 194, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#70b5f9',
          pointBorderColor: '#0a66c2',
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: 'Recruiter Readiness',
          data: sorted.map(a => a.recruiterReadiness),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6ee7b7',
          pointBorderColor: '#10b981',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'ATS Score',
          data: sorted.map(a => a.atsScore),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.05)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#c4b5fd',
          pointBorderColor: '#8b5cf6',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }, [audits]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: 'rgba(226,232,240,0.4)', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.03)' },
      },
      y: {
        min: 0,
        max: 100,
        ticks: { color: 'rgba(226,232,240,0.4)', font: { size: 11 }, stepSize: 20 },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(10,102,194,0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
  };

  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06060e', color: '#e2e8f0' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ fontSize: 48 }}>⚙</motion.div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', padding: '160px 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
                Audit <span className="gradient-text">History</span>
              </h1>
              <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 15 }}>
                Track your LinkedIn profile growth over time. {audits.length} audit{audits.length !== 1 ? 's' : ''} saved.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/audit" className="glow-btn" style={{ padding: '10px 24px', fontSize: 14, textDecoration: 'none' }}>
                New Audit
              </Link>
              {audits.length > 0 && (
                <button
                  onClick={handleClearAll}
                  style={{
                    padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#fca5a5', cursor: 'pointer',
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {audits.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: 60, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>📊</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>No Audits Yet</h2>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 16, marginBottom: 32 }}>
              Complete your first profile audit to start tracking your LinkedIn growth journey.
            </p>
            <Link href="/audit" className="glow-btn" style={{ padding: '14px 40px', fontSize: 16, textDecoration: 'none' }}>
              Start First Audit
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Score Trend Chart */}
            {audits.length >= 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
                <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
                  Score <span className="gradient-text">Progression</span>
                </h3>
                <div style={{ height: 300 }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
                <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Overall Score', color: '#0a66c2' },
                    { label: 'Recruiter Readiness', color: '#10b981' },
                    { label: 'ATS Score', color: '#8b5cf6' },
                  ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
                      <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: 12, fontWeight: 600 }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Audit Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <AnimatePresence>
                {[...audits].sort((a, b) => b.timestamp - a.timestamp).map((audit, i) => (
                  <motion.div
                    key={audit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card"
                    style={{
                      padding: 24,
                      cursor: 'pointer',
                      border: selectedAudit === audit.id ? '1px solid rgba(10,102,194,0.5)' : undefined,
                    }}
                    onClick={() => setSelectedAudit(selectedAudit === audit.id ? null : audit.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {/* Score badge */}
                        <div style={{
                          width: 56, height: 56, borderRadius: 14,
                          background: `linear-gradient(135deg, ${audit.overallScore >= 70 ? 'rgba(16,185,129,0.2)' : audit.overallScore >= 40 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}, transparent)`,
                          border: `1px solid ${audit.overallScore >= 70 ? 'rgba(16,185,129,0.3)' : audit.overallScore >= 40 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 20, fontWeight: 800,
                          color: audit.overallScore >= 70 ? '#6ee7b7' : audit.overallScore >= 40 ? '#fcd34d' : '#fca5a5',
                        }}>
                          {audit.overallScore}
                        </div>
                        <div>
                          <h4 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, margin: 0 }}>{audit.name}</h4>
                          <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13, margin: '4px 0 0' }}>
                            {audit.role} • {new Date(audit.timestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <MiniStat label="Recruiter" value={`${audit.recruiterReadiness}%`} color="#10b981" />
                          <MiniStat label="Brand" value={`${audit.personalBrandScore}`} color="#8b5cf6" />
                          <MiniStat label="ATS" value={`${audit.atsScore}%`} color="#06b6d4" />
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(audit.id); }}
                          style={{
                            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                            color: '#fca5a5', cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {selectedAudit === audit.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 13, marginBottom: 8 }}>
                            <strong style={{ color: 'rgba(226,232,240,0.7)' }}>Headline:</strong> {audit.headline}
                          </p>
                          <Link
                            href="/dashboard"
                            className="glow-btn"
                            style={{ padding: '8px 20px', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}
                          >
                            View Full Dashboard
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: 'rgba(226,232,240,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}
