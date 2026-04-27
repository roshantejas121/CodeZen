"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Flame, 
  Rocket, 
  Target, 
  ShieldCheck, 
  ChevronRight,
  Star,
  Clock,
  Layout,
  Code2
} from "lucide-react";
import Link from "next/link";

const BOOTCAMP_PHASES = [
  {
    id: 1,
    title: "The Initiation",
    duration: "Week 1",
    desc: "Master the fundamental syntax of your primary stack. Build core logic and understand memory management.",
    milestones: ["Complete Level 1 Academy", "Obtain White Belt", "Pass 5 Daily Drills"],
    color: "#94a3b8"
  },
  {
    id: 2,
    title: "Structural Mastery",
    duration: "Week 2",
    desc: "Dive deep into data structures, algorithms, and system architecture. Design for scale.",
    milestones: ["Finish Algorithm Track", "Deploy First Project Lab App", "Level 4 Reached"],
    color: "#38bdf8"
  },
  {
    id: 3,
    title: "Elite Engineering",
    duration: "Week 3",
    desc: "Master professional tools: Docker, Kubernetes, CI/CD, and Cloud Native design patterns.",
    milestones: ["Obtain Blue Belt", "Complete DevOps Certification", "10 Day Streak"],
    color: "#818cf8"
  },
  {
    id: 4,
    title: "Production Legend",
    duration: "Week 4",
    desc: "Final capstone phase. Security auditing, performance profiling, and open-source contributions.",
    milestones: ["Level 10 reached", "Black Belt Mastered", "Published to GitHub Hub"],
    color: "#f59e0b"
  }
];

export default function BootcampPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Hero Section */}
      <header style={{ marginBottom: '60px', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient"
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            margin: '0 auto 24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 20px 40px var(--primary-glow)'
          }}
        >
          <Flame size={40} color="white" fill="white" />
        </motion.div>
        
        <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-2px' }}>
          CodeZen Elite Bootcamp
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          A high-intensity, 30-day architectural roadmap designed to transform initiates into world-class engineers.
        </p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '60px' }}>
        {[
          { label: 'Intensity', val: 'Elite', icon: Rocket, color: '#ef4444' },
          { label: 'Duration', val: '30 Days', icon: Clock, color: '#38bdf8' },
          { label: 'Focus', val: 'Production', icon: Target, color: '#10b981' },
          { label: 'Validation', val: 'Certified', icon: ShieldCheck, color: '#f59e0b' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--card-border)' }}>
            <stat.icon size={24} color={stat.color} style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{stat.val}</div>
          </div>
        ))}
      </div>

      {/* Roadmap Phase List */}
      <div className="perspective-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
        {/* Connection Line */}
        <div style={{ position: 'absolute', left: '40px', top: '40px', bottom: '40px', width: '2px', background: 'linear-gradient(180deg, var(--primary) 0%, transparent 100%)', zIndex: 0 }} />

        {BOOTCAMP_PHASES.map((phase, idx) => (
          <motion.div
            key={phase.id}
            initial={{ x: -20, opacity: 0, rotateY: -5 }}
            whileInView={{ x: 0, opacity: 1, rotateY: 0 }}
            whileHover={{ scale: 1.02, rotateX: 2, translateZ: 20 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
            className="glass-card premium-3d-card"
            style={{ 
              marginLeft: '80px', 
              padding: '32px', 
              display: 'grid', 
              gridTemplateColumns: '1fr 300px', 
              gap: '40px', 
              position: 'relative',
              border: '1px solid var(--card-border)',
              background: `linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Phase Indicator */}
            <div style={{ 
              position: 'absolute', 
              left: '-58px', 
              top: '32px', 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              background: phase.color, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '4px solid var(--background)',
              boxShadow: `0 0 20px ${phase.color}66`,
              zIndex: 1
            }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '14px' }}>{phase.id}</span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: phase.color, textTransform: 'uppercase', letterSpacing: '1px', background: `${phase.color}15`, padding: '4px 10px', borderRadius: '6px' }}>
                  {phase.duration}
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{phase.title}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                {phase.desc}
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {phase.milestones.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: phase.color }} />
                    {m}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Associated Modules
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/academy" style={{ textDecoration: 'none' }}>
                  <div className="hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontSize: '13px', fontWeight: 600 }}>
                    <Layout size={14} color="var(--primary)" /> Academy Core
                    <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                  </div>
                </Link>
                <Link href="/dojo" style={{ textDecoration: 'none' }}>
                  <div className="hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontSize: '13px', fontWeight: 600 }}>
                    <Code2 size={14} color="#f59e0b" /> Weapon Training
                    <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <footer style={{ marginTop: '80px', textAlign: 'center', padding: '60px', background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', borderRadius: '32px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>Ready to Begin Your Descent?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
          This path is not for everyone. It requires discipline, grit, and 30 days of absolute focus.
        </p>
        <Link href="/academy">
          <button className="bg-gradient" style={{ padding: '16px 40px', borderRadius: '14px', border: 'none', color: 'white', fontWeight: 800, fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 30px var(--primary-glow)' }}>
            Start Phase 1: The Initiation
          </button>
        </Link>
      </footer>

    </div>
  );
}
