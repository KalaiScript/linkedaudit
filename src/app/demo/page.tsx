'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoPage() {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard?url=demo&role=Software+Engineer&industry=Technology&level=Fresher&country=India');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06060e', color: '#e2e8f0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: 'spin 1s linear infinite' }}>⚡</div>
        <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 16 }}>Loading demo report...</p>
        <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
