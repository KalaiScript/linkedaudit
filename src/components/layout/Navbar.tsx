'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '16px 24px',
        background: 'rgba(6, 6, 14, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: 'white',
          }}>
            LS
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0' }}>
            Kalai<span style={{ color: '#8b5cf6' }}>Script</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-desktop">
          <Link href="/#features" style={{ color: 'rgba(226,232,240,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>Features</Link>
          <Link href="/post-generator" style={{ color: 'rgba(226,232,240,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>Post Generator</Link>
          <Link href="/pricing" style={{ color: 'rgba(226,232,240,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>Pricing</Link>
          <Link href="/audit" className="glow-btn" style={{ padding: '10px 24px', fontSize: 14, textDecoration: 'none' }}>
            Analyze Profile
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-mobile-btn"
          style={{
            display: 'none', background: 'none', border: 'none', color: '#e2e8f0',
            cursor: 'pointer', padding: 8, fontSize: 24,
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="nav-mobile-menu"
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: 16,
              padding: '20px 0',
              borderTop: '1px solid rgba(99,102,241,0.1)',
              marginTop: 16,
            }}
          >
            <Link href="/#features" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(226,232,240,0.7)', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Features</Link>
            <Link href="/post-generator" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(226,232,240,0.7)', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Post Generator</Link>
            <Link href="/pricing" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(226,232,240,0.7)', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Pricing</Link>
            <Link href="/audit" onClick={() => setMenuOpen(false)} className="glow-btn" style={{ padding: '10px 24px', fontSize: 14, textDecoration: 'none', textAlign: 'center' }}>
              Analyze Profile
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
          .nav-mobile-menu { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  );
}
