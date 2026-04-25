"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, Sparkles, Zap, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const suggestions = [
  { 
    title: "Understanding React Server Components", 
    description: "Learn how to fetch data directly on the server without client-side overhead.",
    tag: "Next.js 15",
    level: "Advanced",
    time: "8 min"
  },
  { 
    title: "Mastering CSS Grid Layouts", 
    description: "A complete guide to building complex, responsive layouts with ease.",
    tag: "CSS",
    level: "Intermediate",
    time: "12 min"
  },
  { 
    title: "TypeScript Generics Explained", 
    description: "Write reusable, type-safe components using generics.",
    tag: "TypeScript",
    level: "Advanced",
    time: "15 min"
  }
];

export function SmartDocs() {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--primary)" />
          Contextual Learning
        </h3>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--glass-bg)', padding: '4px 8px', borderRadius: '4px' }}>
          Based on your code
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {suggestions.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02, x: 5 }}
            className="glass-card"
            style={{ 
              padding: '16px', 
              background: 'rgba(0,0,0,0.2)', 
              cursor: 'pointer',
              border: '1px solid var(--card-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                {item.tag} • {item.level}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.time}</span>
            </div>
            
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{item.title}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {item.description}
              </p>
            </div>

            <Link href="/academy" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}>
                Start Tutorial <ChevronRight size={14} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <button style={{ 
        width: '100%', 
        background: 'var(--primary)', 
        border: 'none', 
        padding: '12px', 
        borderRadius: '8px', 
        color: 'white', 
        fontSize: '14px', 
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        boxShadow: '0 10px 20px var(--primary-glow)'
      }}>
        <Zap size={16} /> Get Suggestions for Current Code
      </button>
    </div>
  );
}
