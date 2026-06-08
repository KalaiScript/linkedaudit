'use client';
import { useState, useEffect } from 'react';

export default function VisitorStats() {
  const [count, setCount] = useState<number | null>(null);
  const [activeUsers, setActiveUsers] = useState<number>(12);

  useEffect(() => {
    // Simulated global visitor count + increment
    const fetchCount = async () => {
      try {
        // We'll use a base number + a small increment stored in localStorage for this demo
        // to make it feel persistent and growing for the user.
        const baseCount = 12450;
        const storedVisits = localStorage.getItem('linkhive_total_visits');
        let currentVisits = storedVisits ? parseInt(storedVisits) : baseCount;
        
        // Increment by 1 on each mount (new session/open)
        currentVisits += 1;
        localStorage.setItem('linkhive_total_visits', currentVisits.toString());
        setCount(currentVisits);
      } catch (e) {
        setCount(12450);
      }
    };

    fetchCount();

    // Randomize active users slightly for "live" feel
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * (18 - 8 + 1)) + 8);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      background: 'rgba(255, 255, 255, 0.03)',
      padding: '12px 20px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      marginTop: '20px',
      width: 'fit-content'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '10px', color: 'rgba(226, 232, 240, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Visits</span>
        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-blue-light)' }}>
          {count ? count.toLocaleString() : '---'}
        </span>
      </div>
      
      <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.1)' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '10px', color: 'rgba(226, 232, 240, 0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="animate-online" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
          Live Now
        </span>
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>
          {activeUsers}
        </span>
      </div>
    </div>
  );
}
