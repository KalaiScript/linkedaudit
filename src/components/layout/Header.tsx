'use client';
import Navbar from './Navbar';

export default function Header() {
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <div style={{ 
        background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-blue-light))', 
        color: 'white', 
        padding: '8px 24px', 
        fontSize: 'clamp(10px, 2.5vw, 12px)', 
        fontWeight: 700, 
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
        lineHeight: 1.4
      }}>
        🔥 LIVE: LinkHive users are seeing 3.5x more recruiter profile views this week!
      </div>
      <Navbar />
    </header>
  );
}
