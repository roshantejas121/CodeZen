import { NextResponse } from 'next/server';

// Judge0 Language IDs (verified 2026-04-27)
const JUDGE0_MAP: Record<string, number> = {
  javascript: 93, typescript: 94, python: 92, cpp: 105, java: 91,
  rust: 108, go: 106, csharp: 51, sql: 82, ruby: 72,
  swift: 83, kotlin: 111, php: 98, bash: 46, lua: 64, r: 99
};

// Piston Fallback Map
const PISTON_MAP: Record<string, { language: string; version: string }> = {
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  python:     { language: 'python',     version: '3.10.0' },
  cpp:        { language: 'c++',        version: '10.2.0' },
  java:       { language: 'java',       version: '15.0.2' },
  rust:       { language: 'rust',       version: '1.68.2' },
  go:         { language: 'go',         version: '1.16.2' },
  ruby:       { language: 'ruby',       version: '3.0.1' },
  swift:      { language: 'swift',      version: '5.3.3' },
  kotlin:     { language: 'kotlin',     version: '1.8.20' },
  sql:        { language: 'sqlite3',    version: '3.36.0' },
  csharp:     { language: 'csharp',     version: '6.12.0' },
  php:        { language: 'php',        version: '8.2.3' },
  bash:       { language: 'bash',       version: '5.2.0' },
  lua:        { language: 'lua',        version: '5.4.4' },
  r:          { language: 'rscript',    version: '4.1.1' },
};

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    // 1. Try Judge0 CE (Primary - High Performance)
    const judgeId = JUDGE0_MAP[language];
    if (judgeId) {
      try {
        const res = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source_code: code, language_id: judgeId }),
          signal: controller.signal
        });

        if (res.ok) {
          const result = await res.json();
          clearTimeout(timeoutId);
          const output = result.stdout || result.stderr || result.compile_output || 'Code executed with no output.';
          return NextResponse.json({ output, hasError: !!(result.stderr || result.compile_output) });
        }
      } catch (e) {
        console.error('Judge0 Failure:', e);
      }
    }

    // 2. Fallback to Piston (Secondary)
    const target = PISTON_MAP[language];
    if (target) {
      const extMap: any = { javascript: 'js', typescript: 'ts', python: 'py', cpp: 'cpp', java: 'java', rust: 'rs' };
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
        body: JSON.stringify({
          language: target.language,
          version: target.version,
          files: [{ name: `main.${extMap[language] || 'txt'}`, content: code }]
        }),
        signal: controller.signal
      });

      if (response.ok) {
        const result = await response.json();
        clearTimeout(timeoutId);
        const output = result.run.stdout || result.run.stderr || 'Program exited with no output.';
        return NextResponse.json({ output, hasError: !!result.run.stderr });
      }
    }

    clearTimeout(timeoutId);
    return NextResponse.json({ output: 'Compiler services are currently overwhelmed. Please try again in a few seconds.' }, { status: 503 });

  } catch (error: any) {
    if (error.name === 'AbortError') return NextResponse.json({ output: 'Execution timed out (12s limit).' });
    return NextResponse.json({ output: 'Internal Compiler Fault. Please check your code syntax.' });
  }
}
