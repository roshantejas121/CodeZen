"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Code2, 
  Trophy, 
  Settings, 
  LogOut,
  Zap,
  Book,
  Search
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Book, label: "Academy", href: "/academy" },
  { icon: BookOpen, label: "Certifications", href: "/lessons" },
  { icon: Code2, label: "Project Lab", href: "/projects" },
  { icon: FaGithub, label: "GitHub Hub", href: "/github" },
  { icon: Zap, label: "DOJO Workouts", href: "/dojo" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass" style={{ 
      height: '100vh', 
      position: 'sticky', 
      top: 0, 
      display: 'flex', 
      flexDirection: 'column',
      padding: '32px 20px',
      borderRight: '1px solid var(--card-border)',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', paddingLeft: '12px' }}>
        <div className="bg-gradient" style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 20px var(--primary-glow)'
        }}>
          <Zap size={24} color="white" fill="white" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>DevGrowth</h1>
      </div>

      {/* Smart Search Trigger */}
      <div 
        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
        style={{ 
          margin: '0 20px 24px', 
          padding: '10px 14px', 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid var(--card-border)', 
          borderRadius: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          fontSize: '13px'
        }}
      >
        <Search size={16} />
        <span>Search anything...</span>
        <div style={{ marginLeft: 'auto', background: 'var(--glass-bg)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>⌘K</div>
      </div>

      <nav style={{ flex: 1, padding: "0 20px", display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  background: isActive ? 'var(--glass-bg)' : 'transparent',
                  border: isActive ? '1px solid var(--card-border)' : '1px solid transparent',
                  transition: 'var(--transition)'
                }}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    style={{
                      marginLeft: 'auto',
                      width: '4px',
                      height: '16px',
                      borderRadius: '2px',
                      background: 'var(--primary)',
                      boxShadow: '0 0 10px var(--primary-glow)'
                    }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link href="/settings" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            color: 'var(--text-muted)',
            transition: 'var(--transition)'
          }}>
            <Settings size={20} />
            <span style={{ fontWeight: 500 }}>Settings</span>
          </div>
        </Link>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '12px',
          color: '#ef4444',
          cursor: 'pointer',
          transition: 'var(--transition)'
        }}>
          <LogOut size={20} />
          <span style={{ fontWeight: 500 }}>Logout</span>
        </div>
      </div>
    </aside>
  );
}
