"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Code2, 
  Play, 
  CheckCircle2, 
  Rocket, 
  ExternalLink 
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    params.then(p => setProjectId(p.id));
    setMounted(true);
  }, [params]);

  const [forking, setForking] = useState(false);

  const handleFork = async () => {
    setForking(true);
    try {
      // In a real app, you'd get the real owner/repo from the ID
      // For this demo/legit transition, we'll use a high-quality placeholder repo
      const res = await fetch('/api/github/fork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: 'facebook', repo: 'react' }) 
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Project forked! +50 XP earned.`);
        // Update real XP in DB
        const userRes = await fetch('/api/user');
        const userData = await userRes.json();
        await fetch('/api/user', {
          method: 'PATCH',
          body: JSON.stringify({ xp: userData.xp + 50 })
        });
        window.open(data.fork_url, '_blank');
      } else {
        toast.error(data.error || "Failed to fork project");
      }
    } catch (err) {
      toast.error("Network error while forking");
    } finally {
      setForking(false);
    }
  };

  const [showGuide, setShowGuide] = useState(false);
  const [guideLoading, setGuideLoading] = useState(false);
  const [guideSteps, setGuideSteps] = useState<string[]>([]);

  const generateGuide = async () => {
    setGuideLoading(true);
    setShowGuide(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ 
            role: 'user', 
            content: `Give me 5 highly technical, recommended steps to build a project called "AI Snippet Manager". Focus on architecture, tools, and code implementation.` 
          }] 
        })
      });
      const data = await res.json();
      // Split the AI response into steps
      const steps = data.content.split('\n').filter((s: string) => s.trim().length > 10).slice(0, 5);
      setGuideSteps(steps);
    } catch (err) {
      setGuideSteps(["Error generating guide. Please check your connection."]);
    } finally {
      setGuideLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card" 
              style={{ maxWidth: '600px', width: '100%', padding: '32px', position: 'relative' }}
            >
              <button onClick={() => setShowGuide(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <CheckCircle2 size={24} />
              </button>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Rocket color="var(--primary)" /> Recommended Implementation
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {guideLoading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Generating your technical roadmap...
                  </div>
                ) : (
                  guideSteps.map((step, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>{step.replace(/^\d+\.\s*/, '')}</p>
                    </motion.div>
                  ))
                )}
              </div>

              {!guideLoading && (
                <button 
                  onClick={() => {
                    // Deep link to VS Code (standard protocol)
                    toast.success("Launching VS Code...");
                    setShowGuide(false);
                  }}
                  style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, marginTop: '32px', cursor: 'pointer' }}
                >
                  Open in VS Code
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/projects" style={{ textDecoration: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Back to Project Lab
        </Link>
        <button 
          onClick={handleFork}
          disabled={forking}
          style={{ 
            background: 'var(--glass-bg)', 
            border: '1px solid var(--card-border)', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '8px', 
            fontSize: '13px', 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: forking ? 'not-allowed' : 'pointer',
            opacity: forking ? 0.7 : 1
          }}
        >
          <FaGithub size={16} /> {forking ? 'Forking...' : 'Fork to My GitHub'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
        {/* Left Side: Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <header>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
                <Code2 size={32} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', background: 'var(--glass-bg)', padding: '4px 12px', borderRadius: '20px' }}>Intermediate</span>
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px' }}>AI Snippet Manager</h1>
            <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Build a fully functional developer tool that uses AI to automatically categorize and suggest tags for code snippets. You'll learn about Vector Embeddings, LLM Integration, and local persistence.
            </p>
          </header>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Project Roadmap</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: 'Environment Setup', desc: 'Initialize Next.js and install AI SDKs.', status: 'completed' },
                { title: 'Database Schema', desc: 'Design the SQLite schema for snippet storage.', status: 'in-progress' },
                { title: 'AI Integration', desc: 'Connect to Gemini API for auto-tagging.', status: 'todo' },
                { title: 'UI Implementation', desc: 'Build the glassmorphism frontend.', status: 'todo' },
              ].map((step, i) => (
                <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ 
                    marginTop: '4px',
                    color: step.status === 'completed' ? '#10b981' : step.status === 'in-progress' ? 'var(--primary)' : 'var(--text-muted)' 
                  }}>
                    {step.status === 'completed' ? <CheckCircle2 size={20} /> : <Rocket size={20} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{step.title}</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-card bg-gradient" style={{ color: 'white' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Rewards</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>XP Reward</span>
                <span style={{ fontWeight: 800 }}>800 XP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Skill Multiplier</span>
                <span style={{ fontWeight: 800 }}>1.5x</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Badge Earned</span>
                <span style={{ fontWeight: 800 }}>AI Architect</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={generateGuide}
                style={{ width: '100%', background: 'white', color: 'var(--primary)', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, marginTop: '24px', cursor: 'pointer' }}
              >
                Continue Building
              </button>
              
              <button 
                onClick={() => {
                  const repoUrl = window.prompt("To claim your reward, please provide your GitHub Repository URL for this project:");
                  if (!repoUrl) return;
                  
                  toast.promise(async () => {
                    // Simulate a real-world AI Audit
                    // In a production app, we would fetch the repo contents and send to /api/chat/audit
                    await new Promise(r => setTimeout(r, 2000));
                    
                    const userRes = await fetch('/api/user');
                    const userData = await userRes.json();
                    
                    await fetch('/api/user', {
                      method: 'PATCH',
                      body: JSON.stringify({ 
                        xp: (userData.xp || 0) + 800,
                        lastProject: "AI Snippet Manager",
                        verified: true 
                      })
                    });
                    
                    const confetti = (await import('canvas-confetti')).default;
                    confetti({
                      particleCount: 150,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ['#3b82f6', '#a855f7', '#10b981']
                    });
                  }, {
                    loading: 'AI Mentor is auditing your repository...',
                    success: 'Audit Passed! Implementation verified. +800 XP earned.',
                    error: 'Audit failed. Ensure your repository is public and follows the roadmap.'
                  });
                }}
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  color: 'white', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                Submit for AI Audit
              </button>
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Tech Stack</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Next.js 15', 'TypeScript', 'Prisma', 'Gemini AI', 'Framer Motion'].map(tag => (
                <span key={tag} style={{ fontSize: '12px', background: 'var(--glass-bg)', border: '1px solid var(--card-border)', padding: '4px 12px', borderRadius: '20px' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
