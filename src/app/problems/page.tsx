"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter, Zap } from "lucide-react";
import { ProblemCard } from "@/components/ProblemCard";
import Link from "next/link";

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async (searchQuery = "") => {
    setLoading(true);
    const res = await fetch(`/api/problems${searchQuery ? `?query=${searchQuery}` : ""}`);
    const data = await res.json();
    setProblems(data);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
      
      {/* Search & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} className="animate-pulse" />
            <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>System Ready: Nodes Online</span>
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-1px' }}>Global Hub</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Expert-led problems, AI-ranked solutions, and professional reputation.</p>
        </div>
        <Link href="/problems/new">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient"
            style={{ padding: '16px 32px', borderRadius: '14px', border: 'none', color: 'white', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <Plus size={20} /> Post New Problem
          </motion.button>
        </Link>
      </div>

      <div className="glass-card" style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', border: '1px solid var(--card-border)' }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search by title, technology, or keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchProblems(query)}
          style={{ flex: 1, background: 'transparent', border: 'none', padding: '16px 0', color: 'white', fontSize: '16px', outline: 'none' }}
        />
        <button onClick={() => fetchProblems(query)} style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
          Search
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '40px', height: '40px', border: '3px solid #333', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
          {problems.map((p: any) => (
            <ProblemCard key={p._id} problem={p} />
          ))}
        </div>
      )}

      {!loading && problems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <Zap size={48} color="#333" style={{ marginBottom: '20px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: 800 }}>No problems found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try a different search or be the first to post one.</p>
        </div>
      )}
    </div>
  );
}
