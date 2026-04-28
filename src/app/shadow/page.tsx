"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  Terminal, 
  Zap, 
  Timer, 
  ChevronRight,
  ShieldCheck,
  Globe,
  Activity,
  Lock,
  ExternalLink,
  Cpu
} from "lucide-react";
import { LiveEditor } from "@/components/LiveEditor";
import { toast } from "sonner";

const SHADOW_DRILLS = [
  {
    id: "redis-distributed-lock",
    title: "Infra: Distributed Locking Mechanism",
    difficulty: "Elite",
    xpReward: 3500,
    timeLimit: "25:00",
    impact: "2.4M Transactions/hr",
    location: "Frankfurt, DE",
    description: "Our payment gateway is processing duplicate transactions due to race conditions across multiple microservices. Implement a robust distributed lock using Redis with a fail-safe TTL and atomic acquisition.",
    vulnerability: "Distributed Race Condition / Double Spend",
    initialCode: "async function processPayment(txnId) {\n    // Acquire lock here to prevent race conditions\n    const lockKey = `lock:txn:${txnId}`;\n    \n    // TODO: Implement atomic lock acquisition with TTL\n    const acquired = false;\n\n    if (acquired) {\n        try {\n            await executeTransaction(txnId);\n        } finally {\n            // TODO: Release lock safely\n        }\n    }\n}",
    hint: "Use 'SET key value NX PX 30000'. Ensure you release only if you still own the lock.",
    language: "javascript"
  },
  {
    id: "api-rate-limiter",
    title: "Security: Sliding Window Rate Limiter",
    difficulty: "Advanced",
    xpReward: 2200,
    timeLimit: "15:00",
    impact: "150K req/sec",
    location: "Singapore, SG",
    description: "The Auth API is under a credential stuffing attack. Implement a precision sliding window rate limiter to restrict users to 5 attempts per minute with zero burst overflow.",
    vulnerability: "API Abuse / Brute Force",
    initialCode: "class RateLimiter {\n    async canRequest(userId) {\n        const now = Date.now();\n        const window = 60000;\n        \n        // TODO: Implement sliding window logic\n        return true;\n    }\n}",
    hint: "Using a Redis Sorted Set (ZSET) with ZREMRANGEBYSCORE is the most accurate approach.",
    language: "javascript"
  }
];

const LIVE_INCIDENTS = [
  { id: 1, type: "DDoS", target: "Fintech API", location: "New York", status: "CRITICAL" },
  { id: 2, type: "BREACH", target: "HealthSync DB", location: "London", status: "ACTIVE" },
  { id: 3, type: "EXPLOIT", target: "CloudGate v2", location: "Tokyo", status: "NEUTRALIZED" },
  { id: 4, type: "OOM", target: "ScaleNode cluster", location: "San Francisco", status: "CRITICAL" },
];

