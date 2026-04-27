import { NextResponse } from 'next/server';
export const maxDuration = 60; // Extend Vercel function timeout to 60s for huge code
export const dynamic = 'force-dynamic';

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
  let lastStatus: number | undefined;
  try {
    const { code, language } = await req.json();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // Increased to 25s for large code

    // 1. Try Judge0 CE (Primary - High Performance)
    const judgeId = JUDGE0_MAP[language];
    if (judgeId) {
      try {
        const base64Code = Buffer.from(code).toString('base64');
        const res = await fetch('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'https://devgrowth-beta.vercel.app'
          },
          body: JSON.stringify({ 
            source_code: base64Code, 
            language_id: judgeId,
            cpu_time_limit: 10, // 10s CPU time
            wall_time_limit: 20, // 20s Wall time
            memory_limit: 512000 // 512MB RAM
          }),
          signal: controller.signal
        });

        if (res.ok) {
          const result = await res.json();
          clearTimeout(timeoutId);
          
          const decode = (str: string) => str ? Buffer.from(str, 'base64').toString('utf8') : '';
          const stdout = decode(result.stdout);
          const stderr = decode(result.stderr);
          const compile_output = decode(result.compile_output);
          
          const output = stdout || stderr || compile_output || 'Code executed with no output.';
          return NextResponse.json({ output, hasError: !!(stderr || compile_output) });
        }
        lastStatus = res.status;
      } catch (e) {
        console.error('Judge0 Failure:', e);
      }
    }

    // 2. Fallback to Piston Mirrors
    const target = PISTON_MAP[language];
    if (target) {
      const mirrors = [
        'https://piston.engineer/api/v2/execute',
        'https://emkc.org/api/v2/piston/execute',
        'https://piston.piston.engineer/api/v2/execute'
      ];

      for (const url of mirrors) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0',
              'Referer': 'https://devgrowth-beta.vercel.app'
            },
            body: JSON.stringify({
              language: target.language,
              version: target.version,
              files: [{ name: `main.txt`, content: code }],
              run_timeout: 20000, // 20s
              compile_timeout: 20000
            }),
            signal: controller.signal
          });

          if (response.ok) {
            const result = await response.json();
            clearTimeout(timeoutId);
            const output = (result.run.stdout || result.run.stderr || 'Program exited with no output.').trim();
            return NextResponse.json({ output, hasError: !!result.run.stderr });
          }
          lastStatus = response.status;
        } catch (e) {
          console.error(`Piston Mirror Failure (${url}):`, e);
        }
      }
    }

    clearTimeout(timeoutId);
    return NextResponse.json({ 
      output: `Compiler services overwhelmed or returned error (${lastStatus}). For huge code, try optimized algorithms.` 
    }, { status: lastStatus || 500 });

  } catch (error: any) {
    if (error.name === 'AbortError') return NextResponse.json({ output: 'Execution timed out (25s limit). For heavy computations, use more efficient code.' });
    return NextResponse.json({ output: 'Internal Compiler Fault. Payload might be too large for public clusters.' });
  }
}
