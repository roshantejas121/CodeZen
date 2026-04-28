"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Clock, Shield } from "lucide-react";
import Link from "next/link";

export function ProblemCard({ problem }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
      className="glass-card"
      style={{ padding: '24px', border: '1px solid var(--card-border)', cursor: 'pointer' }}
    >
      <Link href={`/problems/${problem._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {problem.tags.map((tag: string) => (
              <span key={tag} style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
          <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 800 }}>{problem.difficulty.toUpperCase()}</span>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '12px' }}>{problem.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {problem.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900 }}>
              {problem.authorId.username[0].toUpperCase()}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>{problem.authorId.username}</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              <Clock size={14} /> 2h ago
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
