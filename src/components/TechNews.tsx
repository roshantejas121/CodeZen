"use client";

import React, { useState, useEffect } from "react";
import { Newspaper, ExternalLink, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function TechNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Newspaper size={20} color="var(--primary)" />
          Tech Daily
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>Live Feed</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {news.map((item) => (
          <a 
            key={item.id} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid var(--card-border)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{item.category}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {item.time}
                </span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.4 }} className="hover-primary">{item.title}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.source}</span>
                <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </a>
        ))}
      </div>

      <a href="https://dev.to" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <button style={{ 
          width: '100%', 
          background: 'var(--glass-bg)', 
          border: '1px solid var(--card-border)', 
          padding: '10px', 
          borderRadius: '8px', 
          color: 'var(--text-main)', 
          fontSize: '13px', 
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'var(--transition)'
        }}>
          View All Tech News
        </button>
      </a>
    </div>
  );
}
