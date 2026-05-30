'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Get started with basic profile analysis',
    color: '#3b82f6',
    features: [
      'Basic profile score',
      '3 section analyses',
      'Limited AI suggestions',
      '1 headline generation',
      'Community support',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    desc: 'Full AI-powered profile optimization',
    color: '#8b5cf6',
    features: [
      'Full 100-point audit',
      'All section analyses',
      'Unlimited AI suggestions',
      'Content generator (all types)',
      'SEO keyword analysis',
      'Competitor comparison',
      '7-day action plan',
      'Roast mode 🔥',
      'ATS compatibility check',
      'Priority support',
    ],
    cta: 'Get Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$29',
    period: '/month',
    desc: 'For teams and career coaches',
    color: '#06b6d4',
    features: [
      'Everything in Pro',
      'Unlimited audits',
      'Team dashboard (up to 25)',
      'Resume ↔ LinkedIn matching',
      'Recruiter simulation',
      'Weekly growth tracking',
      'API access',
      'White-label reports',
      'Dedicated support',
      'Custom branding',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
    { q: 'How does ProfilePulse analyze my profile?', a: 'Our AI engine evaluates every section of your LinkedIn profile — from your photo and headline to your experience, skills, and posting activity. We use industry best practices and recruiter insights to score and suggest improvements.' },
  { q: 'Is my LinkedIn data safe?', a: 'Absolutely. We don\'t store your LinkedIn credentials. We only analyze the publicly available information from your profile URL. Your data is processed securely and never shared with third parties.' },
  { q: 'Can I cancel my subscription anytime?', a: 'Yes! You can cancel your Pro or Enterprise subscription at any time. No questions asked, no hidden fees.' },
  { q: 'How accurate is the AI scoring?', a: 'Our scoring algorithm is based on analysis of thousands of successful LinkedIn profiles across industries. While no score is perfect, our suggestions consistently help users improve their profile visibility and recruiter engagement.' },
  { q: 'What\'s included in the free plan?', a: 'The free plan gives you a basic profile score, analysis of 3 key sections, limited AI suggestions, and 1 headline generation. Upgrade to Pro for the full experience.' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', padding: '120px 24px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 17, maxWidth: 500, margin: '0 auto 32px' }}>
              Choose the plan that fits your career goals
            </p>

            {/* Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ color: !annual ? '#f1f5f9' : 'rgba(226,232,240,0.4)', fontSize: 14, fontWeight: 600 }}>Monthly</span>
              <button onClick={() => setAnnual(!annual)} style={{
                width: 52, height: 28, borderRadius: 14, padding: 3, cursor: 'pointer', border: 'none',
                background: annual ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'rgba(99,102,241,0.2)',
                transition: 'all 0.3s', position: 'relative',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: '#fff',
                  transform: annual ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.3s',
                }} />
              </button>
              <span style={{ color: annual ? '#f1f5f9' : 'rgba(226,232,240,0.4)', fontSize: 14, fontWeight: 600 }}>
                Annual <span style={{ color: '#10b981', fontSize: 12 }}>Save 20%</span>
              </span>
            </div>
          </motion.div>

          {/* Plans */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 80 }}>
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={plan.popular ? 'gradient-border' : 'glass-card'}
                style={{
                  padding: 36,
                  position: 'relative',
                  transform: plan.popular ? 'scale(1.05)' : 'none',
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: 'white',
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <h3 style={{ color: plan.color, fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 44, fontWeight: 800, color: '#f1f5f9' }}>
                    {plan.price === '$0' ? '$0' : annual ? `$${parseInt(plan.price.slice(1)) * 10}` : plan.price}
                  </span>
                  <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: 14 }}>
                    {plan.price === '$0' ? '' : annual ? '/year' : plan.period}
                  </span>
                </div>
                <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 14, marginBottom: 24 }}>{plan.desc}</p>

                <Link href="/audit" className="glow-btn" style={{
                  display: 'block', textAlign: 'center', width: '100%', padding: '14px', textDecoration: 'none', fontSize: 15, marginBottom: 24,
                  background: plan.popular ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'transparent',
                  border: plan.popular ? 'none' : '1px solid rgba(99,102,241,0.3)',
                }}>
                  {plan.cta}
                </Link>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: plan.color, fontSize: 14 }}>✓</span>
                      <span style={{ color: 'rgba(226,232,240,0.6)', fontSize: 14 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', textAlign: 'center', marginBottom: 40 }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: 'none', border: 'none', color: '#f1f5f9', fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    {faq.q}
                    <span style={{ color: 'rgba(226,232,240,0.3)', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s', flexShrink: 0, marginLeft: 12 }}>▾</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 24px 20px' }}>
                      <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
