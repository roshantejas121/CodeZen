"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Flame, 
  Target, 
  Code2, 
  Award, 
  TrendingUp, 
  Clock,
  ArrowRight,
  BrainCircuit,
  Rocket,
  CheckCircle2
} from "lucide-react";
import { StatsCard } from "@/components/ui/Cards";
import { Pomodoro } from "@/components/Pomodoro";
import { SnippetManager } from "@/components/SnippetManager";
import { Flashcards } from "@/components/Flashcards";
import { GoalsTracker } from "@/components/GoalsTracker";
import { TechNews } from "@/components/TechNews";
import { SmartDocs } from "@/components/SmartDocs";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [quote, setQuote] = useState({ quote: '', author: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/user').then(res => res.json()),
      fetch('/api/leaderboard').then(res => res.json()),
      fetch('/api/quote').then(res => res.json())
    ]).then(([userData, leaderboardData, quoteData]) => {
      setUser(userData);
      setLeaderboard(leaderboardData);
      setQuote(quoteData);
      setLoading(false);
    }).catch(err => {
      console.error("Fetch error:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Loading workspace...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '60px' }}>
      {/* 1. Elite Header & Progress Section */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
            System Status: Operational
          </motion.div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>
            Welcome back, <span className="text-gradient">{user?.name || 'Developer'}</span>
          </motion.h1>
          
          {/* Level Progress Bar */}
          <div style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 700 }}>
              <span style={{ color: 'var(--text-muted)' }}>Level 14 Mastery</span>
              <span style={{ color: 'var(--primary)' }}>78% to Level 15</span>
            </div>
            <div style={{ height: '8px', background: 'var(--glass-bg)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', boxShadow: '0 0 15px var(--primary-glow)' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/lessons" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient"
              style={{ padding: '14px 28px', borderRadius: '14px', border: 'none', color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 10px 30px var(--primary-glow)' }}
            >
              <Rocket size={18} /> Resume Training
            </motion.button>
          </Link>
        </div>
      </header>

      {/* 2. Vital Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <StatsCard title="Daily Streak" value={`${user?.streak || 0} Days`} icon={Flame} trend="+2" color="#f59e0b" />
        <StatsCard title="Academy XP" value={(user?.xp || 0).toLocaleString()} icon={TrendingUp} trend="Mastery" color="var(--primary)" />
        <StatsCard title="Repositories" value="12 Active" icon={Code2} trend="+3 new" color="var(--secondary)" />
        <StatsCard title="Global Rank" value="#42" icon={Award} trend="Top 1%" color="#10b981" />
      </div>

      {/* 3. Mastery Shortcuts HUD */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div className="bg-gradient" style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rocket size={16} color="white" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Mastery Shortcuts</h2>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--card-border) 0%, transparent 100%)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { id: '1', title: "Generative AI", provider: "Coursera", url: "https://www.coursera.org/learn/generative-ai-with-llms", icon: <BrainCircuit size={18} /> },
            { id: '3', title: "Kubernetes Mastery", provider: "Coursera", url: "https://www.coursera.org/specializations/architecting-google-kubernetes-engine", icon: <Code2 size={18} /> },
            { id: '5', title: "Rust Orchestration", provider: "Coursera", url: "https://www.coursera.org/specializations/rust-programming", icon: <Rocket size={18} /> }
          ].map((track) => (
            <div key={track.id} className="glass-card hover-glow" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--primary)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--primary)' }}>
                  {track.icon}
                  <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>{track.provider}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{track.title}</h3>
              </div>
              <a href={track.url} target="_blank" rel="noopener noreferrer">
                <button style={{ 
                  background: track.url.includes('coursera.org') ? '#0056D2' : 'var(--primary)', 
                  border: 'none', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  fontSize: '12px', 
                  fontWeight: 700, 
                  cursor: 'pointer', 
                  boxShadow: track.url.includes('coursera.org') ? '0 4px 12px rgba(0, 86, 210, 0.3)' : '0 4px 12px var(--primary-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {track.url.includes('coursera.org') && (
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg" alt="" style={{ width: '12px', filter: 'brightness(0) invert(1)' }} />
                  )}
                  {track.url.includes('coursera.org') ? 'View on Coursera' : 'Start'}
                </button>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Streamlined Command Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
        
        {/* Left Column: Core Technical Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Project Objectives</h2>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--card-border) 0%, transparent 100%)' }} />
            </div>
            <GoalsTracker />
          </section>

          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Technical Intelligence</h2>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--card-border) 0%, transparent 100%)' }} />
            </div>
            <TechNews />
          </section>
        </div>

        {/* Right Column: Professional Identity & Leaderboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <div className="glass-card" style={{ borderTop: '4px solid var(--accent)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={22} color="var(--accent)" /> Professional Portfolio
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {user?.certifications?.length > 0 ? (
                user.certifications.map((cert: string) => (
                  <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--card-border)' }}>
                    <CheckCircle2 size={16} color="var(--accent)" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{cert}</span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Professional portfolio pending credentials.</p>
                  <Link href="/lessons">
                    <button style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                      Earn Credentials
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target size={22} color="#f59e0b" /> Global Leaderboard
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {leaderboard.slice(0, 5).map((u, i) => (
                <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '12px', background: u.name === user?.name ? 'rgba(59, 130, 246, 0.1)' : 'transparent', border: u.name === user?.name ? '1px solid var(--primary)' : 'none' }}>
                  <div style={{ 
                    width: '28px', height: '28px', borderRadius: '50%', 
                    background: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : 'var(--glass-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: i < 3 ? 'white' : 'var(--text-muted)'
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{u.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{(u.xp).toLocaleString()} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SmartDocs />
        </div>

      </div>
    </div>
  );
}
