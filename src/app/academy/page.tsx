"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveEditor } from "@/components/LiveEditor";
import { 
  ChevronRight, 
  Lightbulb,
  BookOpen
} from "lucide-react";

export default function AcademyPage() {
  const [academy, setAcademy] = useState<any[]>([]);
  const [selectedLang, setSelectedLang] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/academy')
      .then(res => res.json())
      .then(data => {
        const academyData = Array.isArray(data) ? data : [];
        setAcademy(academyData);
        if (academyData.length > 0) {
          const initialLang = academyData[0];
          setSelectedLang(initialLang);
          if (initialLang.chapters && initialLang.chapters.length > 0) {
            setSelectedChapter(initialLang.chapters[0]);
          }
        }
        setLoading(false);
      });
  }, []);

  if (!mounted || loading) return <div style={{ color: 'white', padding: '40px' }}>Loading curricula...</div>;

  const getColor = (id: string) => {
    switch(id) {
      case 'html': return '#e34c26';
      case 'css': return '#264de4';
      case 'javascript': return '#f7df1e';
      case 'typescript': return '#3178c6';
      case 'python': return '#3776ab';
      case 'cpp': return '#00599c';
      case 'java': return '#007396';
      case 'csharp': return '#239120';
      case 'rust': return '#dea584';
      case 'go': return '#00add8';
      case 'ruby': return '#cc342d';
      case 'swift': return '#f05138';
      case 'kotlin': return '#0095d5';
      case 'php': return '#777bb4';
      case 'bash': return '#4EAA25';
      case 'lua': return '#000080';
      default: return 'var(--primary)';
    }
  };

  const handleLanguageChange = (langId: string) => {
    const lang = academy.find(l => l.id === langId);
    if (lang) {
      setSelectedLang(lang);
      if (lang.chapters && lang.chapters.length > 0) {
        setSelectedChapter(lang.chapters[0]);
      }
    }
  };

  const handleChapterChange = (chapter: any) => {
    setSelectedChapter(chapter);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: 'calc(100vh - 100px)', 
      margin: '-20px -20px 0 -20px', 
      background: 'var(--background)',
      overflow: 'hidden'
    }}>
      {/* 1. Top Language Bar (W3Schools Style) */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        padding: '12px 24px', 
        background: 'rgba(15, 23, 42, 0.9)', 
        borderBottom: '1px solid var(--card-border)',
        overflowX: 'auto'
      }}>
        {academy.map((lang) => (
          <button
            key={lang.id}
            onClick={() => handleLanguageChange(lang.id)}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: selectedLang.id === lang.id ? getColor(lang.id) : 'transparent',
              background: selectedLang.id === lang.id ? `${getColor(lang.id)}15` : 'transparent',
              color: selectedLang.id === lang.id ? 'white' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {lang.name}
          </button>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '240px 1fr 1fr', 
        flex: 1,
        overflow: 'hidden'
      }}>
        <AnimatePresence mode="wait">
          {selectedLang && (
            <>
              {/* 2. Left Sidebar (Chapter List) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  borderRight: '1px solid var(--card-border)',
                  background: 'rgba(2, 6, 23, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',
                  padding: '24px 12px'
                }}
              >
                <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '16px', paddingLeft: '12px' }}>
                  Curriculum
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {selectedLang.chapters?.map((chapter: any, idx: number) => (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterChange(chapter)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: selectedChapter?.id === chapter.id ? 'var(--glass-bg)' : 'transparent',
                        color: selectedChapter?.id === chapter.id ? getColor(selectedLang.id) : 'var(--text-muted)',
                        fontSize: '13px',
                        fontWeight: selectedChapter?.id === chapter.id ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {idx + 1}. {chapter.title}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* 3. Center: Academic Documentation */}
              <motion.div 
                key={`docs-${selectedChapter?.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  borderRight: '1px solid var(--card-border)', 
                  background: 'var(--background)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',
                  padding: '40px'
                }}
              >
                <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '32px', fontWeight: 600 }}>
                    Academy <ChevronRight size={12} /> {selectedLang.name} <ChevronRight size={12} /> <span style={{ color: getColor(selectedLang.id) }}>{selectedChapter?.title}</span>
                  </div>
                  
                  <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '24px', color: 'white', letterSpacing: '-1px' }}>
                    {selectedChapter?.title}
                  </h1>

                  <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)', marginBottom: '40px' }}>
                    {(selectedChapter?.desc || selectedLang.desc).split('\n').map((para: string, i: number) => (
                      <p key={para} style={{ marginBottom: '20px' }}>{para}</p>
                    ))}
                  </div>

                  {selectedChapter?.videoUrl && (
                    <div style={{ 
                      width: '100%', 
                      aspectRatio: '16/9', 
                      background: '#000', 
                      borderRadius: '16px', 
                      overflow: 'hidden', 
                      marginBottom: '40px',
                      border: '1px solid var(--card-border)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }}>
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={selectedChapter.videoUrl} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                      />
                    </div>
                  )}

                  <div style={{ 
                    padding: '24px', 
                    background: 'rgba(59, 130, 246, 0.03)', 
                    border: '1px solid var(--card-border)',
                    borderRadius: '16px',
                    marginBottom: '40px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: getColor(selectedLang.id) }} />
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 800, marginBottom: '12px', color: 'white' }}>
                      <Lightbulb size={18} color={getColor(selectedLang.id)} /> Pro Tip
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {selectedChapter?.fact || selectedLang.fact}
                    </p>
                  </div>

                  {/* Sequencing Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', paddingTop: '32px', borderTop: '1px solid var(--card-border)' }}>
                    <button 
                      onClick={() => {
                        const idx = selectedLang.chapters.findIndex((c: any) => c.id === selectedChapter.id);
                        if (idx > 0) handleChapterChange(selectedLang.chapters[idx - 1]);
                      }}
                      disabled={selectedLang.chapters.findIndex((c: any) => c.id === selectedChapter.id) === 0}
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--card-border)', color: 'white', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}
                    >
                      &larr; Previous
                    </button>
                    <button 
                      onClick={() => {
                        const idx = selectedLang.chapters.findIndex((c: any) => c.id === selectedChapter.id);
                        if (idx < selectedLang.chapters.length - 1) handleChapterChange(selectedLang.chapters[idx + 1]);
                      }}
                      disabled={selectedLang.chapters.findIndex((c: any) => c.id === selectedChapter.id) === selectedLang.chapters.length - 1}
                      style={{ background: getColor(selectedLang.id), border: 'none', color: 'white', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}
                    >
                      Next Chapter &rarr;
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* 4. Right: Live IDE */}
              <motion.div 
                key={`ide-${selectedChapter?.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ 
                  padding: '24px',
                  background: '#020617',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                    Try It Yourself
                  </h2>
                </div>
                
                <div style={{ flex: 1, minHeight: 0 }}>
                  <LiveEditor 
                    initialCode={selectedChapter?.code || selectedLang.code} 
                    language={selectedLang.id} 
                    onLanguageChange={handleLanguageChange}
                    hideSelector={true}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
