'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const features = [
  { icon: '', title: 'AI Profile Scoring', desc: 'Get a comprehensive 0-100 score with section-wise breakdown and detailed analysis.' },
  { icon: '', title: 'Content Rewriting', desc: 'AI rewrites your headline, about, and experience sections for maximum impact.' },
  { icon: '', title: 'Recruiter Readiness', desc: 'Simulates how recruiters evaluate your profile with actionable feedback.' },
  { icon: '', title: 'SEO Optimization', desc: 'Keyword analysis and search discoverability scoring for your industry.' },
  { icon: '', title: 'ATS Resume Scanner', desc: 'Check if your LinkedIn profile data is optimized for Applicant Tracking Systems.' },
  { icon: '', title: 'AI Growth Hacks', desc: 'Get personalized daily action plans to grow your LinkedIn followers and engagement.' },
  { icon: '', title: 'Network Analysis', desc: 'Evaluate the quality of your connections and get strategic networking advice.' },
  { icon: '', title: 'Roast Mode', desc: 'Get brutally honest (and funny) feedback about your profile weaknesses.' },
];

const steps = [
  { num: '01', title: 'Enter Your Profile', desc: 'Provide your headline, about section, and career goals directly in our secure auditor.' },
  { num: '02', title: 'AI Analyzes Everything', desc: 'Our AI engine evaluates every section  photo impact, headline strength, about storytelling, and more.' },
  { num: '03', title: 'Get Your Audit Report', desc: 'Receive scores, suggestions, AI rewrites, and a personalized 7-day action plan.' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', position: 'relative' }}>
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,102,194,0.15), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,65,130,0.12), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }} style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <span style={{ 
              padding: '8px 20px', 
              borderRadius: 100, 
              background: 'rgba(10,102,194,0.12)', 
              border: '1px solid rgba(10,102,194,0.25)', 
              color: 'var(--accent-blue-light)', 
              fontSize: 'clamp(11px, 3vw, 13px)', 
              fontWeight: 600, 
              letterSpacing: 0.5,
              maxWidth: '90vw',
              textAlign: 'center'
            }}>
              LinkedAudit: The Future of LinkedIn Growth
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: '#f1f5f9' }}>
            Dominate LinkedIn<br />With <span className="gradient-text">AI Power</span>
          </motion.h1>

          <motion.p variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(226,232,240,0.5)', lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Generate viral posts, optimize your profile, and build a massive personal brand with LinkedAudit&apos;s suite of AI tools.
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/audit" className="glow-btn" style={{ padding: '16px clamp(24px, 5vw, 48px)', fontSize: 17, textDecoration: 'none' }}>
              Free Profile Audit
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 5vw, 48px)', marginTop: 60, flexWrap: 'wrap' }}>
            {[
              { val: '10K+', label: 'Profiles Analyzed' },
              { val: '95%', label: 'User Satisfaction' },
              { val: '3x', label: 'More Recruiter Views' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center', minWidth: '120px' }}>
                <div className="gradient-text" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800 }}>{s.val}</div>
                <div style={{ color: 'rgba(226,232,240,0.4)', fontSize: 'clamp(11px, 2.5vw, 13px)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16, color: '#f1f5f9' }}>
              Everything You Need to <span className="gradient-text">Stand Out</span>
            </h2>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
              A complete toolkit to optimize every aspect of your LinkedIn presence.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }} className="glass-card" style={{ padding: 32 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 15, lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16, color: '#f1f5f9' }}>
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }} className="responsive-flex" style={{ display: 'flex', gap: 24, marginBottom: 40, alignItems: 'flex-start' }}>
              <div style={{
                minWidth: 56, height: 56, borderRadius: 14,
                background: 'rgba(10, 102, 194, 0.1)',
                border: '1px solid rgba(10, 102, 194, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 800, color: 'var(--accent-blue-light)',
              }}>
                {step.num}
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{step.title}</h3>
                <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 15, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}
          className="gradient-border" style={{ maxWidth: 700, margin: '0 auto', padding: 'clamp(32px, 8vw, 60px)' }}
        >
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>
            Ready to Level Up Your LinkedIn?
          </h2>
          <p style={{ color: 'rgba(226,232,240,0.5)', marginBottom: 32, fontSize: 16 }}>
            Join thousands of professionals who have transformed their LinkedIn profiles with AI.
          </p>
          <Link href="/audit" className="glow-btn" style={{ padding: '16px clamp(24px, 5vw, 48px)', fontSize: 17, textDecoration: 'none' }}>
            Free Profile Audit
          </Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
