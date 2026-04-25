"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Copy, Search, Plus, Terminal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "./ui/Modal";

export function SnippetManager() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSnippet, setNewSnippet] = useState({ title: '', code: '', language: 'JavaScript' });

  useEffect(() => {
    fetch('/api/snippets')
      .then(res => res.json())
      .then(data => {
        setSnippets(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const handleAddSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnippet.title || !newSnippet.code) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch('/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSnippet)
      });
      const data = await res.json();
      setSnippets([data, ...snippets]);
      setIsModalOpen(false);
      setNewSnippet({ title: '', code: '', language: 'JavaScript' });
      toast.success("Snippet saved successfully!");
    } catch (err) {
      toast.error("Failed to save snippet");
    }
  };

  const deleteSnippet = async (id: number) => {
    try {
      await fetch('/api/snippets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setSnippets(snippets.filter(s => s.id !== id));
      toast.info("Snippet deleted");
    } catch (err) {
      toast.error("Failed to delete snippet");
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard!");
  };

  const filtered = snippets.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={20} color="var(--primary)" />
          Code Snippets
        </h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
        >
          <Plus size={14} /> Add
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search snippets..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--card-border)', padding: '8px 12px 8px 36px', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
        <AnimatePresence>
          {filtered.map((snippet) => (
            <motion.div 
              key={snippet.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px', border: '1px solid var(--card-border)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{snippet.title}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Copy 
                    size={14} 
                    style={{ cursor: 'pointer', color: 'var(--text-muted)' }} 
                    onClick={() => copyToClipboard(snippet.code)}
                  />
                  <Trash2 
                    size={14} 
                    style={{ cursor: 'pointer', color: '#ef4444' }} 
                    onClick={() => deleteSnippet(snippet.id)}
                  />
                </div>
              </div>
              <code style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.7 }}>
                {snippet.code}
              </code>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Snippet Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Snippet">
        <form onSubmit={handleAddSnippet} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Title</label>
            <input 
              type="text" 
              placeholder="e.g. React Modal Hook" 
              value={newSnippet.title}
              onChange={e => setNewSnippet({...newSnippet, title: e.target.value})}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', padding: '12px', borderRadius: '8px', color: 'white', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Code Content</label>
            <textarea 
              placeholder="Paste your code here..." 
              value={newSnippet.code}
              onChange={e => setNewSnippet({...newSnippet, code: e.target.value})}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', padding: '12px', borderRadius: '8px', color: 'white', outline: 'none', minHeight: '150px', fontFamily: 'monospace' }}
            />
          </div>
          <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>
            Save Snippet
          </button>
        </form>
      </Modal>
    </div>
  );
}