export default function ShadowDrillsPage() {
  const [activeDrill, setActiveDrill] = useState(SHADOW_DRILLS[0]);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isCompleted, setIsCompleted] = useState(false);
  const [incidents, setIncidents] = useState(LIVE_INCIDENTS);

  // Simulate live incident updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents(prev => {
        const newIncident = {
          id: Date.now(),
          type: ["RCE", "SQLi", "XSS", "LEAK"][Math.floor(Math.random() * 4)],
          target: ["AuthServer", "PaymentHub", "UserData", "CDN"][Math.floor(Math.random() * 4)],
          location: ["Mumbai", "Seoul", "Paris", "Austin"][Math.floor(Math.random() * 4)],
          status: "DETECTED"
        };
        return [newIncident, ...prev.slice(0, 3)];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState("");

  const handleVerify = () => {
    setIsSubmitting(true);
    
    setSubmissionStep("Running stress tests...");
    setTimeout(() => {
      setSubmissionStep("Performing security audit...");
      setTimeout(() => {
        setSubmissionStep("Syncing to Global Portfolio...");
        setTimeout(() => {
          setIsCompleted(true);
          setIsSubmitting(false);
          setSubmissionStep("");
          toast.success("Critical Infrastructure Patched & Uploaded to Portfolio!");
          
          // Logic to 'persist' this to the user's global portfolio would go here
          // For now we simulate the automated integration
        }, 2000);
      }, 1500);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Dynamic Header */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', marginBottom: '8px' }}>
            <Activity size={24} className="animate-pulse" />
            <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px' }}>Global Threat Level: High</span>
            <div style={{ marginLeft: '20px', padding: '2px 10px', borderRadius: '40px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '10px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', whiteSpace: 'nowrap', width: '300px' }}>
              <span style={{ fontWeight: 900 }}>INTAKE:</span>
              <motion.div 
                animate={{ x: [-300, 300] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ fontWeight: 600 }}
              >
                New critical vulnerability detected in AWS Lambda middleware... Analyzing for Shadow Ops...
              </motion.div>
            </div>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-1px' }}>Shadow Ops <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '24px' }}>/ terminal v4.2</span></h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '16px' }}>Automated problem discovery & global portfolio integration active.</p>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '12px 24px', border: '1px solid #ef444440' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Session Timer</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: timeLeft < 300 ? '#ef4444' : 'white', fontFamily: 'monospace' }}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '12px 24px', border: '1px solid var(--primary)' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Agents</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary)', fontFamily: 'monospace' }}>
              1,248
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '40px' }}>
        
        {/* Main Interface */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '40px', border: '1px solid var(--card-border)', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 20, right: 20, opacity: 0.1 }}>
              <Globe size={120} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 }}>LIVE EXPLOIT</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>ID: {activeDrill.id}</span>
                </div>
                <h2 style={{ fontSize: '32px', fontWeight: 900 }}>{activeDrill.title}</h2>
              </div>
              <span style={{ background: '#ef444420', color: '#ef4444', padding: '6px 16px', borderRadius: '24px', fontSize: '13px', fontWeight: 800 }}>
                {activeDrill.difficulty}
              </span>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '16px', marginBottom: '32px', maxWidth: '80%' }}>{activeDrill.description}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: '8px' }}>Global Impact</div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>{activeDrill.impact}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '8px' }}>Primary Cluster</div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>{activeDrill.location}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>Bounty</div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>{activeDrill.xpReward} XP</div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: '450px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
            <LiveEditor initialCode={activeDrill.initialCode} language={(activeDrill as any).language || "javascript"} hideSelector />
          </div>

          <button 
            onClick={handleVerify}
            disabled={isSubmitting || isCompleted}
            className="bg-gradient" 
            style={{ 
              width: '100%', padding: '24px', borderRadius: '18px', border: 'none', color: 'white', fontWeight: 900, fontSize: '18px', 
              cursor: (isSubmitting || isCompleted) ? 'not-allowed' : 'pointer', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', 
              boxShadow: '0 20px 40px rgba(239, 68, 68, 0.2)',
              opacity: (isSubmitting || isCompleted) ? 0.8 : 1
            }}
          >
            {isSubmitting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Activity size={24} />
              </motion.div>
            ) : isCompleted ? (
              <ShieldCheck size={24} />
            ) : (
              <Terminal size={24} />
            )}
            {isSubmitting ? submissionStep : isCompleted ? "Solution Uploaded to Global Feed" : "Verify & Automate Portfolio Upload"}
          </button>
        </div>

        {/* Live Intel Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card" style={{ padding: '28px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
              <Activity size={18} /> Global Incident Feed
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AnimatePresence mode="popLayout">
                {incidents.map((inc, i) => (
                  <motion.div 
                    key={inc.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1 - i * 0.2, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{ fontSize: '13px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: `3px solid ${inc.status === 'CRITICAL' ? '#ef4444' : '#38bdf8'}` }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 900, color: 'white' }}>{inc.type} @ {inc.location}</span>
                      <span style={{ fontSize: '10px', color: inc.status === 'CRITICAL' ? '#ef4444' : 'var(--text-muted)' }}>{inc.status}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>Target: {inc.target}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button style={{ width: '100%', marginTop: '20px', padding: '10px', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-muted)', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <ExternalLink size={14} /> View Global Threat Map
            </button>
          </div>

          <div className="glass-card" style={{ padding: '28px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px' }}>Active Mission Log</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SHADOW_DRILLS.map(drill => (
                <div key={drill.id} onClick={() => setActiveDrill(drill)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '14px', background: activeDrill.id === drill.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0,0,0,0.2)', cursor: 'pointer', border: `1px solid ${activeDrill.id === drill.id ? 'var(--primary)' : 'transparent'}`, transition: 'all 0.3s' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: activeDrill.id === drill.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)' }}>
                    {activeDrill.id === drill.id ? <Cpu size={16} color="white" /> : <Lock size={16} color="var(--text-muted)" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{drill.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{drill.location} • {drill.xpReward} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '28px', border: '1px solid #10b98140', background: 'rgba(16, 185, 129, 0.03)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} /> Encryption Key Hint
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{activeDrill.hint}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
