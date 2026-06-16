'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { LinkedInProfile } from '@/types';
import { generatePostAction } from '@/app/actions/ai-actions';

interface ScheduledPost {
  id: string;
  day: string;
  time: string;
  text: string;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export default function SchedulerPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Editor Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [postText, setPostText] = useState('');
  
  // AI Assistant States
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  // Weekly Goal State
  const [weeklyGoal, setWeeklyGoal] = useState(3);
  
  // LinkedIn Preview Expand State
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  
  // Import file ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load state from local storage on mount
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setIsMounted(true);
    
    // Load profile
    const storedProfile = localStorage.getItem('linkhive_profile');
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error('Failed to parse profile data', e);
      }
    }
    
    // Load scheduler posts
    const storedPosts = localStorage.getItem('linkhive_content_calendar');
    if (storedPosts) {
      try {
        setPosts(JSON.parse(storedPosts));
      } catch (e) {
        console.error('Failed to parse scheduled posts', e);
      }
    }

    // Load weekly goal
    const storedGoal = localStorage.getItem('linkhive_weekly_post_goal');
    if (storedGoal) {
      setWeeklyGoal(Number(storedGoal));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Save posts to local storage when state changes
  const savePostsToLocalStorage = (updatedPosts: ScheduledPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('linkhive_content_calendar', JSON.stringify(updatedPosts));
  };

  // Save weekly goal when changed
  const handleWeeklyGoalChange = (val: number) => {
    setWeeklyGoal(val);
    localStorage.setItem('linkhive_weekly_post_goal', String(val));
  };

  // Open modal to create a new post
  const handleOpenCreateModal = (day: string) => {
    setEditingPostId(null);
    setSelectedDay(day);
    setScheduledTime('09:00');
    setPostText('');
    setAiTopic('');
    setAiError('');
    setIsPreviewExpanded(false);
    setIsModalOpen(true);
  };

  // Open modal to edit an existing post
  const handleOpenEditModal = (post: ScheduledPost) => {
    setEditingPostId(post.id);
    setSelectedDay(post.day);
    setScheduledTime(post.time);
    setPostText(post.text);
    setAiTopic('');
    setAiError('');
    setIsPreviewExpanded(false);
    setIsModalOpen(true);
  };

  // Save/Update Post
  const handleSavePost = () => {
    if (!postText.trim()) {
      alert('Post content cannot be empty.');
      return;
    }

    let updated: ScheduledPost[];
    if (editingPostId) {
      // Edit mode
      updated = posts.map(p => p.id === editingPostId ? {
        ...p,
        day: selectedDay,
        time: scheduledTime,
        text: postText
      } : p);
    } else {
      // Create mode
      const newPost: ScheduledPost = {
        id: Math.random().toString(36).substr(2, 9),
        day: selectedDay,
        time: scheduledTime,
        text: postText
      };
      updated = [...posts, newPost];
    }

    savePostsToLocalStorage(updated);
    setIsModalOpen(false);
  };

  // Delete Post
  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this scheduled post?')) {
      const updated = posts.filter(p => p.id !== id);
      savePostsToLocalStorage(updated);
    }
  };

  // AI Ghostwriter generation
  const handleGenerateAIDraft = async () => {
    if (!aiTopic.trim()) {
      setAiError('Please enter a topic for the post.');
      return;
    }
    
    setIsGenerating(true);
    setAiError('');
    
    try {
      const result = await generatePostAction(aiTopic, profile);
      if (result.success && result.content) {
        setPostText(result.content);
      } else {
        setAiError(result.error || 'Failed to generate post draft.');
      }
    } catch (err) {
      console.error(err);
      setAiError('An unexpected error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    if (posts.length === 0) {
      alert('No posts to export. Plan some posts first!');
      return;
    }

    // Sort posts chronologically by day & time
    const sortedPosts = [...posts].sort((a, b) => {
      const dayIndexA = DAYS_OF_WEEK.indexOf(a.day);
      const dayIndexB = DAYS_OF_WEEK.indexOf(b.day);
      if (dayIndexA !== dayIndexB) return dayIndexA - dayIndexB;
      return a.time.localeCompare(b.time);
    });

    const headers = ['Day', 'Scheduled Time', 'Post Content'];
    const csvRows = [
      headers.join(','),
      ...sortedPosts.map(p => {
        // Escape double quotes and wrap in quotes for valid CSV cell formatting
        const escapedContent = `"${p.text.replace(/"/g, '""')}"`;
        return `${p.day},${p.time},${escapedContent}`;
      })
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LinkHive-Post-Schedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON backup download
  const handleExportJSON = () => {
    if (posts.length === 0) {
      alert('No posts to back up.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(posts, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'LinkHive-Scheduler-Backup.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON restore upload
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.every(p => 'day' in p && 'time' in p && 'text' in p)) {
          savePostsToLocalStorage(parsed);
          alert(`Successfully imported ${parsed.length} posts!`);
        } else {
          alert('Invalid backup file format. Expected a list of scheduled posts.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Get user name initial for avatars
  const getUserInitials = () => {
    if (!profile?.name) return 'C';
    return profile.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Sort posts for display in calendar days
  const getPostsForDay = (day: string) => {
    return posts
      .filter(p => p.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // Calculated Metrics
  const currentScheduledCount = posts.length;
  const isGoalMet = currentScheduledCount >= weeklyGoal;
  const goalProgressPercentage = Math.min(100, (currentScheduledCount / weeklyGoal) * 100);

  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06060e', color: '#e2e8f0' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ fontSize: 48 }}>⚙</motion.div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingTop: '160px', paddingBottom: '80px', background: '#06060e' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Link href="/" style={{ color: 'rgba(226,232,240,0.5)', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
               Back to Home
            </Link>
          </div>

          {/* Header Description */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, marginBottom: 40 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>
                LinkedIn <span className="gradient-text">Content Planner</span>
              </h1>
              <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: 16, maxWidth: 650 }}>
                Structure your weekly publishing calendar, draft high-performing content with AI, and download schedules to import straight into your favorite posting tool.
              </p>
            </div>
            
            {/* Sync utilities */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => handleOpenCreateModal('Monday')}
                className="glow-btn"
                style={{ padding: '10px 24px', fontSize: 14 }}
              >
                + New Post
              </button>
              <button
                onClick={handleExportCSV}
                style={{
                  padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e2e8f0', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                Export CSV
              </button>
              <button
                onClick={handleExportJSON}
                style={{
                  padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e2e8f0', cursor: 'pointer', transition: 'all 0.2s'
                }}
                title="Download JSON Backup"
              >
                Backup JSON
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e2e8f0', cursor: 'pointer', transition: 'all 0.2s'
                }}
                title="Restore from JSON Backup"
              >
                Restore JSON
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportJSON} 
                accept=".json" 
                style={{ display: 'none' }} 
              />
            </div>
          </div>

          {/* Stats Bar / Goals Section */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                  Weekly Target: <span style={{ color: 'var(--accent-blue-light)' }}>{currentScheduledCount}</span> / {weeklyGoal} posts
                </span>
                <span style={{ 
                  fontSize: 12, 
                  fontWeight: 700, 
                  color: isGoalMet ? '#10b981' : '#f59e0b',
                  background: isGoalMet ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                  padding: '4px 10px',
                  borderRadius: 20
                }}>
                  {isGoalMet ? '✓ Weekly Goal Met!' : '🎯 Work In Progress'}
                </span>
              </div>
              {/* Progress bar container */}
              <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ 
                  width: `${goalProgressPercentage}%`, 
                  height: '100%', 
                  background: isGoalMet ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, var(--accent-blue), var(--accent-blue-light))',
                  borderRadius: 4,
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Target Post Count</label>
                <select 
                  className="select-field" 
                  value={weeklyGoal} 
                  onChange={(e) => handleWeeklyGoalChange(Number(e.target.value))}
                  style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, fontSize: 13, border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} posts / week</option>)}
                </select>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Posting Streak</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>🔥 {posts.length > 0 ? 'Active' : '0 days'}</span>
              </div>
            </div>
          </div>

          {/* Main Grid Calendar Layout */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: 16,
            alignItems: 'stretch'
          }} className="calendar-grid">
            {DAYS_OF_WEEK.map(day => {
              const dayPosts = getPostsForDay(day);
              return (
                <div 
                  key={day} 
                  className="glass-card" 
                  style={{ 
                    padding: 16, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    minHeight: '280px',
                    background: 'rgba(255,255,255,0.02)'
                  }}
                >
                  {/* Day header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>{day}</span>
                    <span style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)', fontWeight: 600 }}>
                      {dayPosts.length} post{dayPosts.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Posts content container */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                    {dayPosts.map(post => (
                      <div
                        key={post.id}
                        onClick={() => handleOpenEditModal(post)}
                        style={{
                          background: 'rgba(10, 102, 194, 0.05)',
                          border: '1px solid rgba(10, 102, 194, 0.15)',
                          padding: 12,
                          borderRadius: 10,
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s',
                          overflow: 'hidden'
                        }}
                        className="post-item-hover"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-blue-light)', background: 'rgba(10, 102, 194, 0.15)', padding: '2px 6px', borderRadius: 4 }}>
                            🕒 {post.time}
                          </span>
                          <button
                            onClick={(e) => handleDeletePost(post.id, e)}
                            style={{
                              background: 'transparent', border: 'none', color: 'rgba(239,68,68,0.7)',
                              fontSize: 12, cursor: 'pointer', opacity: 0.6, padding: '0 4px', transition: 'all 0.2s'
                            }}
                            title="Delete draft"
                            className="delete-btn"
                          >
                            ✕
                          </button>
                        </div>
                        <p style={{ 
                          fontSize: 12, 
                          color: '#e2e8f0', 
                          margin: 0, 
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {post.text}
                        </p>
                      </div>
                    ))}

                    {/* Empty placeholder */}
                    {dayPosts.length === 0 && (
                      <button
                        onClick={() => handleOpenCreateModal(day)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px dashed rgba(255, 255, 255, 0.08)',
                          background: 'transparent',
                          color: 'rgba(226, 232, 240, 0.3)',
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          padding: '24px 12px',
                          gap: 8,
                          transition: 'all 0.2s'
                        }}
                        className="dashed-btn-hover"
                      >
                        <span style={{ fontSize: 18 }}>+</span>
                        <span>Plan Post</span>
                      </button>
                    )}
                  </div>

                  {/* Add extra post button at bottom if posts already exist */}
                  {dayPosts.length > 0 && (
                    <button
                      onClick={() => handleOpenCreateModal(day)}
                      style={{
                        width: '100%',
                        padding: '6px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: 'rgba(226,232,240,0.5)',
                        fontSize: 11,
                        fontWeight: 600,
                        borderRadius: 6,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      className="add-sub-btn"
                    >
                      + Add Post
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal / Slider Overlay Drawer */}
          <AnimatePresence>
            {isModalOpen && (
              <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(10px)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
              }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card"
                  style={{
                    width: '100%',
                    maxWidth: '1200px',
                    height: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                    overflow: 'hidden'
                  }}
                >
                  {/* Modal Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
                      {editingPostId ? 'Edit Scheduled Post' : 'Create New Scheduled Post'}
                    </h3>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      style={{ background: 'transparent', border: 'none', color: 'rgba(226,232,240,0.5)', fontSize: 20, cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Modal Body - 2 Column Split Panel Layout */}
                  <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }} className="modal-split">
                    
                    {/* Left Column: Post Editor & AI Writer */}
                    <div style={{ flex: 1.2, padding: '24px', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 20 }}>
                      
                      {/* Day & Time Selector Row */}
                      <div className="responsive-grid-2" style={{ gap: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Schedule Day</label>
                          <select 
                            className="select-field" 
                            value={selectedDay} 
                            onChange={(e) => setSelectedDay(e.target.value)}
                          >
                            {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Publish Time</label>
                          <input 
                            type="time" 
                            className="input-field" 
                            value={scheduledTime} 
                            onChange={(e) => setScheduledTime(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* AI Ghostwriter Assistant Accordion Panel */}
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12, padding: 16 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>🤖</span> AI Ghostwriter Assistant
                        </h4>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <input 
                            type="text" 
                            className="input-field" 
                            placeholder="e.g. 5 career lessons after building a SaaS..." 
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            style={{ flex: 1, fontSize: 13 }}
                          />
                          <button
                            onClick={handleGenerateAIDraft}
                            disabled={isGenerating || !aiTopic.trim()}
                            className="glow-btn"
                            style={{ padding: '0 20px', fontSize: 13, height: '40px', whiteSpace: 'nowrap' }}
                          >
                            {isGenerating ? 'Drafting...' : 'Write Draft'}
                          </button>
                        </div>
                        {aiError && (
                          <div style={{ color: '#fca5a5', fontSize: 12, marginTop: 8 }}>
                            ⚠️ {aiError}
                          </div>
                        )}
                      </div>

                      {/* Main Post Content Draft Editor */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Draft Post Content</label>
                        <textarea
                          value={postText}
                          onChange={(e) => setPostText(e.target.value)}
                          placeholder="Write your LinkedIn post here..."
                          style={{
                            width: '100%',
                            flex: 1,
                            minHeight: '180px',
                            background: 'rgba(15,23,42,0.6)',
                            border: '1px solid rgba(226,232,240,0.1)',
                            padding: 16,
                            borderRadius: 12,
                            color: '#f1f5f9',
                            fontSize: 15,
                            lineHeight: 1.5,
                            resize: 'none',
                            outline: 'none'
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6, color: 'rgba(226,232,240,0.4)', fontSize: 12 }}>
                          {postText.length} characters
                        </div>
                      </div>

                    </div>

                    {/* Right Column: LinkedIn Post Feed Live Previewer */}
                    <div style={{ flex: 1, padding: '24px', background: 'rgba(0,0,0,0.15)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>LinkedIn Feed Live Preview</label>
                      
                      {/* LinkedIn Card Box */}
                      <div style={{
                        background: '#1d2226',
                        borderRadius: 10,
                        border: '1px solid #2f3539',
                        padding: 16,
                        fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif',
                        color: '#eef3f8',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}>
                        {/* Feed Card Header */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                          {/* Avatar icon */}
                          <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-blue-light))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            fontWeight: 700,
                            color: '#ffffff'
                          }}>
                            {getUserInitials()}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#f3f6f8', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span>{profile?.name || 'LinkedIn Creator'}</span>
                              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>• 1st</span>
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {profile?.headline || 'Branding Strategist & Personal Brand Builder'}
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span>Scheduled: {selectedDay} at {scheduledTime}</span>
                              <span>•</span>
                              <span>🌐</span>
                            </div>
                          </div>
                        </div>

                        {/* Feed Card Body text */}
                        <div style={{ fontSize: 14, lineHeight: 1.5, color: '#eef3f8', wordBreak: 'break-word', whiteSpace: 'pre-wrap', marginBottom: 12 }}>
                          {postText.trim() ? (
                            <>
                              {/* If preview not expanded and post length > 220, truncate */}
                              {!isPreviewExpanded && postText.length > 220 ? (
                                <>
                                  {postText.slice(0, 200)}
                                  <span 
                                    onClick={() => setIsPreviewExpanded(true)}
                                    style={{ color: '#70b5f9', cursor: 'pointer', fontWeight: 600, marginLeft: 4 }}
                                  >
                                    ...see more
                                  </span>
                                </>
                              ) : (
                                <>
                                  {postText}
                                  {isPreviewExpanded && postText.length > 220 && (
                                    <span 
                                      onClick={() => setIsPreviewExpanded(false)}
                                      style={{ color: '#70b5f9', cursor: 'pointer', fontWeight: 600, marginLeft: 4, display: 'block', marginTop: 6 }}
                                    >
                                      show less
                                    </span>
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            <span style={{ color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                              Write content or use the AI Ghostwriter draft helper to see the preview here...
                            </span>
                          )}
                        </div>

                        {/* Mock LinkedIn Interaction Feed Stats */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.45)', borderBottom: '1px solid #2f3539', paddingBottom: 8, marginBottom: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span>👍💡❤️</span>
                            <span>152 reactions</span>
                          </div>
                          <div>
                            <span>24 comments • 3 reposts</span>
                          </div>
                        </div>

                        {/* Mock Action buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-around', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 12px', borderRadius: 4 }} className="mock-feed-action">
                            <span>👍</span> Like
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 12px', borderRadius: 4 }} className="mock-feed-action">
                            <span>💬</span> Comment
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 12px', borderRadius: 4 }} className="mock-feed-action">
                            <span>🔁</span> Repost
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 12px', borderRadius: 4 }} className="mock-feed-action">
                            <span>📤</span> Send
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Modal Footer Controls */}
                  <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                        color: '#e2e8f0', cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePost}
                      className="glow-btn"
                      style={{ padding: '10px 28px', fontSize: 14 }}
                    >
                      {editingPostId ? 'Update Schedule' : 'Confirm Schedule'}
                    </button>
                  </div>

                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </main>
      <Footer />

      {/* Embedded local component styling */}
      <style jsx global>{`
        .calendar-grid {
          grid-template-columns: repeat(7, 1fr);
        }
        @media (max-width: 1200px) {
          .calendar-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (max-width: 850px) {
          .calendar-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .modal-split {
            flex-direction: column !important;
          }
          .modal-split > div {
            border-right: none !important;
            flex: none !important;
          }
        }
        @media (max-width: 480px) {
          .calendar-grid {
            grid-template-columns: 1fr;
          }
        }
        .post-item-hover:hover {
          border-color: var(--accent-blue-light) !important;
          background: rgba(10, 102, 194, 0.08) !important;
          box-shadow: 0 4px 20px rgba(10, 102, 194, 0.15);
        }
        .dashed-btn-hover:hover {
          border-color: var(--accent-blue) !important;
          color: var(--accent-blue-light) !important;
          background: rgba(255,255,255,0.01) !important;
        }
        .mock-feed-action:hover {
          background: rgba(255,255,255,0.08);
          color: #eef3f8 !important;
        }
      `}</style>
    </>
  );
}
