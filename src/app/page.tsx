"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Flame, Target, Code2, Award, TrendingUp, 
  ArrowRight, BrainCircuit, Rocket, CheckCircle2,
  Star, Sparkles, User, ChevronRight
} from "lucide-react";
import { StatsCard } from "@/components/ui/Cards";
import { GoalsTracker } from "@/components/GoalsTracker";
import { TechNews } from "@/components/TechNews";
import { SmartDocs } from "@/components/SmartDocs";
import { useUser } from "@/context/UserContext";

// ─── Onboarding Modal ─────────────────────────────────────────────────────────
function OnboardingModal({ onComplete }: { onComplete: (name: string) => void }) {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);

  const submit = async () => {
    if (!name.trim()) return;
    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), isNew: false }),
    });
    onComplete(name.trim());
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ width: '480px', maxWidth: '90vw' }}
        className="glass-card"
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'radial-gradient(circle, #818cf8 0%, #38bdf8 100%)', marginBottom: '20px', boxShadow: '0 0 50px rgba(56,189,248,0.5)' }}
          >
            <Sparkles size={36} color="white" />
          </motion.div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '10px' }}>
            Welcome to <span className="text-gradient">CodeZen</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            Your elite developer platform. You start at <strong style={{ color: 'white' }}>Level 1 – Initiate</strong>. 
            Every line of code you write earns real XP and climbs you through 15 ranks.
          </p>
        </div>

        {/* Level Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '28px' }}>
          {[
            { l: 1, t: 'Initiate', c: '#94a3b8' },
            { l: 5, t: 'Engineer', c: '#38bdf8' },
            { l: 9, t: 'Principal', c: '#a855f7' },
            { l: 12, t: 'Fellow', c: '#f97316' },
            { l: 15, t: 'God Mode', c: '#fbbf24' },
          ].map(tier => (
            <div key={tier.l} style={{ textAlign: 'center', padding: '10px 4px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${tier.c}40` }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: tier.c }}>{tier.l}</div>
              <div style={{ fontSize: '9px', color: tier.c, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: '2px' }}>{tier.t}</div>
            </div>
          ))}
        </div>

        {/* Name Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
            Your Codename
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="e.g. Roshan Teja"
            autoFocus
            style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '14px 18px', color: 'white', fontSize: '16px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={submit}
          disabled={!name.trim()}
          className="bg-gradient"
          style={{ width: '100%', padding: '15px', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 800, fontSize: '15px', cursor: name.trim() ? 'pointer' : 'not-allowed', opacity: name.trim() ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          Begin My Journey <ChevronRight size={18} />
        </button>
      </motion.div>
    </div>
  );
}



// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, loading, refreshUser } = useUser();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setLeaderboard(data) : null)
      .catch(() => {});
  }, []);

  const handleOnboardingComplete = async (name: string) => {
    await refreshUser();
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--card-border)', borderTopColor: 'var(--primary)' }} />
      <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Initialising workspace...</span>
    </div>
  );

  const levelColor = user?.levelColor || 'var(--primary)';

  return (
    <>
      {/* ── Onboarding ── */}
      {user?.isNew && <OnboardingModal onComplete={handleOnboardingComplete} />}



      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '60px' }}>

        {/* ── Header ── */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
              <div className="animate-pulse-glow" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
              System Status: Operational
            </motion.div>

            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: '40px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-1px' }}>
              Welcome back, <span className="text-gradient">{user?.name || 'Developer'}</span>
            </motion.h1>

            {/* Real XP Progress Bar */}
            <div style={{ maxWidth: '420px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={14} color={levelColor} fill={levelColor} />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: levelColor }}>Level {user?.level} — {user?.levelTitle}</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {user?.isMaxLevel ? 'MAX' : `${user?.xpIntoLevel?.toLocaleString()} / ${user?.xpNeeded?.toLocaleString()} XP`}
                </span>
              </div>
              <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden', border: `1px solid ${levelColor}30` }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${user?.progress || 0}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: `linear-gradient(90deg, ${levelColor}, ${levelColor}88)`, borderRadius: '5px', boxShadow: `0 0 12px ${levelColor}` }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>{(user?.xp || 0).toLocaleString()} total XP</span>
                {!user?.isMaxLevel && <span>{user?.xpForNextLevel?.toLocaleString()} XP for Level {(user?.level || 0) + 1}</span>}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/lessons" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient" style={{ padding: '14px 28px', borderRadius: '14px', border: 'none', color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 10px 30px var(--primary-glow)' }}>
                <Rocket size={18} /> Resume Training
              </motion.button>
            </Link>
          </div>
        </header>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <StatsCard title="Daily Streak"   value={`${user?.streak || 0} Days`}             icon={Flame}      trend={user?.streak > 0 ? `🔥 Active` : 'Start today!'} color="#f59e0b" />
          <StatsCard title="Total XP"       value={(user?.xp || 0).toLocaleString()}         icon={TrendingUp} trend={`Level ${user?.level || 1}`}   color={levelColor} />
          <StatsCard title="Current Rank"   value={user?.levelTitle || 'Initiate'}           icon={Award}      trend={`${user?.progress || 0}% to next`} color={levelColor} />
          <StatsCard title="XP to Next Lvl" value={user?.isMaxLevel ? '∞ MAX' : `${user?.xpNeeded?.toLocaleString() || 300} XP`} icon={Target} trend="Keep coding!" color="var(--accent)" />
        </div>

        {/* ── Verified Portfolio ── */}
        {user?.certifications && user.certifications.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div className="bg-gradient animate-pulse-glow" style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={16} color="white" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Verified Portfolio</h2>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--card-border) 0%, transparent 100%)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {user.certifications.map((cert: any) => (
                <div key={cert.id} className="glass-card" style={{ padding: '24px', border: '1px solid var(--card-border)', background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(59,130,246,0.05) 100%)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '80px', height: '80px', background: 'var(--primary)', opacity: 0.05, borderRadius: '50%' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '4px' }}>VERIFIED BELT</span>
                      <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'white', textTransform: 'capitalize' }}>{cert.language} {cert.belt}</h3>
                    </div>
                    <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <CheckCircle2 size={20} color="#10b981" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Status</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Mastered</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Issued</span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{new Date(cert.date).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '8px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px dashed var(--card-border)' }}>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{cert.id}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}>COPY ID</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Mastery Shortcuts ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div className="bg-gradient animate-pulse-glow" style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <div key={track.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--primary)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--primary)' }}>
                    {track.icon}
                    <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>{track.provider}</span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{track.title}</h3>
                </div>
                <a href={track.url} target="_blank" rel="noopener noreferrer">
                  <button style={{ background: '#0056D2', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,86,210,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    View on Coursera <ArrowRight size={12} />
                  </button>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── Main Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Level Roadmap */}
            <div className="glass-card" style={{ borderTop: `4px solid ${levelColor}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={18} color={levelColor} fill={levelColor} /> Level Roadmap
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { l: 3,  t: 'Coder',     xp: 800,    c: '#22c55e' },
                  { l: 5,  t: 'Engineer',  xp: 3500,   c: '#38bdf8' },
                  { l: 7,  t: 'Architect', xp: 10000,  c: '#818cf8' },
                  { l: 9,  t: 'Principal', xp: 25000,  c: '#a855f7' },
                  { l: 12, t: 'Fellow',    xp: 80000,  c: '#f97316' },
                  { l: 15, t: 'God Mode',  xp: 210000, c: '#fbbf24' },
                ].map(tier => {
                  const unlocked = (user?.xp || 0) >= tier.xp;
                  return (
                    <div key={tier.l} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', background: unlocked ? `${tier.c}10` : 'rgba(255,255,255,0.02)', border: `1px solid ${unlocked ? tier.c + '40' : 'transparent'}`, opacity: unlocked ? 1 : 0.5 }}>
                      {unlocked ? <CheckCircle2 size={16} color={tier.c} /> : <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--card-border)' }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: unlocked ? 'white' : 'var(--text-muted)' }}>Lv.{tier.l} {tier.t}</div>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: unlocked ? tier.c : 'var(--text-muted)' }}>{tier.xp.toLocaleString()} XP</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Global Leaderboard */}
            <div className="glass-card" style={{ borderTop: '4px solid #f59e0b' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="#f59e0b" /> Global Leaderboard
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {leaderboard.slice(0, 6).map((u, i) => {
                  const isMe = u.name === user?.name;
                  return (
                    <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', background: isMe ? 'rgba(56,189,248,0.1)' : 'transparent', border: isMe ? '1px solid rgba(56,189,248,0.3)' : '1px solid transparent' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, color: i < 3 ? 'white' : 'var(--text-muted)' }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: isMe ? 'var(--primary)' : 'white' }}>{u.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{(u.xp).toLocaleString()} XP</div>
                      </div>
                    </div>
                  );
                })}
                {/* Show user's own position if not in top 6 */}
                {user?.name && !leaderboard.slice(0,6).find((u: any) => u.name === user.name) && (
                  <div style={{ padding: '8px 10px', borderRadius: '10px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, color: 'var(--primary)' }}>
                      You
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>{user.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{(user.xp || 0).toLocaleString()} XP</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <SmartDocs />
          </div>
        </div>
      </div>
    </>
  );
}
