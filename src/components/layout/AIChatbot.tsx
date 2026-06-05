'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m AuditBot. Ask me anything about LinkedIn optimization, career branding, or how to use LinkedAudit!' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages }),
      });

      const data = await response.json();
      if (data.success) {
        let reply = data.reply;
        
        // Check for navigation command
        const navMatch = reply.match(/\[ACTION:NAVIGATE:(.*?)\]/);
        if (navMatch) {
          const path = navMatch[1];
          router.push(path);
          // Remove the command from the displayed message
          reply = reply.replace(navMatch[0], '').trim();
          // If the message becomes empty, use a default confirmation
          if (!reply) reply = `Heading over to ${path} now!`;
        }

        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Snag: ${data.error || 'The hive is busy. Try again!'} ` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Check your hive connectivity!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', 
          bottom: 'clamp(16px, 4vw, 24px)', 
          right: 'clamp(16px, 4vw, 24px)', 
          zIndex: 9999,
          width: 'clamp(50px, 12vw, 60px)', 
          height: 'clamp(50px, 12vw, 60px)', 
          borderRadius: '50%',
          background: 'var(--accent-blue)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(10, 102, 194, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: 'clamp(20px, 5vw, 24px)',
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        {isOpen ? '✕' : 'LA'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', 
              bottom: 'clamp(80px, 15vh, 100px)', 
              right: 'clamp(12px, 4vw, 24px)', 
              zIndex: 9999,
              width: 'min(400px, 92vw)', 
              height: 'min(500px, 65vh)',
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              pointerEvents: 'auto'
            }}
            className="glass-card"
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid rgba(10, 102, 194, 0.2)',
              display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(10, 102, 194, 0.05)'
            }}>
              <div style={{ 
                width: 32, height: 32, borderRadius: 6, background: 'var(--accent-blue)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold', color: 'white' 
              }}>LA</div>
              <div>
                <h4 style={{ margin: 0, fontSize: 15, color: '#f1f5f9' }}>AuditBot AI</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} className="animate-online" />
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--accent-blue-light)' }}>Online Career Expert</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: 20,
              display: 'flex', flexDirection: 'column', gap: 16
            }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%', padding: '10px 14px', borderRadius: 12,
                  fontSize: 14, lineHeight: 1.5,
                  background: m.role === 'user' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                  color: m.role === 'user' ? '#ffffff' : '#e2e8f0',
                  border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)'
                }}>
                  {m.content}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>...</motion.span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: 16, borderTop: '1px solid rgba(10, 102, 194, 0.2)' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Ask AuditBot..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  style={{
                    flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(10, 102, 194, 0.2)',
                    borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none'
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={loading}
                  style={{
                    background: 'var(--accent-blue)', border: 'none', borderRadius: 8,
                    width: 40, height: 40, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
                  }}
                >
                  ↑
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
