"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, 
  Code2, 
  Eye, 
  RefreshCw, 
  Terminal as TerminalIcon, 
  ChevronDown,
  Download,
  Copy,
  Trash2,
  Globe,
  Database,
  Cpu,
  Layers,
  Terminal,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const COMPILER_LANGUAGES = [
  { id: 'html', name: 'HTML/CSS', icon: Globe, color: '#e34c26' },
  { id: 'javascript', name: 'JavaScript', icon: Terminal, color: '#f7df1e' },
  { id: 'python', name: 'Python 3', icon: Database, color: '#3776ab' },
  { id: 'cpp', name: 'C++', icon: Cpu, color: '#00599c' },
  { id: 'java', name: 'Java', icon: Layers, color: '#007396' },
  { id: 'rust', name: 'Rust', icon: Zap, color: '#dea584' },
  { id: 'go', name: 'Go', icon: Cpu, color: '#00add8' },
];

interface LiveEditorProps {
  initialCode?: string;
  language?: string;
  onLanguageChange?: (langId: string) => void;
  hideSelector?: boolean;
}

export function LiveEditor({ 
  initialCode = "", 
  language: initialLanguage = "html", 
  onLanguageChange,
  hideSelector = false
}: LiveEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [srcDoc, setSrcDoc] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only update internal state if external language changes
    setLanguage(initialLanguage);
    setCode(initialCode);
    if (initialLanguage === 'html') setSrcDoc(initialCode);
  }, [initialCode, initialLanguage]);

  const updateXP = async () => {
    try {
      const userRes = await fetch('/api/user');
      const userData = await userRes.json();
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp: (userData.xp || 0) + 5 })
      });
    } catch (err) {
      console.error("Failed to update XP:", err);
    }
  };

  const handleLangChange = (lang: any) => {
    setLanguage(lang.id);
    if (onLanguageChange) onLanguageChange(lang.id);
    
    // Auto-boilerplate logic
    if (lang.id === 'html') setCode('<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>');
    else if (lang.id === 'python') setCode('print("Hello from Python!")');
    else if (lang.id === 'cpp') setCode('#include <iostream>\n\nint main() {\n    std::cout << "Hello C++" << std::endl;\n    return 0;\n}');
    else setCode(`// Start building with ${lang.name}`);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput("");
    
    if (language === 'html' || language === 'css') {
      setSrcDoc(code);
      toast.success("Live Preview updated! +5 XP");
      setRunning(false);
      updateXP();
      return;
    }

    try {
      const res = await fetch('/api/compiler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code })
      });
      const data = await res.json();
      
      if (data.output || data.stdout || data.stderr) {
        setOutput(data.output || data.stdout || data.stderr);
        if (data.stderr) toast.error("Runtime error detected");
        else {
          toast.success("Code executed! +5 XP");
          updateXP();
        }
      } else {
        setOutput(data.error || "Execution failed with no output.");
      }
    } catch (err) {
      setOutput("Connection Error: Compiler service unreachable.");
    } finally {
      setRunning(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `script.${language === 'javascript' ? 'js' : language}`;
    document.body.appendChild(element);
    element.click();
    toast.success("Code downloaded successfully!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  if (!mounted) return null;

  const isWebMode = language === 'html' || language === 'css';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '650px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--card-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
      
      {/* Quick Access Language Bar (Programiz Style) */}
      {!hideSelector && (
        <div style={{ background: '#0f172a', padding: '10px 20px', display: 'flex', gap: '8px', borderBottom: '1px solid #1e293b', overflowX: 'auto' }}>
          {COMPILER_LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLangChange(lang)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid transparent',
                background: language === lang.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                borderColor: language === lang.id ? 'var(--primary)' : 'transparent',
                color: language === lang.id ? 'white' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <lang.icon size={14} color={lang.color} />
              {lang.name}
            </button>
          ))}
        </div>
      )}

      {/* Main IDE Toolbar */}
      <div style={{ background: '#1e293b', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={handleRun}
            disabled={running}
            style={{ 
              background: 'var(--primary)', 
              border: 'none', 
              color: 'white', 
              padding: '10px 24px', 
              borderRadius: '12px', 
              fontSize: '13px', 
              fontWeight: 800, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              opacity: running ? 0.7 : 1,
              boxShadow: '0 4px 15px var(--primary-glow)',
              transition: 'all 0.2s'
            }}
          >
            <Play size={16} fill="white" /> {running ? 'Compiling...' : 'RUN'}
          </button>
          
          <div style={{ width: '1px', background: '#334155', margin: '0 8px' }} />

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleCopy} title="Copy Code" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: 'white', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Copy size={16} />
            </button>
            <button onClick={handleDownload} title="Download Source" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: 'white', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Download size={16} />
            </button>
            <button onClick={() => setCode("")} title="Clear Editor" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: '#ef4444', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Status: <span style={{ color: running ? '#f59e0b' : '#10b981' }}>{running ? 'Busy' : 'Ready'}</span>
          </span>
          <button 
            onClick={() => setCode(initialCode)}
            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700 }}
          >
            <RefreshCw size={14} /> Restore Default
          </button>
        </div>
      </div>

      {/* 3. Main Workspace Area (Vertical Stack) */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: '#020617', overflow: 'hidden' }}>
        
        {/* Top Pane: High-Performance Editor */}
        <div style={{ flex: 1, position: 'relative', borderBottom: '1px solid #1e293b' }}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              color: '#f8fafc',
              border: 'none',
              padding: '24px',
              fontFamily: '"Fira Code", monospace',
              fontSize: '15px',
              lineHeight: 1.6,
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        {/* Bottom Pane: The Stage (Final Product) */}
        <div style={{ height: '280px', background: isWebMode ? 'white' : '#0a0f1e', position: 'relative', borderTop: '4px solid #1e293b' }}>
          {/* Status Floating Badge */}
          <div style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '16px', 
            zIndex: 10, 
            color: isWebMode ? '#64748b' : '#10b981', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '10px', 
            fontWeight: 900, 
            background: isWebMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.6)', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            border: '1px solid currentColor',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {isWebMode ? <Eye size={12} /> : <TerminalIcon size={12} />} 
            {isWebMode ? 'Final Product Preview' : 'Technical Output Console'}
          </div>
          
          {isWebMode ? (
            <iframe 
              srcDoc={language === 'css' 
                ? `<html><head><style>${code}</style></head><body style="padding:24px; font-family: sans-serif;">
                   <h1 style="margin-top:0">CSS Preview Stage</h1>
                   <p>Your styles are being applied to this preview content in real-time.</p>
                   <button style="padding: 10px 20px; border-radius: 8px; cursor: pointer;">Sample Button</button>
                   <div style="margin-top:20px; padding:20px; border: 1px solid #ddd; border-radius: 8px;">
                     Sample Container
                   </div>
                   </body></html>` 
                : srcDoc
              } 
              title="output" 
              sandbox="allow-scripts" 
              frameBorder="0" 
              width="100%" 
              height="100%" 
            />
          ) : (
            <div style={{ padding: '24px', paddingTop: '40px', color: '#f8fafc', fontFamily: '"Fira Code", monospace', fontSize: '13px', height: '100%', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
              <div style={{ color: '#475569', marginBottom: '8px' }}>$ devgrowth --run ${language}</div>
              {output || <span style={{ color: '#475569' }}>// Press RUN to execute and view results...</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
