'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const defaultTasks = [
  { id: 1, text: 'Send 3 personalized connection requests to industry leaders.', points: 15 },
  { id: 2, text: 'Engage with 5 posts in your target niche (meaningful comments).', points: 10 },
  { id: 3, text: 'Share one update about what you are learning today.', points: 20 },
  { id: 4, text: 'Update your "Skills" section with one missing keyword.', points: 5 },
  { id: 5, text: 'Endorse 3 colleagues for their top skills.', points: 10 },
];

export default function MomentumChecklist() {
  const [completed, setCompleted] = useState<number[]>([]);

  const toggleTask = (id: number) => {
    if (completed.includes(id)) {
      setCompleted(completed.filter(t => t !== id));
    } else {
      setCompleted([...completed, id]);
    }
  };

  const totalPoints = completed.reduce((acc, id) => {
    const task = defaultTasks.find(t => t.id === id);
    return acc + (task?.points || 0);
  }, 0);

  const progress = (completed.length / defaultTasks.length) * 100;

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}></span>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>Daily Brand Momentum</h3>
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 13 }}>Consistent small wins lead to massive visibility.</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fbbf24' }}>+{totalPoints} XP</div>
          <div style={{ fontSize: 11, color: 'rgba(226,232,240,0.3)', textTransform: 'uppercase' }}>Daily Growth</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          style={{ height: '100%', background: '#fbbf24' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {defaultTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 10,
              background: completed.includes(task.id) ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
              border: '1px solid ' + (completed.includes(task.id) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'),
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 5,
              border: '2px solid ' + (completed.includes(task.id) ? '#10b981' : 'rgba(226,232,240,0.2)'),
              background: completed.includes(task.id) ? '#10b981' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12
            }}>
              {completed.includes(task.id) && ''}
            </div>
            <span style={{
              fontSize: 14,
              color: completed.includes(task.id) ? 'rgba(226,232,240,0.4)' : '#e2e8f0',
              textDecoration: completed.includes(task.id) ? 'line-through' : 'none'
            }}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
