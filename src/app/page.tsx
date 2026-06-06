'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const features = [
  { icon: '📊', title: 'AI Profile Scoring', desc: 'Get a comprehensive 0-100 score with section-wise breakdown and detailed analysis.' },
  { icon: '✍️', title: 'Content Rewriting', desc: 'AI rewrites your headline, about, and experience sections for maximum impact.' },
  { icon: '🎯', title: 'Recruiter Readiness', desc: 'Simulates how recruiters evaluate your profile with actionable feedback.' },
  { icon: '🔍', title: 'SEO Optimization', desc: 'Keyword analysis and search discoverability scoring for your industry.' },
  { icon: '📑', title: 'ATS Resume Scanner', desc: 'Check if your LinkedIn profile data is optimized for Applicant Tracking Systems.' },
  { icon: '🚀', title: 'AI Growth Hacks', desc: 'Get personalized daily action plans to grow your LinkedIn followers and engagement.' },
  { icon: '🤝', title: 'Network Analysis', desc: 'Evaluate the quality of your connections and get strategic networking advice.' },
  { icon: '🔥', title: 'Roast Mode', desc: 'Get brutally honest (and funny) feedback about your profile weaknesses.' },
];

const steps = [
  { num: '01', title: 'Enter Your Profile', desc: 'Provide your headline, about section, and career goals directly in our secure auditor.' },
  { num: '02', title: 'AI Analyzes Everything', desc: 'Our AI engine evaluates every section — photo impact, headline strength, about storytelling, and more.' },
  { num: '03', title: 'Get Your Audit Report', desc: 'Receive scores, suggestions, AI rewrites, and a personalized 7-day action plan.' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function LandingPage() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 'clamp(140px, 15vh, 180px) 24px 80px', 
        textAlign: 'center', 
        position: 'relative' 
      }}>
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: 'min(400px, 80vw)', height: 'min(400px, 80vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,102,194,0.15), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 'min(350px, 70vw)', height: 'min(350px, 70vw)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,65,130,0.12), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }} style={{ maxWidth: 800, position: 'relative', zIndex: 1, width: '100%' }}>
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <span style={{ 
              padding: '8px 20px', 
              borderRadius: 100, 
              background: 'rgba(10,102,194,0.12)', 
              border: '1px solid rgba(10,102,194,0.25)', 
              color: 'var(--accent-blue-light)', 
              fontSize: 'clamp(10px, 3vw, 13px)', 
              fontWeight: 600, 
              letterSpacing: 0.5,
              maxWidth: '100%',
              textAlign: 'center'
            }}>
              LinkHive: The Future of LinkedIn Growth
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontSize: 'clamp(32px, 8vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: '#f1f5f9' }}>
            Dominate LinkedIn<br />With <span className="gradient-text">AI Power</span>
          </motion.h1>

          <motion.p variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontSize: 'clamp(15px, 3.5vw, 20px)', color: 'rgba(226,232,240,0.5)', lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Generate viral posts, optimize your profile, and build a massive personal brand with LinkHive&apos;s suite of AI tools.
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

      {/* FEATURED CREATOR */}
      <section style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}
          className="glass-card" style={{ padding: '40px', display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <div style={{ position: 'relative' }}>
            <img src="/profile.png" alt="Kalaiyarasan" style={{ width: 180, height: 180, borderRadius: 20, objectFit: 'cover', border: '2px solid var(--accent-blue)' }} />
            <div style={{ position: 'absolute', bottom: -10, right: -10, background: 'var(--accent-blue)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Creator</div>
          </div>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Build Your <span className="gradient-text">Personal Brand</span></h2>
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>
              &quot;I built LinkHive to help professionals like you leverage AI for career growth. Your LinkedIn profile is your digital CV—let&apos;s make it stand out.&quot;
            </p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <a href="https://www.linkedin.com/in/kalaiscript/" target="_blank" rel="noopener noreferrer" className="glow-btn" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: 15 }}>
                Connect with Kalai
              </a>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ padding: '8px', borderRadius: 8, background: 'rgba(10,102,194,0.1)', color: 'var(--accent-blue-light)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </div>
              </div>
            </div>
          </div>
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
