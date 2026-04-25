"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Medal, Crown, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data));
  }, []);

  if (!mounted) return null;

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <header style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div className="bg-gradient" style={{ padding: '16px', borderRadius: '50%', boxShadow: '0 0 30px var(--primary-glow)' }}>
            <Trophy size={48} color="white" />
          </div>
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '8px' }}>Top Performers</h1>
        <p style={{ color: 'var(--text-muted)' }}>Compete with the world's best developers and rise to the top.</p>
      </header>

      {/* Podium Section */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', height: '300px', marginBottom: '40px' }}>
        {/* 2nd Place */}
        {topThree[1] && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '200px' }}
            className="glass-card" 
            style={{ width: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', borderColor: '#94a3b8' }}
          >
            <div style={{ position: 'relative' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {topThree[1].name[0]}
              </div>
              <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#94a3b8', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>2</div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>{topThree[1].name}</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{topThree[1].xp.toLocaleString()} XP</span>
          </motion.div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '280px' }}
            className="glass-card bg-gradient" 
            style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'white' }}
          >
            <Crown size={32} style={{ marginBottom: '-10px' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800 }}>
                {topThree[0].name[0]}
              </div>
              <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#f59e0b', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800 }}>1</div>
            </div>
            <span style={{ fontWeight: 800, fontSize: '18px' }}>{topThree[0].name}</span>
            <span style={{ opacity: 0.9, fontWeight: 700 }}>{topThree[0].xp.toLocaleString()} XP</span>
          </motion.div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '160px' }}
            className="glass-card" 
            style={{ width: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', borderColor: '#b45309' }}
          >
            <div style={{ position: 'relative' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {topThree[2].name[0]}
              </div>
              <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#b45309', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>3</div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>{topThree[2].name}</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{topThree[2].xp.toLocaleString()} XP</span>
          </motion.div>
        )}
      </div>

      {/* List View */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {others.map((u, i) => (
          <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderBottom: i !== others.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
            <span style={{ width: '30px', fontWeight: 700, color: 'var(--text-muted)' }}>{i + 4}</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {u.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600 }}>{u.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}>
              <TrendingUp size={16} />
              {u.xp.toLocaleString()} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
