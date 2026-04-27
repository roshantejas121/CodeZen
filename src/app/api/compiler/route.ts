import { NextResponse } from 'next/server';

// Pinned, verified Piston runtimes (confirmed live 2026-04-27)
const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
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
  r:          { language: 'r',          version: '4.1.1' },
};

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    const target = LANGUAGE_MAP[language];

    if (!target) {
      return NextResponse.json({ output: `Language '${language}' not supported. Supported languages: ${Object.keys(LANGUAGE_MAP).join(', ')}` });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: target.language,
        version: target.version,
        files: [{ content: code }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json({ output: `Compiler service returned an error (${response.status}). Please try again.` });
    }

    const result = await response.json();

    if (result.message) {
      return NextResponse.json({ output: `Compilation Error: ${result.message}` });
    }

    if (result.run) {
      const stdout = result.run.stdout?.trim();
      const stderr = result.run.stderr?.trim();
      const output = stdout || stderr || 'Program exited with no output.';
      return NextResponse.json({ output, hasError: !!stderr && !stdout });
    }

    return NextResponse.json({ output: 'No output received from execution engine.' });

  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ output: 'Execution timed out (12s limit). Optimize your code or check for infinite loops.' });
    }
    console.error('Compiler Fault:', error);
    return NextResponse.json({ output: 'Compiler service is temporarily unavailable. Please try again.' });
  }
}
