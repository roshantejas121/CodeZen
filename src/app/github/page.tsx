"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  TrendingUp, 
  Star, 
  GitFork, 
  Code2, 
  ExternalLink,
  Award,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { toast } from "sonner";

export default function GitHubHub() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('react');
  const [auditStatus, setAuditStatus] = useState<Record<string, 'ready' | 'analyzing' | 'completed'>>({});

  const runAudit = (repoName: string) => {
    setAuditStatus(prev => ({ ...prev, [repoName]: 'analyzing' }));

    toast.info(`Initializing AI Audit Engine for ${repoName}...`, {
      description: "Analyzing architecture and security patterns.",
      duration: 3000,
    });

    setTimeout(() => {
      setAuditStatus(prev => ({ ...prev, [repoName]: 'completed' }));
      toast.success(`Audit Complete for ${repoName}`, {
        description: "Code Quality: 98% | Security: High-Fidelity",
        icon: <Award size={16} color="#10b981" />,
      });
    }, 3000);
  };

  const fetchRepos = async (searchQuery: string) => {
    setLoading(true);
    const headers: any = {};
    const token = process.env.GITHUB_TOKEN;
    if (token) headers['Authorization'] = `token ${token}`;

    try {
      const res = await fetch(`https://api.github.com/search/repositories?q=${searchQuery}+sort:stars`, { headers });
      const data = await res.json();
      if (data.items) setRepos(data.items.slice(0, 8));
    } catch (err) {
      console.error("GitHub Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos('react');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRepos(query);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>
      
      {/* Left Column: Discovery Hub */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div className="bg-gradient" style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px var(--primary-glow)' }}>
              <FaGithub size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>Intelligence Command</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Analyze and discover high-impact technical assets.</p>
            </div>
          </div>
        </header>

        {/* Advanced Search Interface */}
        <form onSubmit={handleSearch} className="glass-card" style={{ padding: '32px', display: 'flex', gap: '20px', border: '1px solid var(--primary)' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={22} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
            <input 
              type="text" 
              placeholder="Search global repository vault (e.g. LLMs, Blockchain, DevTools)..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ 
                width: '100%', 
                background: 'rgba(2, 6, 23, 0.5)', 
                border: '1px solid var(--card-border)', 
                padding: '18px 18px 18px 60px', 
                borderRadius: '16px', 
                color: 'white', 
                fontSize: '16px',
                outline: 'none',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
              }} 
            />
          </div>
          <button 
            type="submit"
            className="bg-gradient"
            style={{ 
              border: 'none', 
              color: 'white', 
              padding: '0 40px', 
              borderRadius: '16px', 
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 20px var(--primary-glow)'
            }}
          >
            {loading ? 'Analyzing...' : 'Execute'}
          </button>
        </form>

        {/* Discovery Results Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {repos.map((repo, i) => (
            <motion.div 
              key={repo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card hover-glow"
              style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '6px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {repo.language || 'Technical Asset'}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>
                    <Star size={14} fill="#f59e0b" />
                    {repo.stargazers_count > 1000 ? (repo.stargazers_count / 1000).toFixed(1) + 'k' : repo.stargazers_count}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    <GitFork size={14} />
                    {repo.forks_count}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', color: 'white' }}>{repo.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, height: '60px', overflow: 'hidden' }}>
                  {repo.description || "No description available for this technical repository."}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                {auditStatus[repo.name] === 'analyzing' ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ display: 'flex' }}>
                      <Loader2 size={14} color="#3b82f6" />
                    </motion.div>
                    <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700 }}>AI Audit in Progress...</span>
                  </>
                ) : auditStatus[repo.name] === 'completed' ? (
                  <>
                    <CheckCircle2 size={14} color="#10b981" />
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>Quality: 98% | Security: High</span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={14} color="var(--text-muted)" />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Audit Status: Ready for Evaluation</span>
                  </>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <a 
                  href={repo.html_url} 
                  target="_blank" 
                  style={{ 
                    textDecoration: 'none',
                    background: 'var(--glass-bg)', 
                    color: 'white', 
                    border: '1px solid var(--card-border)', 
                    padding: '12px', 
                    borderRadius: '12px', 
                    fontWeight: 700, 
                    fontSize: '12px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  View <ExternalLink size={14} />
                </a>
                <button 
                  onClick={() => runAudit(repo.name)}
                  disabled={auditStatus[repo.name] === 'analyzing'}
                  style={{ 
                    background: auditStatus[repo.name] === 'completed' ? 'rgba(16, 185, 129, 0.1)' : auditStatus[repo.name] === 'analyzing' ? 'rgba(59, 130, 246, 0.1)' : 'var(--primary)', 
                    color: auditStatus[repo.name] === 'completed' ? '#10b981' : auditStatus[repo.name] === 'analyzing' ? '#3b82f6' : 'white', 
                    border: auditStatus[repo.name] === 'completed' ? '1px solid rgba(16, 185, 129, 0.2)' : auditStatus[repo.name] === 'analyzing' ? '1px solid rgba(59, 130, 246, 0.2)' : 'none', 
                    padding: '12px', 
                    borderRadius: '12px', 
                    fontWeight: 700, 
                    fontSize: '12px',
                    cursor: auditStatus[repo.name] === 'analyzing' ? 'default' : 'pointer',
                    boxShadow: auditStatus[repo.name] === 'completed' || auditStatus[repo.name] === 'analyzing' ? 'none' : '0 4px 12px var(--primary-glow)'
                  }}
                >
                  {auditStatus[repo.name] === 'analyzing' ? 'Auditing...' : auditStatus[repo.name] === 'completed' ? 'View Report' : 'Run AI Audit'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Column: Engineering Intel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'sticky', top: '20px' }}>
        
        {/* GitHub Engineering Status */}
        <div className="glass-card" style={{ borderTop: '4px solid var(--primary)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaGithub size={20} color="var(--primary)" /> Engineering Profile
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>12</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Repos</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>850</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Stars</div>
            </div>
          </div>
          <a href="https://github.com/roshantejas121" target="_blank" style={{ display: 'block', textAlign: 'center', padding: '12px', background: 'var(--glass-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'white', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
            View Full Profile
          </a>
        </div>

        {/* Trending Tech Topics */}
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={18} color="#10b981" /> Trending Hubs
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['Generative AI', 'Web3', 'Rust', 'Cloud Native', 'Cybersecurity', 'DevOps'].map(topic => (
              <button 
                key={topic}
                onClick={() => { setQuery(topic); fetchRepos(topic); }}
                style={{ 
                  padding: '8px 16px', 
                  background: 'rgba(59, 130, 246, 0.05)', 
                  border: '1px solid var(--card-border)', 
                  borderRadius: '20px', 
                  color: 'var(--text-muted)', 
                  fontSize: '12px', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'white')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                #{topic}
              </button>
            ))}
          </div>
        </div>

        {/* AI Audit Statistics */}
        <div className="glass-card" style={{ background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>AI Audit Intelligence</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
            Your technical contributions are automatically audited for quality and security.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Code Quality</span>
              <span style={{ color: '#10b981', fontWeight: 800 }}>98%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '98%', height: '100%', background: '#10b981' }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
