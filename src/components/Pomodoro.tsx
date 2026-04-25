"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Timer, Coffee } from "lucide-react";

export function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      // Simple notification logic or sound could go here
      if (!isBreak) {
        alert("Time for a break!");
        setIsBreak(true);
        setTimeLeft(5 * 60);
      } else {
        alert("Back to work!");
        setIsBreak(false);
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isBreak ? 'var(--accent)' : 'var(--primary)' }}>
        {isBreak ? <Coffee size={20} /> : <Timer size={20} />}
        <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>
          {isBreak ? "Break Mode" : "Focus Session"}
        </span>
      </div>

      <div style={{ fontSize: '64px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)' }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={toggleTimer}
          style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            border: 'none', 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 20px var(--primary-glow)'
          }}
        >
          {isActive ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
        </button>
        <button 
          onClick={resetTimer}
          style={{ 
            background: 'var(--glass-bg)', 
            color: 'var(--text-main)', 
            border: '1px solid var(--card-border)', 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div style={{ width: '100%', height: '4px', background: 'var(--glass-bg)', borderRadius: '2px', overflow: 'hidden', marginTop: '10px' }}>
        <motion.div 
          animate={{ width: `${(timeLeft / (isBreak ? 5 * 60 : 25 * 60)) * 100}%` }}
          style={{ height: '100%', background: isBreak ? 'var(--accent)' : 'var(--primary)' }}
        />
      </div>
    </div>
  );
}
