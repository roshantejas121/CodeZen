"use client";

import React, { useState, useEffect } from "react";
import { Brain, ArrowRight, CheckCircle, Target, XCircle, Flame } from "lucide-react";
import Link from "next/link";

const DRILL_DB: Record<string, { q: string; a: string; code?: string; tip?: string }> = {
  Promise: { 
    q: "What does Promise.all() do vs sequential awaits?", 
    a: "Promise.all() executes all promises in parallel, whereas sequential awaits pause execution for each one. This significantly reduces total latency for independent operations.",
    code: "// Parallel (Fast)\nconst [res1, res2] = await Promise.all([fetch1(), fetch2()]);\n\n// Sequential (Slow)\nconst res1 = await fetch1();\nconst res2 = await fetch2();",
    tip: "Use Promise.allSettled() if you need all results even if some fail."
  },
  await: { 
    q: "When is 'await' valid and what does it actually do?", 
    a: "'await' pauses the execution of an async function until the promise settles. It returns the resolved value or throws the rejected value.",
    code: "async function getData() {\n  try {\n    const data = await fetch('/api');\n    return await data.json();\n  } catch (e) {\n    console.error('Failed', e);\n  }\n}",
    tip: "Await is essentially syntax sugar for .then() chaining."
  },
  map: { 
    q: "How does Array.map() differ from forEach()?", 
    a: "map() creates a brand new array by applying a function to every element. forEach() is just a loop that returns undefined and is used for side effects (like logging).",
    code: "const nums = [1, 2, 3];\n\n// Returns [2, 4, 6]\nconst doubled = nums.map(n => n * 2);\n\n// Mutates external state\nnums.forEach(n => console.log(n));",
    tip: "Never use map() if you don't intend to use the returned array."
  },
  useEffect: { 
    q: "How do you prevent memory leaks in useEffect?", 
    a: "By returning a 'cleanup function'. React calls this before the component unmounts or before re-running the effect to clean up timers, subscriptions, or event listeners.",
    code: "useEffect(() => {\n  const timer = setInterval(() => tick(), 1000);\n  \n  // CLEANUP\n  return () => clearInterval(timer);\n}, []);",
    tip: "Always clean up subscriptions to prevent 'update on unmounted component' warnings."
  },
  useState: { 
    q: "Why should you use the functional update pattern in useState?", 
    a: "When the new state depends on the previous state, the functional pattern ensures you're working with the most current value, avoiding closures over stale data.",
    code: "// Stale potential\nsetCount(count + 1);\n\n// SAFE: Functional update\nsetCount(prev => prev + 1);",
    tip: "This is crucial when multiple updates happen in the same render cycle."
  },
  vector: { 
    q: "What is the complexity of inserting into a std::vector?", 
    a: "O(1) amortized for end insertions. However, if capacity is exceeded, it triggers an O(n) reallocation. Middle insertions are always O(n).",
    code: "std::vector<int> v = {1, 2, 3};\nv.push_back(4); // O(1) amortized\nv.insert(v.begin(), 0); // O(n) - shift needed",
    tip: "Use v.reserve() if you know the final size to avoid reallocations."
  },
  ArrayList: { 
    q: "ArrayList vs LinkedList: Which one wins for random access?", 
    a: "ArrayList wins (O(1)) because it's backed by a contiguous array. LinkedList requires O(n) traversal to reach a specific index.",
    code: "List<String> list = new ArrayList<>();\nlist.add(\"Data\");\nString item = list.get(0); // Instant access",
    tip: "Use ArrayList by default unless you perform constant-time insertions at the start/middle."
  },
  fetch: {
    q: "How do you handle a 404 error using the fetch API?",
    a: "fetch() does NOT throw on 404. It only throws on network failure. You must check the 'ok' property or the 'status' code of the response.",
    code: "const res = await fetch(url);\nif (!res.ok) {\n  throw new Error(`Status: ${res.status}`);\n}\nconst data = await res.json();",
    tip: "res.ok is true if status is in the 200-299 range."
  }
};

