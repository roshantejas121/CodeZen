"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Home, ChevronRight, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'transparent',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 10 }}
          style={{ 
            width: '120px', 
            height: '120px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: '32px', 
            margin: '0 auto 32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            boxShadow: '0 0 40px rgba(239, 68, 68, 0.2)'
          }}
        >
          <AlertCircle size={60} color="#ef4444" />
        </motion.div>

        <h1 style={{ fontSize: '120px', fontWeight: 900, lineHeight: 1, marginBottom: '16px', background: 'linear-gradient(to bottom, #fff, #64748b)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          404
        </h1>
        
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>Target Not Found</h2>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px' }}>
          The architectural module you are looking for has been moved, archived, or never existed in this dimension.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button className="bg-gradient" style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Home size={18} /> Return to Base
            </button>
          </Link>
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--card-border)', color: 'white', padding: '14px 32px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <Search size={18} /> Search System
          </button>
        </div>

        <div style={{ marginTop: '60px', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Popular Destinations
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
            <Link href="/bootcamp" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Bootcamp</Link>
            <Link href="/academy" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Academy</Link>
            <Link href="/github" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>GitHub Hub</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
