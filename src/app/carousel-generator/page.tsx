'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { LinkedInProfile } from '@/types';
import { generateCarouselAction } from '@/app/actions/ai-actions';
import html2canvas from 'html2canvas';
import jsPDF from 'jsPDF';

interface Slide {
  slideNumber: number;
  title: string;
  subtitle: string;
  bullets: string[];
}

const themes = [
  {
    id: 'cobalt',
    name: 'Cobalt Power',
    bg: '#0a66c2',
    text: '#ffffff',
    accent: '#cbd5e1',
    accentText: '#93c5fd',
    footerText: 'rgba(255, 255, 255, 0.7)',
    cardBg: '#084f96',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  {
    id: 'amethyst',
    name: 'Amethyst Tech',
    bg: '#0f0f1c',
    text: '#f3e8ff',
    accent: '#a78bfa',
    accentText: '#c4b5fd',
    footerText: 'rgba(243, 232, 255, 0.6)',
    cardBg: '#18182b',
    border: 'rgba(167, 139, 250, 0.2)',
  },
  {
    id: 'sunset',
    name: 'Sunset Brand',
    bg: '#18181b',
    text: '#fafafa',
    accent: '#f97316',
    accentText: '#fdba74',
    footerText: 'rgba(250, 250, 250, 0.6)',
    cardBg: '#27272a',
    border: 'rgba(249, 115, 22, 0.2)',
  },
  {
    id: 'emerald',
    name: 'Emerald Growth',
    bg: '#064e3b',
    text: '#ecfdf5',
    accent: '#34d399',
    accentText: '#6ee7b7',
    footerText: 'rgba(236, 253, 245, 0.7)',
    cardBg: '#065f46',
    border: 'rgba(52, 211, 153, 0.2)',
  },
  {
    id: 'stark',
    name: 'Minimal Stark',
    bg: '#ffffff',
    text: '#0f172a',
    accent: '#475569',
    accentText: '#2563eb',
    footerText: 'rgba(15, 23, 42, 0.6)',
    cardBg: '#f8fafc',
    border: '#e2e8f0',
  }
];

const defaultSlides: Slide[] = [
  {
    slideNumber: 1,
    title: 'How to Build a Powerful LinkedIn Brand',
    subtitle: 'The 3 key principles of digital networking',
    bullets: ['Consistency is more important than virality', 'Provide authentic value first', 'Optimize your storefront (profile)']
  },
  {
    slideNumber: 2,
    title: 'Principle 1: Consistency is Key',
    subtitle: 'Why showing up daily matters',
    bullets: ['Algorithm favors active, engaging creators', 'Your audience builds a habit around your content', 'Compound interest applies to networks']
  },
  {
    slideNumber: 3,
    title: 'Principle 2: Value First, Pitch Later',
    subtitle: 'Give away 99% of your knowledge for free',
    bullets: ['Establish deep industry authority', 'Build high-level professional trust', 'Clients reach out when they are ready']
  },
  {
    slideNumber: 4,
    title: 'Principle 3: Clean Storefront',
    subtitle: 'Maximize the impact of your profile',
    bullets: ['Write a direct headline highlighting your value', 'Craft a compelling narrative in the About section', 'Add clear Calls to Action (CTA)']
  },
  {
    slideNumber: 5,
    title: 'Start Building Today!',
    subtitle: 'Success is just showing up consistently',
    bullets: ['Follow for daily branding insights', 'Leave a comment with your thoughts!', 'Download LinkHive to audit your profile']
  }
];

export default function CarouselGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [tone, setTone] = useState('Professional');
  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);

  // Hidden ref for PDF export rendering
  const exportContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('linkhive_profile');
    if (stored) {
      try {
        /* eslint-disable react-hooks/set-state-in-effect */
        setProfile(JSON.parse(stored));
        /* eslint-enable react-hooks/set-state-in-effect */
      } catch { }
    }
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    const result = await generateCarouselAction(topic, slideCount, tone, profile);
    if (result.success && result.slides) {
      setSlides(result.slides);
      setActiveSlide(0);
    } else {
      alert(result.error || 'Failed to generate carousel slides.');
    }
    setIsGenerating(false);
  };

  const updateSlideField = (index: number, field: 'title' | 'subtitle', value: string) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    setSlides(updated);
  };

  const updateSlideBullet = (slideIndex: number, bulletIndex: number, value: string) => {
    const updated = [...slides];
    const updatedBullets = [...updated[slideIndex].bullets];
    updatedBullets[bulletIndex] = value;
    updated[slideIndex] = { ...updated[slideIndex], bullets: updatedBullets };
    setSlides(updated);
  };

  const addBulletPoint = (slideIndex: number) => {
    if (slides[slideIndex].bullets.length >= 4) {
      alert('Maximum 4 bullets recommended for readability.');
      return;
    }
    const updated = [...slides];
    updated[slideIndex] = { ...updated[slideIndex], bullets: [...updated[slideIndex].bullets, 'New key takeaway'] };
    setSlides(updated);
  };

  const removeBulletPoint = (slideIndex: number, bulletIndex: number) => {
    const updated = [...slides];
    updated[slideIndex] = {
      ...updated[slideIndex],
      bullets: updated[slideIndex].bullets.filter((_, i) => i !== bulletIndex)
    };
    setSlides(updated);
  };

  const handleExport = async () => {
    if (!exportContainerRef.current) return;
    setIsExporting(true);
    
    try {
      const children = exportContainerRef.current.children;
      // Dimensions for 1:1 aspect ratio slide
      const slideSize = 800; 
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [slideSize, slideSize]
      });

      for (let i = 0; i < children.length; i++) {
        const slideEl = children[i] as HTMLElement;
        const canvas = await html2canvas(slideEl, {
          width: slideSize,
          height: slideSize,
          scale: 2, // High resolution scale
          useCORS: true
        });
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) {
          pdf.addPage([slideSize, slideSize]);
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, slideSize, slideSize);
      }

      pdf.save(`LinkHive-Carousel-${topic.replace(/\s+/g, '-').slice(0, 20) || 'Post'}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Error occurred during export. Please check console for logs.');
    }
    setIsExporting(false);
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingTop: '160px', paddingBottom: '60px', background: '#06060e' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Link href="/" style={{ color: 'rgba(226,232,240,0.5)', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
               Back to Home
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>
              LinkedIn <span className="gradient-text">Carousel PDF Generator</span>
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: 16, maxWidth: 650, margin: '0 auto' }}>
              Create viral square slide decks with AI. Tailor themes, customize titles, and download multi-page PDFs perfect for native LinkedIn uploads.
            </p>
          </div>

          <div className="responsive-grid-2" style={{ alignItems: 'start', gap: 32 }}>
            
            {/* Control Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Creator Settings */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Configure Deck</h3>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Carousel Topic</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g., UI/UX design trends, SaaS growth tricks..." 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="responsive-grid-2" style={{ marginBottom: 20 }}>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Slide Count</label>
                    <select 
                      className="select-field" 
                      value={slideCount}
                      onChange={(e) => setSlideCount(Number(e.target.value))}
                    >
                      {[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} slides</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Tone</label>
                    <select 
                      className="select-field" 
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                    >
                      <option value="Professional">Professional</option>
                      <option value="Bold/Viral">Bold/Viral</option>
                      <option value="Informative">Informative</option>
                      <option value="Casual">Casual</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !topic.trim()} 
                  className="glow-btn"
                  style={{ width: '100%', padding: '14px', fontSize: 16, opacity: (isGenerating || !topic.trim()) ? 0.6 : 1 }}
                >
                  {isGenerating ? 'AI Creating Slides...' : 'Generate Carousel with AI'}
                </button>
              </div>

              {/* Theme Settings */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Select Template Theme</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {themes.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTheme(t)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: activeTheme.id === t.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                        border: '1px solid ' + (activeTheme.id === t.id ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'),
                        color: activeTheme.id === t.id ? '#ffffff' : 'rgba(226,232,240,0.6)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: t.bg }} />
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: t.accentText }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Visual Editor/Previewer Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Main Slide Editor */}
              <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* Slide Header Toolbar */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa' }}>
                    EDITING SLIDE {activeSlide + 1} OF {slides.length}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                      disabled={activeSlide === 0}
                      className="tab-btn" 
                      style={{ padding: '6px 12px', fontSize: 12, opacity: activeSlide === 0 ? 0.3 : 1 }}
                    >
                      ← Prev
                    </button>
                    <button 
                      onClick={() => setActiveSlide(prev => Math.min(slides.length - 1, prev + 1))}
                      disabled={activeSlide === slides.length - 1}
                      className="tab-btn" 
                      style={{ padding: '6px 12px', fontSize: 12, opacity: activeSlide === slides.length - 1 ? 0.3 : 1 }}
                    >
                      Next →
                    </button>
                  </div>
                </div>

                {/* 1:1 Aspect Ratio Slide Canvas Box */}
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  maxWidth: '480px',
                  background: activeTheme.bg,
                  color: activeTheme.text,
                  borderRadius: 16,
                  padding: '40px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8)',
                  border: `1px solid ${activeTheme.border}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Subtle Grid overlay for design depth */}
                  <div style={{
                    position: 'absolute', inset: 0, 
                    backgroundImage: activeTheme.id === 'stark' 
                      ? 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)' 
                      : 'radial-gradient(rgba(255,255,255,0.05) 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px', opacity: 0.7, pointerEvents: 'none'
                  }} />

                  {/* Top Header branding */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: activeTheme.accentText }}>
                      🐝 {profile?.name || 'LinkHive Brand'}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: activeTheme.footerText }}>
                      {profile?.jobRoleTarget || 'Content Strategy'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '24px 0', zIndex: 1 }}>
                    
                    {/* Inline Editable Title */}
                    <textarea
                      value={slides[activeSlide]?.title || ''}
                      onChange={(e) => updateSlideField(activeSlide, 'title', e.target.value)}
                      rows={2}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: activeTheme.text,
                        fontSize: 'clamp(20px, 4vw, 24px)',
                        fontWeight: 800,
                        lineHeight: 1.25,
                        width: '100%',
                        resize: 'none',
                        outline: 'none',
                        marginBottom: 10,
                        fontFamily: 'inherit'
                      }}
                      placeholder="Title of this slide"
                    />

                    {/* Inline Editable Subtitle */}
                    <textarea
                      value={slides[activeSlide]?.subtitle || ''}
                      onChange={(e) => updateSlideField(activeSlide, 'subtitle', e.target.value)}
                      rows={2}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: activeTheme.accentText,
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        fontWeight: 500,
                        width: '100%',
                        resize: 'none',
                        outline: 'none',
                        marginBottom: 16,
                        fontFamily: 'inherit'
                      }}
                      placeholder="Main insight or takeaway statement"
                    />

                    {/* Interactive Bullet Points */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {slides[activeSlide]?.bullets.map((bullet, bIndex) => (
                        <div key={bIndex} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ color: activeTheme.accentText, fontWeight: 700, fontSize: 16, marginTop: -2 }}>•</span>
                          <textarea
                            value={bullet}
                            onChange={(e) => updateSlideBullet(activeSlide, bIndex, e.target.value)}
                            rows={1}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: activeTheme.text,
                              fontSize: '13px',
                              lineHeight: 1.4,
                              width: '100%',
                              resize: 'none',
                              outline: 'none',
                              fontFamily: 'inherit',
                              opacity: 0.85
                            }}
                            placeholder="Takeaway detail"
                          />
                          <button
                            onClick={() => removeBulletPoint(activeSlide, bIndex)}
                            style={{
                              background: 'transparent', border: 'none', cursor: 'pointer',
                              color: '#ef4444', fontSize: 11, fontWeight: 600, display: 'inline', opacity: 0.6
                            }}
                            title="Delete bullet"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {/* Add bullet button */}
                      {slides[activeSlide]?.bullets.length < 4 && (
                        <button
                          onClick={() => addBulletPoint(activeSlide)}
                          style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            color: activeTheme.accentText, fontSize: 12, fontWeight: 700,
                            textAlign: 'left', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4
                          }}
                        >
                          + Add Bullet Point
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Footer Branding */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: activeTheme.footerText }}>
                      {activeSlide === slides.length - 1 ? '👉 Follow for more' : 'Swipe next →'}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: activeTheme.accentText }}>
                      {activeSlide + 1} / {slides.length}
                    </span>
                  </div>

                </div>

                {/* PDF Download Action */}
                <div style={{ marginTop: 24, width: '100%' }}>
                  <button 
                    onClick={handleExport} 
                    disabled={isExporting} 
                    className="glow-btn"
                    style={{ width: '100%', padding: '14px', borderRadius: 12, fontSize: 16 }}
                  >
                    {isExporting ? 'Compiling Multi-Page PDF...' : 'Download LinkedIn PDF Slides'}
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

      {/* OFFSCREEN HIGH-RES RENDER CONTAINER FOR EXPORTS */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={exportContainerRef}>
          {slides.map((slide, sIndex) => (
            <div 
              key={slide.slideNumber}
              style={{
                width: '800px',
                height: '800px',
                background: activeTheme.bg,
                color: activeTheme.text,
                padding: '70px 60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontFamily: 'Inter, system-ui, sans-serif',
                position: 'relative'
              }}
            >
              {/* Grid Overlay */}
              <div style={{
                position: 'absolute', inset: 0, 
                backgroundImage: activeTheme.id === 'stark' 
                  ? 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)' 
                  : 'radial-gradient(rgba(255,255,255,0.05) 1.5px, transparent 1.5px)',
                backgroundSize: '40px 40px', opacity: 0.7, pointerEvents: 'none'
              }} />

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 1 }}>
                <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: activeTheme.accentText }}>
                  🐝 {profile?.name || 'LinkHive Brand'}
                </span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: activeTheme.footerText }}>
                  {profile?.jobRoleTarget || 'Content Strategy'}
                </span>
              </div>

              {/* Main Content */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '40px 0', zIndex: 1 }}>
                <h2 style={{ fontSize: '42px', fontWeight: 900, lineHeight: 1.2, color: activeTheme.text, marginBottom: '16px' }}>
                  {slide.title}
                </h2>
                <h3 style={{ fontSize: '22px', fontWeight: 500, color: activeTheme.accentText, marginBottom: '36px' }}>
                  {slide.subtitle}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {slide.bullets.map((b, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <span style={{ color: activeTheme.accentText, fontWeight: 900, fontSize: '28px', lineHeight: '24px' }}>•</span>
                      <p style={{ fontSize: '20px', lineHeight: 1.5, color: activeTheme.text, opacity: 0.9 }}>
                        {b}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: activeTheme.footerText }}>
                  {sIndex === slides.length - 1 ? '👉 Follow for more' : 'Swipe next →'}
                </span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: activeTheme.accentText }}>
                  {sIndex + 1} / {slides.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
