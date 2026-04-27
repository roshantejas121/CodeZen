"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, BookOpen, Code2, Trophy, Settings,
  Zap, Book, Search, Target, Flame, Star
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard",      href: "/" },
  { icon: Flame,           label: "Elite Bootcamp", href: "/bootcamp" },
  { icon: Book,            label: "Academy",        href: "/academy" },
  { icon: BookOpen,        label: "Certifications", href: "/lessons" },
  { icon: Code2,           label: "Project Lab",    href: "/projects" },
  { icon: FaGithub,        label: "GitHub Hub",     href: "/github" },
  { icon: Zap,             label: "CZ Workouts",    href: "/dojo" },
  { icon: Target,          label: "Daily Drills",   href: "/drills" },
  { icon: Trophy,          label: "Leaderboard",    href: "/leaderboard" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const levelColor = user?.levelColor || 'var(--primary)';

  return (
    <aside className="glass" style={{ 
      height: '100vh', 
      position: 'sticky', 
      top: 0, 
      display: 'flex', 
      flexDirection: 'column',
      padding: '28px 16px',
      borderRight: '1px solid var(--card-border)',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '8px' }}>
        <div className="bg-gradient" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--primary-glow)' }}>
          <Zap size={22} color="white" fill="white" />
        </div>
        <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px' }}>CodeZen</span>
      </div>

      {/* User Level Card */}
      {user && (
        <div style={{ margin: '0 4px 24px', padding: '14px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${levelColor}40`, borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{user.name || 'Developer'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <Star size={11} color={levelColor} fill={levelColor} />
                <span style={{ fontSize: '11px', fontWeight: 800, color: levelColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {user.levelTitle}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: levelColor, lineHeight: 1 }}>{user.level}</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>LEVEL</div>
            </div>
          </div>

          {/* XP Bar */}
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${user.progress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${levelColor}, ${levelColor}88)`, borderRadius: '3px', boxShadow: `0 0 8px ${levelColor}` }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span>{(user.xp || 0).toLocaleString()} XP</span>
            {!user.isMaxLevel && <span>{user.xpNeeded?.toLocaleString()} to next</span>}
          </div>

          {/* Streak */}
          {(user.streak || 0) > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px', padding: '5px 10px', background: 'rgba(245,158,11,0.1)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Flame size={12} color="#f59e0b" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b' }}>{user.streak} day streak</span>
            </div>
          )}
        </div>
      )}

      {/* Smart Search Trigger */}
      <div 
        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
        style={{ margin: '0 4px 20px', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--card-border)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px' }}
      >
        <Search size={14} />
        <span>Search anything...</span>
        <div style={{ marginLeft: 'auto', background: 'var(--glass-bg)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>⌘K</div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(56,189,248,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(56,189,248,0.25)' : '1px solid transparent',
                  transition: 'var(--transition)',
                  boxShadow: isActive ? '0 0 15px rgba(56,189,248,0.1)' : 'none',
                }}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '13px' }}>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    style={{ marginLeft: 'auto', width: '4px', height: '16px', borderRadius: '2px', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Settings */}
      <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
        <Link href="/settings" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '12px', color: 'var(--text-muted)', transition: 'var(--transition)', fontSize: '13px' }}>
            <Settings size={18} />
            <span style={{ fontWeight: 500 }}>Settings</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
