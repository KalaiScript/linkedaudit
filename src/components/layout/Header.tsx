'use client';
import Navbar from './Navbar';

export default function Header() {
  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000,
      boxShadow: '0 4px 30px rgba(0,0,0,0.3)'
    }}>
      <div style={{ 
        background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-blue-light))', 
        color: 'white', 
        padding: '12px 16px', 
        fontSize: 'clamp(10px, 3vw, 13px)', 
        fontWeight: 700, 
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        lineHeight: 1.4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40px'
      }}>
        🔥 LIVE: LinkHive users are seeing 3.5x more recruiter profile views this week!
      </div>
      <Navbar />
    </header>
  );
}
