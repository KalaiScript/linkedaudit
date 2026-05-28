'use client';
import { useEffect, useRef } from 'react';


interface ScoreCircleProps {
  score: number;
  maxScore: number;
  size?: number;
  label?: string;
  showGrade?: boolean;
  grade?: string;
}

export default function ScoreCircle({ score, maxScore, size = 180, label, showGrade, grade }: ScoreCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pct = score / maxScore;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 12;
    const lw = 8;
    let currentPct = 0;
    const targetPct = pct;
    const duration = 1500;
    const startTime = Date.now();

    function getColor(p: number) {
      if (p >= 0.8) return '#10b981';
      if (p >= 0.6) return '#3b82f6';
      if (p >= 0.4) return '#f59e0b';
      return '#ef4444';
    }

    function draw() {
      if (!ctx) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      currentPct = targetPct * (1 - Math.pow(1 - progress, 3));

      ctx.clearRect(0, 0, size, size);

      // background track
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99,102,241,0.1)';
      ctx.lineWidth = lw;
      ctx.stroke();

      // progress arc
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (Math.PI * 2 * currentPct);
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(0.5, '#8b5cf6');
      gradient.addColorStop(1, '#06b6d4');
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.stroke();

      // score text
      const displayScore = Math.round(currentPct * maxScore);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = `800 ${size * 0.22}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (showGrade && grade) {
        ctx.fillText(`${displayScore}`, cx, cy - 10);
        ctx.font = `600 ${size * 0.1}px Inter, sans-serif`;
        ctx.fillStyle = getColor(currentPct);
        ctx.fillText(grade, cx, cy + size * 0.16);
      } else {
        ctx.fillText(`${displayScore}`, cx, cy - 6);
        ctx.font = `500 ${size * 0.08}px Inter, sans-serif`;
        ctx.fillStyle = 'rgba(226,232,240,0.4)';
        ctx.fillText(`/ ${maxScore}`, cx, cy + size * 0.14);
      }

      if (progress < 1) requestAnimationFrame(draw);
    }

    draw();
  }, [score, maxScore, size, pct, showGrade, grade]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas ref={canvasRef} style={{ width: size, height: size }} className="score-ring" />
      {label && <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: 13, marginTop: 8 }}>{label}</p>}
    </div>
  );
}
