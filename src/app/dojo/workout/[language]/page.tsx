"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, ArrowLeft, Clock, Play, Code2, Trophy, Terminal } from "lucide-react";
import Link from "next/link";
import Editor from "@monaco-editor/react";

// Mock question bank (30 questions, increasing in difficulty)
const QUESTION_BANK = [
  // Level 0 (White Belt - Basics)
  { title: "Hello World", desc: "Write a function that prints 'Hello World'", input: "None", output: "Hello World" },
  { title: "Add Two Numbers", desc: "Write a function that takes two numbers and returns their sum.", input: "3, 5", output: "8" },
  { title: "Is Even", desc: "Write a function that returns true if a number is even, false otherwise.", input: "4", output: "true" },
  { title: "String Length", desc: "Return the length of the given string.", input: "'DOJO'", output: "4" },
  { title: "Multiply By Two", desc: "Given an array of numbers, multiply each by two.", input: "[1, 2, 3]", output: "[2, 4, 6]" },
  
  // Level 1 (Yellow Belt - Control Flow)
  { title: "FizzBuzz", desc: "Return 'Fizz' for multiples of 3, 'Buzz' for 5, 'FizzBuzz' for 15, or the number itself.", input: "15", output: "'FizzBuzz'" },
  { title: "Find Max", desc: "Find the maximum number in an array without using built-in Math methods.", input: "[1, 5, 2, 9]", output: "9" },
  { title: "Reverse String", desc: "Reverse a string manually without built-in reverse.", input: "'code'", output: "'edoc'" },
  { title: "Count Vowels", desc: "Count the number of vowels in a string.", input: "'hello'", output: "2" },
  { title: "Palindrome", desc: "Check if a string is a palindrome.", input: "'racecar'", output: "true" },

  // Level 2 (Orange Belt - Data Structures)
  { title: "Two Sum", desc: "Given an array and target, return indices of two numbers that add up to target.", input: "nums=[2,7,11,15], target=9", output: "[0, 1]" },
  { title: "Remove Duplicates", desc: "Remove duplicates from an array.", input: "[1, 1, 2]", output: "[1, 2]" },
  { title: "Valid Parentheses", desc: "Check if a string of brackets is validly closed.", input: "'()[]{}'", output: "true" },
  { title: "Merge Arrays", desc: "Merge two sorted arrays into one sorted array.", input: "[1,3], [2,4]", output: "[1, 2, 3, 4]" },
  { title: "First Unique Char", desc: "Find the first non-repeating character in a string.", input: "'leetcode'", output: "'l'" },

  // Level 3 (Green Belt - Advanced Algos)
  { title: "Binary Search", desc: "Implement binary search on a sorted array.", input: "nums=[-1,0,3,5,9,12], target=9", output: "4" },
  { title: "Maximum Subarray", desc: "Find the contiguous subarray with the largest sum.", input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
  { title: "Climbing Stairs", desc: "How many distinct ways can you climb n stairs (1 or 2 steps at a time)?", input: "n=3", output: "3" },
  { title: "Reverse Linked List", desc: "Reverse a singly linked list.", input: "1->2->3->4->5", output: "5->4->3->2->1" },
  { title: "Invert Binary Tree", desc: "Invert a binary tree.", input: "[4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },

  // Level 4 (Blue Belt - Graphs & DP)
  { title: "Number of Islands", desc: "Count the number of islands in a 2D grid.", input: "grid", output: "1" },
  { title: "Coin Change", desc: "Find min coins to make up an amount.", input: "coins=[1,2,5], amount=11", output: "3" },
  { title: "Longest Substring", desc: "Longest substring without repeating characters.", input: "'abcabcbb'", output: "3" },
  { title: "Course Schedule", desc: "Can you finish all courses given prerequisite pairs?", input: "numCourses=2, prerequisites=[[1,0]]", output: "true" },
  { title: "Word Break", desc: "Can string be segmented into dictionary words?", input: "'leetcode', dict=['leet','code']", output: "true" },

  // Level 5 (Black Belt - Mastery)
  { title: "Merge K Sorted Lists", desc: "Merge k sorted linked lists.", input: "lists", output: "mergedList" },
  { title: "Trapping Rain Water", desc: "Compute how much water it can trap after raining.", input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
  { title: "N-Queens", desc: "Return all distinct solutions to the n-queens puzzle.", input: "n=4", output: "[[...]]" },
  { title: "Serialize Binary Tree", desc: "Design an algorithm to serialize and deserialize a tree.", input: "root", output: "string" },
  { title: "LRU Cache", desc: "Design an LRU cache data structure.", input: "operations", output: "results" }
];

const BELTS = ["White", "Yellow", "Orange", "Green", "Blue", "Black"];

export default function WorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const language = decodeURIComponent((params.language as string) || "javascript");
  
  const [level, setLevel] = useState(0);
  const [questions, setQuestions] = useState<typeof QUESTION_BANK>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [code, setCode] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = React.useRef<any>(null);
  const lastActivityRef = React.useRef<number>(Date.now());
  const frictionIntervalRef = React.useRef<any>(null);
  const IGNORED_TOKENS = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'from', 'export', 'default', 'new', 'this', 'true', 'false', 'null', 'undefined', 'class', 'extends', 'try', 'catch', 'throw', 'switch', 'case', 'break', 'continue', 'do', 'in', 'of', 'typeof', 'instanceof', 'void', 'delete', 'yield', 'async', 'def', 'print', 'self', 'None', 'True', 'False', 'int', 'str', 'main', 'include', 'using', 'namespace', 'std', 'public', 'static', 'void', 'String', 'args', 'System', 'out', 'println'];

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    lastActivityRef.current = Date.now();

    // Track all user activity (typing, clicking, cursor movement)
    editor.onDidChangeCursorPosition(() => {
      lastActivityRef.current = Date.now();
    });

    // Continuous idle detection: poll every 2 seconds
    frictionIntervalRef.current = setInterval(() => {
      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs < 4000) return; // Not idle long enough

      const position = editor.getPosition();
      const model = editor.getModel();
      if (!position || !model) return;

      // Grab the line content near the cursor
      const lineContent = model.getLineContent(position.lineNumber);
      
      // Extract meaningful tokens from the current line
      const tokens = lineContent.match(/[a-zA-Z_]\w*/g) || [];
      const meaningfulTokens = tokens.filter((t: string) => 
        t.length > 2 && !IGNORED_TOKENS.includes(t)
      );

      if (meaningfulTokens.length > 0) {
        const saved = localStorage.getItem('cz_friction_map');
        const map: Record<string, number> = saved ? JSON.parse(saved) : {};
        
        // Log all meaningful tokens on the line the user is stuck on
        meaningfulTokens.forEach((token: string) => {
          map[token] = (map[token] || 0) + 1;
        });

        localStorage.setItem('cz_friction_map', JSON.stringify(map));
        // Reset so we don't log the same pause twice
        lastActivityRef.current = Date.now();
      }
    }, 2000);
  };

  // Cleanup friction interval on unmount
  useEffect(() => {
    return () => {
      if (frictionIntervalRef.current) clearInterval(frictionIntervalRef.current);
    };
  }, []);

  const handleEditorChange = (val: string | undefined) => {
    setCode(val || "");
    lastActivityRef.current = Date.now();
  };

  useEffect(() => {
    // Determine user's current level for this language
    const saved = localStorage.getItem('dojo_progress');
    let currentLevel = 0;
    if (saved) {
      const tracks = JSON.parse(saved);
      const track = tracks.find((t: any) => t.language.toLowerCase() === language.toLowerCase());
      if (track) currentLevel = track.progress;
    }
    setLevel(currentLevel);

    // Pick 5 questions based on level
    const startIndex = Math.min(currentLevel * 5, 25);
    setQuestions(QUESTION_BANK.slice(startIndex, startIndex + 5));

    // Initial boilerplates
    if (language.toLowerCase() === 'javascript') {
      setCode(`// Implement the solution in JS\nconsole.log("Hello World");`);
    } else if (language.toLowerCase() === 'python') {
      setCode(`# Implement the solution in Python\nprint("Hello World")`);
    } else if (language.toLowerCase() === 'cpp') {
      setCode(`#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}`);
    } else if (language.toLowerCase() === 'java') {
      setCode(`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}`);
    } else {
      setCode(`// Write your solution here`);
    }
  }, [language]);

  useEffect(() => {
    if (finished || questions.length === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [finished, questions]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLevelUp = () => {
    const saved = localStorage.getItem('dojo_progress');
    let tracks = saved ? JSON.parse(saved) : [
      { language: "Javascript", progress: 0 },
      { language: "C++", progress: 0 },
      { language: "Java", progress: 0 },
      { language: "Python", progress: 0 }
    ];

    const idx = tracks.findIndex((t: any) => t.language.toLowerCase() === language.toLowerCase());
    if (idx !== -1) {
      if (tracks[idx].progress < 5) {
        tracks[idx].progress += 1;
      }
    } else {
      tracks.push({ language: language.charAt(0).toUpperCase() + language.slice(1), progress: 1 });
    }
    localStorage.setItem('dojo_progress', JSON.stringify(tracks));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setConsoleOutput("Compiling & Executing...");
    
    try {
      let out = "";
      let stdoutLog = "";
      const langId = language.toLowerCase();
      const q = questions[currentQuestion];

      if (langId === 'javascript' || langId === 'python' || langId === 'c++' || langId === 'cpp' || langId === 'java') {
        const apiLangId = langId === 'c++' ? 'cpp' : langId;
        try {
          const res = await fetch('/api/compiler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: apiLangId, code })
          });
          const data = await res.json();
          
          if (data.hasError) {
            out = `Runtime Error: \n${data.output}`;
          } else {
            stdoutLog = data.output || '';
            out = stdoutLog || "Execution finished with no output.";
          }
        } catch (err: any) {
          out = `Connection Error: ${err.message}`;
        }
      } else {
        // Default to compiler API for any other languages that might be added
        try {
          const res = await fetch('/api/compiler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: langId, code })
          });
          const data = await res.json();
          if (data.hasError) {
            out = `Runtime Error: \n${data.output}`;
          } else {
            stdoutLog = data.output || '';
            out = stdoutLog || "Execution finished with no output.";
          }
        } catch (err: any) {
          out = `Connection Error: ${err.message}`;
        }
      }

      // 2. Evaluation Logic
      const isError = out.toLowerCase().includes("error") || out.toLowerCase().includes("exception") || out.toLowerCase().includes("traceback");
      
      // Real check: does the execution stdout contain the expected output?
      const expectedOutputStr = String(q.output).trim().replace(/['"]/g, '');
      const actualOutputStr = String(stdoutLog).trim().replace(/['"]/g, '');
      
      let isCorrect = false;
      if (!isError) {
        if (actualOutputStr.includes(expectedOutputStr)) {
          isCorrect = true;
        }
      }

      // Format the terminal display to show the test results
      let terminalDisplay = `[Compiler Engine] Execution Complete\n\n`;
      terminalDisplay += `Test Case 1: Input: ${q.input}\n`;
      terminalDisplay += `Expected Output: ${q.output}\n`;
      terminalDisplay += `Actual Output  : ${stdoutLog || 'None'}\n`;
      terminalDisplay += `Status         : ${isCorrect ? 'PASS ✅' : 'FAIL ❌'}\n\n`;
      terminalDisplay += isError ? out : '';

      setConsoleOutput(terminalDisplay);

      const newScore = score + (isCorrect ? 1 : 0);
      if (isCorrect) {
        setScore(newScore);
      }
      
      setTimeout(async () => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setConsoleOutput("");
          // Reset Code to blank
          if (langId === 'javascript') {
            setCode(`// Implement the solution in JS\nconsole.log("");`);
          } else if (langId === 'python') {
            setCode(`# Implement the solution in Python\nprint("")`);
          } else {
            setCode(`// Write your solution here`);
          }
        } else {
          setFinished(true);
          if (newScore >= 3) {
            handleLevelUp();
            const confetti = (await import('canvas-confetti')).default;
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          }
        }
        setIsSubmitting(false);
      }, 2500);

    } catch (err) {
      setConsoleOutput("Execution Error: Fatal Sandbox Crash.");
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) return null;

  if (finished) {
    const passed = score >= 3;
    const nextBelt = BELTS[Math.min(level + 1, 5)];

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {passed ? (
            <div className="bg-gradient" style={{ padding: '16px', borderRadius: '50%', marginBottom: '24px', boxShadow: '0 0 30px var(--primary-glow)' }}>
              <Trophy size={48} color="white" />
            </div>
          ) : (
            <div style={{ padding: '16px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '24px' }}>
              <XCircle size={48} color="#ef4444" />
            </div>
          )}
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: 'white' }}>
            {passed ? "Belt Earned!" : "Workout Failed"}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '15px' }}>
            You passed {score} out of 5 challenges.
          </p>
          {passed && level < 5 && (
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', padding: '12px 24px', borderRadius: '12px', marginBottom: '24px' }}>
              <p style={{ color: 'white', margin: 0, fontWeight: 700 }}>You advanced to <span style={{ color: 'var(--primary)' }}>{nextBelt} Belt</span>.</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>The next workout will feature harder questions.</p>
            </div>
          )}
          {!passed && (
            <p style={{ color: '#ef4444', marginBottom: '24px', fontSize: '14px', fontWeight: 600 }}>
              You need to pass at least 3 to earn the next belt.
            </p>
          )}
          <button 
            onClick={() => router.push('/dojo')}
            style={{ width: '100%', padding: '16px', background: passed ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: 'white', border: passed ? 'none' : '1px solid var(--card-border)', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: passed ? '0 10px 20px rgba(59, 130, 246, 0.3)' : 'none', marginTop: passed && level < 5 ? 0 : '20px' }}>
            Return to CZ Workouts
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/dojo" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }}>
          <ArrowLeft size={20} /> Abort Workout
        </Link>
        <div style={{ width: '1px', height: '24px', background: 'var(--card-border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Code2 size={24} color="var(--primary)" />
          <h1 style={{ fontSize: '20px', fontWeight: 800, textTransform: 'capitalize', margin: 0 }}>{language} {BELTS[level]} Belt Test</h1>
        </div>
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
            Challenge <span style={{ color: 'white' }}>{currentQuestion + 1}</span> of 5
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: timeLeft < 300 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: timeLeft < 300 ? '#ef4444' : 'var(--primary)', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, border: `1px solid ${timeLeft < 300 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'}` }}>
            <Clock size={16} /> {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, gap: '32px', padding: '0 32px 32px 32px', height: 'calc(100vh - 80px)' }}>
        {/* Left Pane: Question Description */}
        <div className="glass-card" style={{ width: '400px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', margin: 0 }}>
              {q.title}
            </h2>
          </div>
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '32px' }}>
              {q.desc}
            </p>

            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Example Input</h3>
              <code style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: '"Fira Code", monospace' }}>
                {q.input}
              </code>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Expected Output</h3>
              <code style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: '"Fira Code", monospace' }}>
                {q.output}
              </code>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor + Console */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              language={language.toLowerCase() === 'c++' ? 'cpp' : language.toLowerCase()}
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: '"Fira Code", Consolas, monospace',
                padding: { top: 24 }
              }}
            />
          </div>
          
          {/* Output Terminal Area */}
          <div style={{ height: '180px', background: '#020617', borderTop: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px 16px', background: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #1e293b' }}>
              <Terminal size={14} color="var(--primary)" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Compiler Output
              </span>
            </div>
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', fontFamily: '"Fira Code", monospace', fontSize: '13px', color: consoleOutput.toLowerCase().includes('error') ? '#ef4444' : '#10b981', whiteSpace: 'pre-wrap' }}>
              {consoleOutput || <span style={{ color: '#475569' }}>// Awaiting execution...</span>}
            </div>
          </div>

          <div style={{ padding: '16px 24px', background: '#0f172a', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Simulating Test Execution Environment</span>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ 
                background: isSubmitting ? 'var(--card-bg)' : 'var(--primary)', 
                color: 'white', 
                border: 'none', 
                padding: '12px 32px', 
                borderRadius: '12px',
                fontSize: '14px', 
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isSubmitting ? 'none' : '0 10px 20px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              {isSubmitting ? (
                "Compiling..."
              ) : (
                <>
                  <Play size={16} fill="white" /> Run Tests & Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
