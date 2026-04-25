"use client";

import React, { useState } from "react";
import { Target, CheckCircle2, Circle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function GoalsTracker() {
  const [goals, setGoals] = useState([
    { id: 1, text: 'Complete React Patterns Lesson', completed: true },
    { id: 2, text: 'Build AI Snippet Manager', completed: false },
    { id: 3, text: 'Master CSS Grid Layouts', completed: false },
  ]);

  const toggleGoal = async (id: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    
    const newStatus = !goal.completed;
    
    // Optimistic update
    setGoals(goals.map(g => g.id === id ? { ...g, completed: newStatus } : g));

    try {
      await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: newStatus })
      });
    } catch (err) {
      console.error("Failed to save goal status");
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} color="#ef4444" />
          My Growth Goals
        </h3>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
          <Plus size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {goals.map((goal) => (
          <motion.div 
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            whileTap={{ scale: 0.98 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px', 
              borderRadius: '10px', 
              background: goal.completed ? 'rgba(16, 185, 129, 0.05)' : 'var(--glass-bg)',
              border: '1px solid',
              borderColor: goal.completed ? 'rgba(16, 185, 129, 0.2)' : 'var(--card-border)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {goal.completed ? <CheckCircle2 size={18} color="#10b981" /> : <Circle size={18} color="var(--text-muted)" />}
            <span style={{ 
              fontSize: '14px', 
              color: goal.completed ? 'var(--text-muted)' : 'var(--text-main)',
              textDecoration: goal.completed ? 'line-through' : 'none'
            }}>
              {goal.text}
            </span>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>Overall Progress</span>
          <span>{Math.round((goals.filter(g => g.completed).length / goals.length) * 100)}%</span>
        </div>
        <div style={{ height: '4px', background: 'var(--glass-bg)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div 
            animate={{ width: `${(goals.filter(g => g.completed).length / goals.length) * 100}%` }}
            style={{ height: '100%', background: '#10b981' }}
          />
        </div>
      </div>
    </div>
  );
}
