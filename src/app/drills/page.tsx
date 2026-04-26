"use client";

import React, { useState, useEffect } from "react";
import { Brain, ArrowRight, CheckCircle, Target, XCircle, Flame } from "lucide-react";
import Link from "next/link";

const DRILL_DB: Record<string, { q: string; a: string }> = {
  Promise: { q: "What does Promise.all() do vs sequential awaits?", a: "Promise.all() runs promises concurrently. Use it when tasks are independent to minimize total wait time." },
  await: { q: "Can you use 'await' outside an async function?", a: "No. 'await' is only valid inside an async function or at the top level of ES modules." },
  map: { q: "How does Array.map() differ from forEach()?", a: "map() returns a new transformed array. forEach() returns undefined and is used only for side effects." },
  filter: { q: "Does Array.filter() mutate the original array?", a: "No. It returns a brand new array with only elements that pass the test function." },
  reduce: { q: "What if you omit the initial value in reduce()?", a: "The first array element becomes the accumulator, and iteration starts from the second element." },
  useEffect: { q: "What happens without a dependency array in useEffect?", a: "The effect runs after every render, which can cause infinite loops if it updates state." },
  useState: { q: "Why not mutate React state directly?", a: "React uses reference identity to decide re-renders. Direct mutation bypasses React's scheduler." },
  fetch: { q: "Does fetch() reject on 404 or 500 errors?", a: "No. fetch only rejects on network failures. You must check response.ok manually." },
  splice: { q: "Does Array.splice() return the removed items or the modified array?", a: "It returns an array of removed elements and mutates the original array in-place." },
  indexOf: { q: "What does indexOf return if the element is not found?", a: "It returns -1. Always check for -1 rather than falsy values." },
  split: { q: "What does String.split('') do?", a: "It splits the string into an array of individual characters." },
  join: { q: "How does Array.join() handle undefined/null elements?", a: "They are converted to empty strings in the joined result." },
  sort: { q: "Does Array.sort() sort numbers correctly by default?", a: "No. Default sort is lexicographic. Use a comparator: (a,b) => a - b for numeric sort." },
  slice: { q: "Does Array.slice() mutate the original array?", a: "No. slice returns a shallow copy of a portion of the array." },
  console: { q: "What is console.table() used for?", a: "It displays tabular data as a table in the console, useful for arrays of objects." },
  forEach: { q: "Can you break out of a forEach loop early?", a: "No. Use for...of or Array.some()/every() if you need early termination." },
  push: { q: "What does Array.push() return?", a: "It returns the new length of the array, not the array itself." },
  pop: { q: "What does pop() return on an empty array?", a: "It returns undefined." },
  includes: { q: "Does Array.includes() use strict equality?", a: "Yes. It uses the SameValueZero algorithm (similar to ===, but NaN equals NaN)." },
  find: { q: "What does Array.find() return if no match is found?", a: "It returns undefined." },
  concat: { q: "Does concat() modify the original array?", a: "No. It returns a new array that is the combination of the arrays." },
  length: { q: "What happens if you set array.length = 0?", a: "It empties the array in-place, removing all elements." },
  toString: { q: "When is toString() called implicitly in JS?", a: "When an object is used in a string context, like concatenation or template literals." },
  parseInt: { q: "What does parseInt('08') return?", a: "8. Modern JS defaults to base 10, but always pass the radix: parseInt('08', 10)." },
  input: { q: "How does Python's input() handle data types?", a: "input() always returns a string. You must explicitly cast with int(), float(), etc." },
  range: { q: "Is range() inclusive or exclusive of the end value?", a: "Exclusive. range(0, 5) produces 0,1,2,3,4." },
  append: { q: "What is the difference between list.append() and list.extend()?", a: "append adds one element. extend adds each element of an iterable individually." },
  enumerate: { q: "What does enumerate() return?", a: "It returns an iterator of tuples containing (index, value) pairs." },
  items: { q: "What does dict.items() return in Python?", a: "A view object of (key, value) tuple pairs." },
  cout: { q: "What is the difference between cout and printf in C++?", a: "cout is type-safe and uses operator<<. printf uses format specifiers and is from C." },
  vector: { q: "How does std::vector differ from a raw array in C++?", a: "vector is dynamic (resizable), manages its own memory, and provides bounds checking with .at()." },
  ArrayList: { q: "What is the difference between ArrayList and LinkedList in Java?", a: "ArrayList uses a dynamic array (fast random access). LinkedList uses doubly-linked nodes (fast insert/delete)." },
  HashMap: { q: "Is Java's HashMap thread-safe?", a: "No. Use ConcurrentHashMap for thread-safe operations." },
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
            <div className="glass-card" style={{ padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "300px", background: "rgba(59, 130, 246, 0.04)", border: "1px solid rgba(59, 130, 246, 0.15)" }}>
              <p style={{ fontSize: "18px", fontWeight: 500, color: "white", lineHeight: 1.7, maxWidth: "500px", marginBottom: "32px" }}>
                {drillData.a}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                style={{ background: "var(--primary)", color: "white", border: "none", padding: "14px 36px", borderRadius: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)", fontSize: "15px" }}
              >
                {currentDrill < frictionTokens.length - 1 ? "Next Drill" : "Finish"} <ArrowRight size={16} />
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
