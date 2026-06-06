'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const mockReviews: Review[] = [
  { id: 1, name: 'Arjun S.', rating: 5, comment: 'LinkHive completely transformed my LinkedIn presence! The AI post generator is a game changer.', date: '2 days ago' },
  { id: 2, name: 'Priya K.', rating: 4, comment: 'Great tool for profile analysis. The tips were very specific and helpful.', date: '1 week ago' },
  { id: 3, name: 'Rahul M.', rating: 5, comment: 'Finally, a LinkedIn tool that actually understands the tech industry. Highly recommended!', date: '2 weeks ago' },
];

export default function ReviewsSection() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment || !name) return;

    const newReview: Review = {
      id: Date.now(),
      name,
      rating,
      comment,
      date: 'Just now',
    };

    setReviews([newReview, ...reviews]);
    setSubmitted(true);
    setRating(0);
    setComment('');
    setName('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="reviews" style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16, color: '#f1f5f9' }}>
          User <span className="gradient-text">Feedback</span>
        </h2>
        <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: 17, maxWidth: 600, margin: '0 auto' }}>
          What our users say about LinkHive. Share your experience with us!
        </p>
      </div>

      <div className="responsive-grid-2" style={{ gap: 40, alignItems: 'start' }}>
        {/* Review Form */}
        <div className="glass-card" style={{ padding: 'clamp(24px, 5vw, 40px)' }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Leave a Review</h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>Your Rating</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    style={{ 
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: 32,
                      color: (hover || rating) >= star ? 'var(--accent-blue-light)' : 'rgba(255,255,255,0.1)',
                      transition: 'color 0.2s'
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Your Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Kalaiyarasan P" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', color: 'rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Your Comment</label>
              <textarea 
                className="input-field" 
                rows={4} 
                placeholder="How has LinkHive helped your career journey?" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ resize: 'none' }}
                required
              />
            </div>

            <button type="submit" className="glow-btn" style={{ width: '100%', padding: '16px' }}>
              Submit Review
            </button>

            <AnimatePresence>
              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ color: '#10b981', fontSize: 14, textAlign: 'center', marginTop: 16, fontWeight: 600 }}
                >
                  ✓ Thank you for your feedback!
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {reviews.map((r, i) => (
            <motion.div 
              key={r.id} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="glass-card" 
              style={{ padding: 24, borderLeft: '4px solid var(--accent-blue)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h4 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, margin: 0 }}>{r.name}</h4>
                  <div style={{ color: 'var(--accent-blue-light)', fontSize: 14 }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                </div>
                <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: 12 }}>{r.date}</span>
              </div>
              <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                &quot;{r.comment}&quot;
              </p>
            </motion.div>
          ))}
          
          <div style={{ marginTop: 20 }}>
            <h4 style={{ color: 'rgba(226,232,240,0.4)', fontSize: 14, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase' }}>Related Resources</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {[
                { label: 'LinkedIn Help', url: 'https://www.linkedin.com/help/' },
                { label: 'DeepSeek AI', url: 'https://www.deepseek.com/' },
                { label: 'OpenAI', url: 'https://openai.com/' },
                { label: 'Kalai\'s LinkedIn', url: 'https://www.linkedin.com/in/kalaiscript/' },
              ].map((link) => (
                <a 
                  key={link.label}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(226,232,240,0.5)', 
                    fontSize: 13, textDecoration: 'none', transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(226,232,240,0.5)'; }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
