"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Play, 
  Lock,
  ArrowRight,
  Search
} from "lucide-react";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLessons(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch lessons:", err);
        setLoading(false);
      });
  }, []);

  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedLessons = filteredLessons.reduce((acc: any, lesson: any) => {
    const cat = lesson.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(lesson);
    return acc;
  }, {});

  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Loading Certification Tracks...</div>;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '80px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Certification Hub</h1>
          <p style={{ color: 'var(--text-muted)' }}>Follow professional roadmaps to earn world-class industry credentials.</p>
        </div>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} 
          />
          <input 
            type="text"
            placeholder="Search career paths (e.g. LLM, React, Cloud)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%',
              padding: '12px 16px 12px 48px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            className="search-input"
          />
        </div>
      </header>

      {Object.keys(groupedLessons).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--glass-bg)', borderRadius: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No certifications found</h2>
          <p style={{ color: 'var(--text-muted)' }}>Try searching for a different keyword or professional domain.</p>
          <button 
            onClick={() => setSearchQuery('')}
            style={{ 
              marginTop: '24px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear Search
          </button>
        </div>
      ) : (
        Object.entries(groupedLessons).map(([category, catLessons]: [string, any], catIndex) => (
        <section key={category}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>{category}</h2>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--card-border) 0%, transparent 100%)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {catLessons.sort((a: any, b: any) => a.order - b.order).map((lesson: any, index: number) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (catIndex * 0.1) + (index * 0.05) }}
                className="glass-card"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '24px',
                  borderLeft: `4px solid ${lesson.difficulty === 'Advanced' ? 'var(--accent)' : lesson.difficulty === 'Intermediate' ? 'var(--primary)' : 'var(--secondary)'}`
                }}
              >
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'var(--glass-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }}>
                  <BookOpen size={24} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{lesson.title}</h3>
                    <span style={{ 
                      fontSize: '10px', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.05)',
                      color: lesson.difficulty === 'Advanced' ? 'var(--accent)' : lesson.difficulty === 'Intermediate' ? 'var(--primary)' : 'var(--secondary)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {lesson.difficulty}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{lesson.description}</p>
                </div>

                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <CheckCircle2 size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {lesson.duration}
                  </div>
                  <a 
                    href={lesson.externalLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ textDecoration: 'none' }}
                  >
                    <button style={{ 
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginLeft: 'auto',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                    }}>
                      Start Track
                      <Play size={12} fill="currentColor" />
                    </button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )))}
    </div>
  );
}
