'use client';
import Link from 'next/link';
import VisitorStats from './VisitorStats';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(99,102,241,0.1)',
      padding: '60px 24px 30px',
      background: 'rgba(6,6,14,0.8)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="/logo.png" alt="LinkHive Logo" style={{ width: 32, height: 32, borderRadius: 6 }} />
              <span style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>Link<span style={{ color: 'var(--accent-blue)' }}>Hive</span></span>
            </div>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 14, lineHeight: 1.6 }}>
              AI-powered LinkedIn profile analyzer and post generator.
            </p>
            
            <VisitorStats />

            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/profile.png" alt="Creator" style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--accent-blue)' }} />
              <div>
                <p style={{ fontSize: 12, color: 'rgba(226,232,240,0.5)', margin: 0 }}>Created by</p>
                <a href="https://www.linkedin.com/in/kalaiscript/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue-light)', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>Kalaiyarasan</a>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/audit" style={{ color: 'rgba(226,232,240,0.5)', textDecoration: 'none', fontSize: 14 }}>Profile Audit</Link>
              
              <Link href="/demo" style={{ color: 'rgba(226,232,240,0.5)', textDecoration: 'none', fontSize: 14 }}>Demo Report</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: 14 }}>LinkedIn Tips Blog</span>
              <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: 14 }}>Headline Examples</span>
              <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: 14 }}>Resume Optimization</span>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: 14 }}>About</span>
              <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: 14 }}>Privacy Policy</span>
              <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: 14 }}>Terms of Service</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(99,102,241,0.1)', paddingTop: 24, textAlign: 'center' }}>
          <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: 13 }}>
             2026 LinkHive. Built with AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