export default function DrillsPage() {
  const [frictionTokens, setFrictionTokens] = useState<{ word: string; count: number }[]>([]);
  const [currentDrill, setCurrentDrill] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cz_friction_map");
    if (saved) {
      const map = JSON.parse(saved);
      const sorted = Object.keys(map)
        .map((key) => ({ word: key, count: map[key] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 friction points max
      setFrictionTokens(sorted);
    }
  }, []);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentDrill < frictionTokens.length - 1) {
        setCurrentDrill((prev) => prev + 1);
      } else {
        setCompleted(true);
        localStorage.removeItem("cz_friction_map");
      }
    }, 300);
  };

  // EMPTY STATE
  if (frictionTokens.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-card" style={{ padding: "48px", borderRadius: "24px", textAlign: "center", maxWidth: "440px" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px auto", boxShadow: "0 0 40px rgba(99, 102, 241, 0.4)" }}>
            <Brain size={40} color="white" />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "12px", color: "white" }}>No Friction Data Yet</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "16px", fontSize: "15px", lineHeight: 1.7 }}>
            Complete a CZ Workout first. While you code, CodeZen silently tracks every moment you pause for 4+ seconds — those are your cognitive friction points.
          </p>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "13px", lineHeight: 1.6, fontStyle: "italic" }}>
            After your workout, return here. Your drills will be auto-generated from the exact concepts you got stuck on.
          </p>
          <Link href="/dojo">
            <button style={{ width: "100%", padding: "16px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)", fontSize: "15px" }}>
              Start a CZ Workout
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // COMPLETED STATE
  if (completed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-card" style={{ padding: "48px", borderRadius: "24px", textAlign: "center", maxWidth: "440px" }}>
          <CheckCircle size={64} color="#10b981" style={{ marginBottom: "24px" }} />
          <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "12px", color: "white" }}>Drill Session Complete</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "15px" }}>
            You reinforced {frictionTokens.length} friction points from your coding session. Your heatmap has been cleared.
          </p>
          <Link href="/">
            <button style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid var(--card-border)", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ACTIVE DRILL
  const token = frictionTokens[currentDrill];
  const drillData = DRILL_DB[token.word] || {
    q: `What is the correct syntax, use-case, and common pitfall of '${token.word}'?`,
    a: `You paused on '${token.word}' ${token.count} time(s). Review the official docs for this API/concept to build automatic recall.`,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ padding: "24px 40px", borderBottom: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Target size={24} color="var(--primary)" />
          <h1 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "white" }}>Friction Drills</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "8px 16px", borderRadius: "20px" }}>
            {currentDrill + 1} / {frictionTokens.length}
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        {/* Friction badge */}
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
            <Flame size={16} color="#ef4444" />
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#ef4444", textTransform: "uppercase", letterSpacing: "1px" }}>
              Friction Point
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", margin: 0 }}>
            You paused <strong style={{ color: "white" }}>{token.count}×</strong> on{" "}
            <code style={{ background: "rgba(99,102,241,0.15)", padding: "3px 8px", borderRadius: "6px", color: "#818cf8", fontWeight: 700 }}>
              {token.word}
            </code>
          </p>
        </div>

        {/* Flashcard */}
        <div
          onClick={() => !isFlipped && setIsFlipped(true)}
          style={{ width: "100%", maxWidth: "620px", minHeight: "300px", cursor: isFlipped ? "default" : "pointer", position: "relative" }}
        >
          {!isFlipped ? (
            <div className="glass-card" style={{ padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "300px", transition: "all 0.3s" }}>
              <Brain size={36} color="rgba(255,255,255,0.06)" style={{ position: "absolute", top: 20, right: 24 }} />
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "white", lineHeight: 1.6, maxWidth: "500px" }}>
                {drillData.q}
              </h2>
              <p style={{ position: "absolute", bottom: 24, fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                Tap to reveal answer
              </p>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: "40px", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", minHeight: "450px", background: "rgba(59, 130, 246, 0.04)", border: "1px solid rgba(59, 130, 246, 0.15)", width: "100%" }}>
              <div style={{ width: "100%", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Explanation</h3>
                <p style={{ fontSize: "16px", fontWeight: 500, color: "white", lineHeight: 1.6, margin: 0 }}>
                  {drillData.a}
                </p>
              </div>

              {drillData.code && (
                <div style={{ width: "100%", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Practice Example</h3>
                  <div style={{ background: "#0f172a", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", position: "relative", width: "100%" }}>
                    <pre style={{ margin: 0, color: "#e2e8f0", fontSize: "13px", fontFamily: "JetBrains Mono, monospace", overflowX: "auto", whiteSpace: "pre-wrap" }}>
                      <code>{drillData.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {drillData.tip && (
                <div style={{ width: "100%", padding: "12px 16px", background: "rgba(16, 185, 129, 0.05)", borderLeft: "4px solid #10b981", borderRadius: "4px", marginBottom: "32px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#10b981", display: "block", marginBottom: "4px" }}>PRO TIP</span>
                  <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0 }}>{drillData.tip}</p>
                </div>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                style={{ background: "var(--primary)", color: "white", border: "none", padding: "14px 36px", borderRadius: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)", fontSize: "15px", alignSelf: "center", marginTop: "auto" }}
              >
                {currentDrill < frictionTokens.length - 1 ? "Next Drill" : "Finish Session"} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: "8px", marginTop: "32px" }}>
          {frictionTokens.map((_, i) => (
            <div
              key={i}
              style={{
                width: 10, height: 10, borderRadius: "50%",
                background: i < currentDrill ? "#10b981" : i === currentDrill ? "var(--primary)" : "rgba(255,255,255,0.1)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
