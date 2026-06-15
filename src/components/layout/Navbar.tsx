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
        position: 'relative',
        zIndex: 50,
        padding: '16px 24px',
        background: 'rgba(6, 6, 14, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="LinkHive Logo" style={{ width: 'clamp(30px, 8vw, 36px)', height: 'clamp(30px, 8vw, 36px)', borderRadius: 8 }} />
          <span style={{ fontSize: 'clamp(16px, 5vw, 20px)', fontWeight: 700, color: '#ffffff' }}>
            Link<span style={{ color: 'var(--accent-blue)' }}>Hive</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="nav-desktop">
          <Link href="/#features" style={{ color: 'rgba(226,232,240,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>Features</Link>
          <Link href="/post-generator" style={{ color: 'rgba(226,232,240,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>Post Generator</Link>
          <Link href="/carousel-generator" style={{ color: 'rgba(226,232,240,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>Carousel Gen</Link>
          <Link href="/reply-assistant" style={{ color: 'rgba(226,232,240,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>Reply Assistant</Link>
          <Link href="/history" style={{ color: 'rgba(226,232,240,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>History</Link>
          
          <Link href="/audit" className="glow-btn" style={{ padding: '10px 20px', fontSize: 13, textDecoration: 'none' }}>
            Analyze Profile
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-mobile-btn"
          style={{
            display: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0',
            cursor: 'pointer', padding: '8px 12px', fontSize: 20, borderRadius: 8,
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
            <Link href="/#features" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(226,232,240,0.7)', textDecoration: 'none', fontSize: 18, fontWeight: 500, padding: '12px 0' }}>Features</Link>
            <Link href="/post-generator" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(226,232,240,0.7)', textDecoration: 'none', fontSize: 18, fontWeight: 500, padding: '12px 0' }}>Post Generator</Link>
            <Link href="/carousel-generator" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(226,232,240,0.7)', textDecoration: 'none', fontSize: 18, fontWeight: 500, padding: '12px 0' }}>Carousel Gen</Link>
            <Link href="/reply-assistant" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(226,232,240,0.7)', textDecoration: 'none', fontSize: 18, fontWeight: 500, padding: '12px 0' }}>Reply Assistant</Link>
            <Link href="/history" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(226,232,240,0.7)', textDecoration: 'none', fontSize: 18, fontWeight: 500, padding: '12px 0' }}>History</Link>
            
            <Link href="/audit" onClick={() => setMenuOpen(false)} className="glow-btn" style={{ padding: '14px 24px', fontSize: 16, textDecoration: 'none', textAlign: 'center', marginTop: 8 }}>
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
