"use client";

import React, { useState, useEffect } from "react";
import { Volume2, HelpCircle, Monitor, Laptop, Check, Zap, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BELTS = [
  { name: "White Belt", color: "rgba(255,255,255,0.1)", text: "white", box: "#e5e7eb" },
  { name: "Yellow Belt", color: "rgba(234, 179, 8, 0.2)", text: "#eab308", box: "#eab308" },
  { name: "Orange Belt", color: "rgba(249, 115, 22, 0.2)", text: "#f97316", box: "#f97316" },
  { name: "Green Belt", color: "rgba(16, 185, 129, 0.2)", text: "#10b981", box: "#10b981" },
  { name: "Blue Belt", color: "rgba(59, 130, 246, 0.2)", text: "#3b82f6", box: "#3b82f6" },
  { name: "Black Belt", color: "rgba(0, 0, 0, 0.5)", text: "#9ca3af", box: "#4b5563" },
];

export default function DojoPage() {
  const [tracks, setTracks] = useState([
    { language: "Javascript", progress: 0 },
    { language: "C++", progress: 0 },
    { language: "Java", progress: 0 },
    { language: "Python", progress: 0 }
  ]);

  useEffect(() => {
    // Load progress from local storage
    const saved = localStorage.getItem('dojo_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTracks(prev => prev.map(track => {
        const savedTrack = parsed.find((t: any) => decodeURIComponent(t.language).toLowerCase() === track.language.toLowerCase());
        return savedTrack ? { ...track, progress: savedTrack.progress } : track;
      }));
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Banner Image */}
      <div style={{ width: '100%', height: '320px', position: 'relative', borderBottom: '1px solid var(--card-border)', overflow: 'hidden' }}>
        <Image 
          src="/dojo-header.png" 
          alt="Dojo Interior" 
          fill
          style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.8, mixBlendMode: 'screen' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--background))' }} />
      </div>

      {/* Control Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, margin: '-20px 40px 0 40px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={24} color="var(--primary)" />
          <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '1px', color: 'white' }}>DOJO WORKOUTS</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
          <Volume2 size={18} cursor="pointer" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <HelpCircle size={16} /> How it Works
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <Monitor size={16} /> Belt Testing
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', width: '100%' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <Laptop size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'white' }}>Available Tracks</h2>
          <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {tracks.map((track) => {
            const level = Math.min(track.progress, 5);
            const belt = BELTS[level];

            return (
              <div key={track.language} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderLeft: level > 0 ? `4px solid ${belt.box}` : '4px solid transparent' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, width: '100px', color: 'white' }}>{track.language}</span>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i} 
                          style={{ 
                            width: '18px', 
                            height: '24px', 
                            background: i <= level ? BELTS[Math.min(i, 5)].box : 'rgba(255,255,255,0.05)',
                            transform: 'skewX(-15deg)',
                            border: i <= level ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            boxShadow: i === level && level > 0 ? `0 0 10px ${belt.box}80` : 'none'
                          }} 
                        />
                      ))}
                    </div>
                  </div>

                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: belt.color, 
                    color: belt.text, 
                    padding: '6px 16px', 
                    borderRadius: '16px', 
                    fontSize: '12px', 
                    fontWeight: 800,
                    fontStyle: 'italic',
                    marginLeft: '124px',
                    border: `1px solid ${belt.text}40`
                  }}>
                    {belt.name}
                    {level > 0 && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>

                <Link href={`/dojo/workout/${track.language.toLowerCase()}`}>
                  <button style={{ 
                    background: level >= 5 ? 'var(--card-bg)' : 'var(--primary)', 
                    color: level >= 5 ? 'var(--text-muted)' : 'white', 
                    border: level >= 5 ? '1px solid var(--card-border)' : 'none', 
                    padding: '14px 32px', 
                    fontSize: '14px', 
                    fontWeight: 800,
                    cursor: level >= 5 ? 'not-allowed' : 'pointer',
                    borderRadius: '12px',
                    boxShadow: level >= 5 ? 'none' : '0 10px 20px rgba(59, 130, 246, 0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  className={level < 5 ? "hover-glow" : ""}
                  disabled={level >= 5}
                  >
                    {level >= 5 ? (
                      <Check size={16} />
                    ) : (
                      <Play size={16} fill="white" />
                    )}
                    {level >= 5 ? "Mastered" : "Start Workout"}
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
