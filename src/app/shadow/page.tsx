"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  Terminal, 
  Zap, 
  Timer, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Lock
} from "lucide-react";
import { LiveEditor } from "@/components/LiveEditor";
import { toast } from "sonner";

const SHADOW_DRILLS = [
  {
    id: "log4j-patch",
    title: "Zero-Day: Log4Shell Remediation",
    difficulty: "Elite",
    xpReward: 2500,
    timeLimit: "15:00",
    description: "A critical RCE vulnerability has been detected in the logger. Implement a context-aware lookup filter to sanitize input before it reaches the formatting engine.",
    vulnerability: "Log4j JNDI Lookup Injection",
    initialCode: "public class Logger {\n    public void log(String msg) {\n        // Vulnerable JNDI lookup follows:\n        System.out.println(\"Logging: \" + msg);\n    }\n}",
    hint: "Intercept '${jndi:' patterns and return a sanitized string."
  },
  {
    id: "sql-injection",
    title: "Shadow Drill: SQL Sanitization",
    difficulty: "Advanced",
    xpReward: 1500,
    timeLimit: "10:00",
    description: "An attacker is attempting to bypass authentication using UNION based injection. Rewrite the raw query using prepared statements.",
    vulnerability: "Classic SQL Injection",
    initialCode: "String query = \"SELECT * FROM users WHERE id = '\" + inputId + \"'\";",
    hint: "Use PreparedStatement placeholders (?) instead of string concatenation."
  }
];

export default function ShadowDrillsPage() {
  const [activeDrill, setActiveDrill] = useState(SHADOW_DRILLS[0]);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = () => {
    toast.info("Analyzing security posture...");
    setTimeout(() => {
      setIsCompleted(true);
      toast.success("Security Patch Verified! +2500 XP");
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Header */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', marginBottom: '8px' }}>
            <ShieldAlert size={24} className="animate-pulse" />
            <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Emergency Response Active</span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 900 }}>Shadow Drills</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Fix real-world vulnerabilities before the 24-hour window closes.</p>
        </div>

        <div className="glass-card" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #ef444440' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Remaining</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: timeLeft < 300 ? '#ef4444' : 'white', fontFamily: 'monospace' }}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <Timer size={32} color={timeLeft < 300 ? '#ef4444' : 'var(--text-muted)'} />
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
        
        {/* Main Work Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '32px', border: '1px solid var(--card-border)', background: 'rgba(239, 68, 68, 0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{activeDrill.title}</h2>
              <span style={{ background: '#ef444420', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>
                {activeDrill.difficulty}
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '24px' }}>{activeDrill.description}</p>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: '8px' }}>Target Vulnerability</div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{activeDrill.vulnerability}</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>XP Reward</div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{activeDrill.xpReward} XP</div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: '400px' }}>
            <LiveEditor initialCode={activeDrill.initialCode} language="java" hideSelector />
          </div>

          <button 
            onClick={handleVerify}
            className="bg-gradient" 
            style={{ width: '100%', padding: '20px', borderRadius: '14px', border: 'none', color: 'white', fontWeight: 900, fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(239, 68, 68, 0.2)' }}
          >
            {isCompleted ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
            {isCompleted ? "Security Verified" : "Deploy Security Patch"}
          </button>
        </div>

        {/* Sidebar: Intelligence & Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={16} color="var(--primary)" /> Intel Feed
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
                <span style={{ fontWeight: 800, color: 'white' }}>ATTACKER:</span> Multiple JNDI lookups detected from 192.168.1.1
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                <span style={{ fontWeight: 800, color: 'white' }}>SYSTEM:</span> Sanitizer interceptor engaged. Waiting for manual patch.
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>Archived Threats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SHADOW_DRILLS.map(drill => (
                <div key={drill.id} onClick={() => setActiveDrill(drill)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: activeDrill.id === drill.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent', cursor: 'pointer', border: activeDrill.id === drill.id ? '1px solid var(--primary)' : '1px solid transparent', transition: 'all 0.2s' }}>
                  {activeDrill.id === drill.id ? <Zap size={14} color="var(--primary)" /> : <Lock size={14} color="var(--text-muted)" />}
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{drill.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px', border: '1px solid #10b98120', background: 'rgba(16, 185, 129, 0.02)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>Tactical Hint</h3>
            <p style={{ fontSize: '13px', color: 'rgba(16, 185, 129, 0.8)', lineHeight: 1.5 }}>{activeDrill.hint}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
