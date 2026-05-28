'use client';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { SectionScore } from '@/types';

Chart.register(...registerables);

interface RadarChartProps {
  sections: SectionScore[];
}

export default function RadarChartComponent({ sections }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: sections.map(s => s.name),
        datasets: [{
          label: 'Your Score',
          data: sections.map(s => (s.score / s.maxScore) * 100),
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          borderColor: '#8b5cf6',
          borderWidth: 2,
          pointBackgroundColor: '#8b5cf6',
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 4,
        }, {
          label: 'Industry Average',
          data: sections.map(() => 60 + Math.random() * 15),
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          borderColor: 'rgba(6, 182, 212, 0.4)',
          borderWidth: 1,
          borderDash: [4, 4],
          pointRadius: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              display: false,
              stepSize: 20,
            },
            grid: {
              color: 'rgba(99, 102, 241, 0.1)',
            },
            angleLines: {
              color: 'rgba(99, 102, 241, 0.1)',
            },
            pointLabels: {
              color: 'rgba(226, 232, 240, 0.5)',
              font: { size: 11, family: 'Inter' },
            },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(226, 232, 240, 0.5)',
              font: { size: 12, family: 'Inter' },
              padding: 20,
            },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [sections]);

  return <canvas ref={canvasRef} />;
}
