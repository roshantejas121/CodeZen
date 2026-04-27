"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  BrainCircuit,
  Bot
} from "lucide-react";

export function AIMentor() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [model, setModel] = useState('llama-3.3-70b-versatile');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I\'m your AI Mentor. How can I help you level up today? I can debug code, explain concepts, or help you with your roadmap.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const AVAILABLE_MODELS = [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B' },
    { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 70B' }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, model })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.content || "I'm sorry, I'm experiencing some technical difficulties. Please try again in a moment!" 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Network error: I can't reach my brain right now. Please check your connection." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="animate-pulse-glow"
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.4)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px var(--primary-glow), inset 0 0 20px rgba(255,255,255,0.6)',
          cursor: 'pointer',
          zIndex: 1000,
          background: 'radial-gradient(circle at 30% 30%, #a855f7 0%, #3b82f6 100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Sparkles size={32} style={{ filter: 'drop-shadow(0 0 8px white)' }} />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            width: '16px',
            height: '16px',
            background: '#10b981',
            borderRadius: '50%',
            border: '3px solid var(--bg-color)',
            boxShadow: '0 0 10px #10b981'
          }}
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="glass-card"
            style={{
              position: 'fixed',
              bottom: '110px',
              right: '32px',
              width: '380px',
              height: '550px',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Header */}
            <div className="bg-gradient" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BrainCircuit size={24} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>AI Mentor</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>Online & ready to help</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {AVAILABLE_MODELS.map(m => (
                    <option key={m.id} value={m.id} style={{ background: '#1e293b' }}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {messages.map((msg, i) => (
                <div key={i} style={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--glass-bg)',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  color: 'white',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  border: msg.role === 'user' ? 'none' : '1px solid var(--card-border)'
                }}>
                  {msg.content}
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'var(--glass-bg)', padding: '12px 16px', borderRadius: '16px 16px 16px 2px', display: 'flex', gap: '4px' }}>
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '20px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your mentor anything..." 
                style={{ 
                  flex: 1, 
                  background: 'var(--glass-bg)', 
                  border: '1px solid var(--card-border)', 
                  borderRadius: '10px', 
                  padding: '10px 16px', 
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button 
                onClick={handleSend}
                style={{ 
                  background: 'var(--primary)', 
                  border: 'none', 
                  borderRadius: '10px', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
