"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  Search, 
  Filter, 
  ExternalLink, 
  Star, 
  GitFork,
  Zap,
  User
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { toast } from "sonner";

export default function ProjectLab() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('facebook'); // Default placeholder, user can change
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUserRepos('facebook'); // Initial fetch
  }, []);

  const fetchUserRepos = async (user: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=6`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setRepos(data);
      } else {
        toast.error("User not found or API limit reached");
      }
    } catch (err) {
      toast.error("Failed to fetch GitHub projects");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Project Lab</h1>
          <p style={{ color: 'var(--text-muted)' }}>Analyze real GitHub repositories and turn them into learning projects.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Enter GitHub Username..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUserRepos(username)}
              style={{ 
                background: 'var(--glass-bg)', 
                border: '1px solid var(--card-border)', 
                padding: '10px 10px 10px 40px', 
                borderRadius: '10px', 
                color: 'white',
                outline: 'none',
                width: '250px'
              }} 
            />
          </div>
          <button 
            onClick={() => fetchUserRepos(username)}
            style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
          >
            Fetch Projects
          </button>
        </div>
      </header>

      {/* Project Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        {loading ? (
          <div style={{ color: 'white' }}>Analyzing GitHub repositories...</div>
        ) : (
          repos.map((repo) => (
            <motion.div 
              key={repo.id}
              whileHover={{ y: -10 }}
              className="glass-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
                    <Code2 size={24} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', background: 'rgba(59, 130, 246, 0.05)', padding: '4px 12px', borderRadius: '20px' }}>
                    {repo.language || 'Code'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: 'var(--accent)', fontWeight: 700 }}>
                  <Zap size={14} /> 500 XP
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{repo.name}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {repo.description || "No description provided for this repository."}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} /> {repo.stargazers_count}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GitFork size={14} /> {repo.forks_count}</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <Link href={`/projects/${repo.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <button style={{ 
                    width: '100%', 
                    background: 'var(--primary)', 
                    border: 'none', 
                    padding: '12px', 
                    borderRadius: '10px', 
                    color: 'white', 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px var(--primary-glow)'
                  }}>
                    Start Learning <ExternalLink size={16} />
                  </button>
                </Link>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ padding: '12px', borderRadius: '10px', background: 'var(--glass-bg)', border: '1px solid var(--card-border)', color: 'white' }}>
                  <FaGithub size={20} />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
