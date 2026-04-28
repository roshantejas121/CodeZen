"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Send, Shield, Star, MessageSquare } from "lucide-react";
import { LiveEditor } from "@/components/LiveEditor";
import { toast } from "sonner";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [solutions, setSolutions] = useState([]);
  const [code, setCode] = useState("");
  const [execResult, setExecResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    const res = await fetch(`/api/problems/${id}`);
    const data = await res.json();
    setProblem(data);
    setCode(data.initialCode || "");
    
    const solRes = await fetch(`/api/problems/${id}/solutions`);
    const solData = await solRes.json();
    setSolutions(solData);
    setLoading(false);
  };

  const handleExecute = async () => {
    toast.loading("Executing code...");
    const res = await fetch("/api/execute", {
      method: "POST",
      body: JSON.stringify({
        language_id: 63, // JavaScript (Node.js) - check Judge0 docs for others
        source_code: code,
      }),
    });
    const result = await res.json();
    setExecResult(result);
    toast.dismiss();
    if (result.stdout) toast.success("Execution completed!");
    else if (result.stderr) toast.error("Execution error!");
  };

  const handleSubmitSolution = async () => {
    toast.loading("Submitting solution...");
    const res = await fetch(`/api/problems/${id}/solutions`, {
      method: "POST",
      body: JSON.stringify({ code, explanation: "Submitted via Global Hub" }),
    });
    if (res.ok) {
      toast.success("Solution posted to Global Hub! +50 Reputation");
      fetchProblem(); // Refresh solutions
    } else {
      toast.error("Failed to submit solution.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 600px', gap: '40px' }}>
        
        {/* Left: Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '40px', border: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {problem.tags.map((t: string) => <span key={t} style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 800 }}>#{t.toUpperCase()}</span>)}
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '20px' }}>{problem.title}</h1>
            <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '16px' }}>{problem.description}</div>
          </div>

          <div style={{ flex: 1, minHeight: '500px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
            <LiveEditor initialCode={code} language={problem.language} onChange={(val) => setCode(val)} />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={handleExecute} className="glass-card" style={{ flex: 1, padding: '20px', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Play size={20} /> Run Test Case
            </button>
            <button onClick={handleSubmitSolution} className="bg-gradient" style={{ flex: 1, padding: '20px', borderRadius: '16px', border: 'none', color: 'white', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Send size={20} /> Submit Global Solution
            </button>
          </div>

          {execResult && (
            <div className="glass-card" style={{ padding: '24px', border: '1px solid #333', background: '#000' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Console Output</div>
              <pre style={{ margin: 0, color: execResult.stderr ? '#ef4444' : '#10b981', fontFamily: 'monospace', fontSize: '14px' }}>
                {execResult.stdout || execResult.stderr || "No output"}
              </pre>
            </div>
          )}
        </div>

        {/* Right: Solutions & Intel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '32px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={18} color="#f59e0b" /> Community Solutions ({solutions.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {solutions.map((sol: any) => (
                <div key={sol._id} className="glass-card" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900 }}>
                        {sol.authorId.username[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{sol.authorId.username}</span>
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>({sol.authorId.reputation} XP)</span>
                    </div>
                  </div>
                  <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)', overflowX: 'auto' }}>
                    {sol.code.slice(0, 100)}...
                  </pre>
                </div>
              ))}
              {solutions.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No solutions yet. Be the first!</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
