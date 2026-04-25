"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, color = "var(--primary)" }: StatsCardProps) {
  return (
    <motion.div 
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ flex: 1, minWidth: '240px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ 
          background: `rgba(${color === 'var(--primary)' ? '59, 130, 246' : '168, 85, 247'}, 0.1)`,
          padding: '12px',
          borderRadius: '12px',
          color: color
        }}>
          <Icon size={24} />
        </div>
        {trend && (
          <span style={{ 
            fontSize: '12px', 
            fontWeight: 600, 
            color: trend.startsWith('+') ? '#10b981' : '#ef4444',
            background: trend.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            padding: '4px 8px',
            borderRadius: '20px'
          }}>
            {trend}
          </span>
        )}
      </div>
      <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>{title}</h3>
      <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'Outfit' }}>{value}</div>
    </motion.div>
  );
}

export function ProgressCard({ title, progress, icon: Icon }: { title: string, progress: number, icon: LucideIcon }) {
  return (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ background: 'var(--glass-bg)', padding: '12px', borderRadius: '12px' }}>
        <Icon size={24} color="var(--primary)" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{title}</span>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{progress}%</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '4px' }}
          />
        </div>
      </div>
    </div>
  );
}
