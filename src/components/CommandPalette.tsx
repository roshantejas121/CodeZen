"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Terminal, 
  Book, 
  Code2, 
  Trophy, 
  Settings, 
  Zap, 
  ArrowRight,
  Command as CommandIcon
} from "lucide-react";
import { useRouter } from "next/navigation";

const searchIndex = [
  { title: "Dashboard", category: "Navigation", path: "/", icon: Zap },
  { title: "Academy", category: "Navigation", path: "/academy", icon: Book },
  { title: "HTML Tutorial", category: "Academy", path: "/academy", icon: Book },
  { title: "CSS Basics", category: "Academy", path: "/academy", icon: Book },
  { title: "Project Lab", category: "Navigation", path: "/projects", icon: Code2 },
  { title: "GitHub Hub", category: "Navigation", path: "/github", icon: Terminal },
  { title: "Leaderboard", category: "Navigation", path: "/leaderboard", icon: Trophy },
  { title: "Settings", category: "Navigation", path: "/settings", icon: Settings },
  { title: "React Hooks Snippets", category: "Snippets", path: "/", icon: Code2 },
];

export function CommandPalette() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredResults = searchIndex.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    router.push(path);
    setIsOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => (prev + 1) % filteredResults.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === "Enter") {
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex].path);
      }
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            style={{
              position: 'fixed',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '600px',
              background: '#1e293b',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              zIndex: 10000,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--card-border)' }}>
              <Search size={20} color="var(--primary)" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type to find lessons, projects, or snippets..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '18px',
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px', background: 'var(--glass-bg)', border: '1px solid var(--card-border)', fontSize: '10px', color: 'var(--text-muted)' }}>
                <CommandIcon size={10} /> K
              </div>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
              {filteredResults.length > 0 ? (
                filteredResults.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelect(item.path)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: selectedIndex === i ? 'var(--glass-bg)' : 'transparent',
                      color: selectedIndex === i ? 'white' : 'var(--text-muted)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '8px', 
                      background: selectedIndex === i ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: selectedIndex === i ? 'white' : 'var(--text-muted)'
                    }}>
                      <item.icon size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: '11px', opacity: 0.6 }}>{item.category}</div>
                    </div>
                    {selectedIndex === i && <ArrowRight size={14} />}
                  </div>
                ))
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No results found for "{query}"
                </div>
              )}
            </div>

            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <kbd style={{ padding: '2px 4px', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--card-border)' }}>↵</kbd> Select
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <kbd style={{ padding: '2px 4px', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--card-border)' }}>↑↓</kbd> Navigate
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <kbd style={{ padding: '2px 4px', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--card-border)' }}>esc</kbd> Close
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
