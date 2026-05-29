'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CarouselPage() {
  const [topic, setTopic] = useState('');
  const [authorName, setAuthorName] = useState('John Doe');
  const [handle, setHandle] = useState('@johndoe');
  const [bgColor, setBgColor] = useState('#1e293b');
  const [textColor, setTextColor] = useState('#f8fafc');
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  
  const [slides, setSlides] = useState<{title: string, content: string}[]>([
    { title: 'The Power of AI', content: 'How AI is changing the way we work.' },
    { title: '1. Automation', content: 'Automating repetitive tasks saves hours every week.' },
    { title: '2. Creativity', content: 'AI acts as a co-pilot for brainstorming and design.' },
    { title: 'Ready to start?', content: 'Follow for more tips on leveraging AI!' }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const generateContent = () => {
    if (!topic) return;
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setSlides([
        { title: `Mastering ${topic}`, content: 'A step-by-step guide to leveling up your skills.' },
        { title: 'Step 1: Fundamentals', content: `Understand the core principles of ${topic} before diving deep.` },
        { title: 'Step 2: Practice', content: 'Consistent practice is key. Build real-world projects.' },
        { title: 'Step 3: Network', content: `Connect with other professionals in the ${topic} space.` },
        { title: 'Conclusion', content: 'Start your journey today and stay consistent!' }
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  const downloadPDF = async () => {
    if (!carouselRef.current) return;
    setIsDownloading(true);
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1080, 1080]
      });

      const slideElements = carouselRef.current.querySelectorAll('.carousel-slide');
      
      for (let i = 0; i < slideElements.length; i++) {
        const slide = slideElements[i] as HTMLElement;
        const canvas = await html2canvas(slide, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) pdf.addPage([1080, 1080]);
        pdf.addImage(imgData, 'PNG', 0, 0, 1080, 1080);
      }
      
      pdf.save('linkedin-carousel.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40, textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>
              AI <span className="gradient-text">Carousel Generator</span>
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              Create stunning, high-converting LinkedIn carousels in seconds. Export directly to PDF.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: 40, alignItems: 'start' }}>
            
            {/* Left Panel: Controls */}
            <div className="glass-card" style={{ padding: 24, position: 'sticky', top: 100 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#f1f5f9' }}>Settings & Content</h2>
              
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'rgba(226,232,240,0.8)' }}>Topic for AI Generation</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. React Performance Tips"
                    style={{ flex: 1, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(226,232,240,0.1)', padding: '10px 16px', borderRadius: 8, color: '#f1f5f9', fontSize: 15 }}
                  />
                  <button onClick={generateContent} disabled={isGenerating || !topic} className="glow-btn" style={{ padding: '10px 16px', borderRadius: 8, opacity: isGenerating || !topic ? 0.5 : 1 }}>
                    {isGenerating ? 'Wait...' : 'Generate'}
                  </button>
                </div>
              </div>

              <div style={{ height: 1, background: 'rgba(226,232,240,0.1)', margin: '24px 0' }} />

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'rgba(226,232,240,0.8)' }}>Author Name</label>
                <input 
                  type="text" 
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(226,232,240,0.1)', padding: '10px 16px', borderRadius: 8, color: '#f1f5f9', fontSize: 15 }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'rgba(226,232,240,0.8)' }}>Handle</label>
                <input 
                  type="text" 
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(226,232,240,0.1)', padding: '10px 16px', borderRadius: 8, color: '#f1f5f9', fontSize: 15 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 8, color: 'rgba(226,232,240,0.6)' }}>Background</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: '100%', height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 8, color: 'rgba(226,232,240,0.6)' }}>Text</label>
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ width: '100%', height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, marginBottom: 8, color: 'rgba(226,232,240,0.6)' }}>Accent</label>
                  <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: '100%', height: 40, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                </div>
              </div>

              <button 
                onClick={downloadPDF} 
                disabled={isDownloading}
                className="glow-btn" 
                style={{ width: '100%', padding: '14px', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {isDownloading ? 'Generating PDF...' : '⬇ Download as PDF'}
              </button>
            </div>

            {/* Right Panel: Preview Grid */}
            <div style={{ overflowX: 'auto', paddingBottom: 24 }}>
              <div 
                ref={carouselRef}
                style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 24, 
                  // When generating PDF, html2canvas renders the actual DOM elements. 
                  // We scale them via CSS here for preview, but real export needs 1080x1080.
                }}
              >
                {slides.map((slide, index) => (
                  <div 
                    key={index} 
                    className="carousel-slide"
                    style={{ 
                      width: 400, 
                      height: 400, // We use 400x400 for preview, it exports scaled if needed, or we use a fixed 1080 aspect ratio mapping.
                      backgroundColor: bgColor, 
                      color: textColor,
                      padding: 40,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      borderRadius: 12, // slightly rounded for web preview
                      overflow: 'hidden'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'auto' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: bgColor }}>
                        {authorName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{authorName}</div>
                        <div style={{ fontSize: 14, opacity: 0.8 }}>{handle}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ margin: 'auto 0' }}>
                      <h3 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, lineHeight: 1.2, color: index === 0 ? accentColor : textColor }}>
                        {slide.title}
                      </h3>
                      <p style={{ fontSize: 18, lineHeight: 1.5, opacity: 0.9 }}>
                        {slide.content}
                      </p>
                    </div>

                    {/* Footer / Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: `2px solid ${accentColor}40`, paddingTop: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: accentColor }}>Swipe →</div>
                      <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.6 }}>{index + 1} / {slides.length}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
