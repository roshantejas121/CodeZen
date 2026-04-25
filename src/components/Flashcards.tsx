"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

const cards = [
  { question: "What is a Closure in JavaScript?", answer: "A closure is the combination of a function bundled together with references to its surrounding state." },
  { question: "Difference between null and undefined?", answer: "null is an assigned value (intentional absence), undefined means a variable has been declared but not yet assigned." },
  { question: "What is the Virtual DOM?", answer: "A lightweight representation of the real DOM that React uses to optimize updates." },
];

export function Flashcards() {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => setIndex((index + 1) % cards.length), 150);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '300px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} color="var(--secondary)" />
          Study Flashcards
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{index + 1} / {cards.length}</span>
      </div>

      <div 
        style={{ perspective: '1000px', flex: 1, cursor: 'pointer' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ 
            width: '100%', 
            height: '180px', 
            position: 'relative', 
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'var(--glass-bg)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid var(--card-border)'
          }}>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>{cards[index].question}</p>
          </div>

          {/* Back */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'var(--primary)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            transform: 'rotateY(180deg)',
            color: 'white'
          }}>
            <p style={{ fontSize: '14px', lineHeight: 1.5 }}>{cards[index].answer}</p>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button 
          onClick={(e) => { e.stopPropagation(); nextCard(); }}
          style={{ 
            background: 'var(--glass-bg)', 
            border: '1px solid var(--card-border)', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '8px', 
            fontSize: '14px', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          Next Card <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
