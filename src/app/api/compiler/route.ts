import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    // Map internal language IDs to Piston API IDs with robust versioning
    const langMap: Record<string, any> = {
      'javascript': { language: 'javascript', version: '*' },
      'python': { language: 'python3', version: '*' },
      'cpp': { language: 'cpp', version: '*' },
      'java': { language: 'java', version: '*' },
      'rust': { language: 'rust', version: '*' },
      'sql': { language: 'sqlite3', version: '*' },
      'go': { language: 'go', version: '*' }
    };

    const target = langMap[language];

    if (!target) {
      return NextResponse.json({ output: 'Render successful (Web Mode).' });
    }

    // Call the Piston API with a timeout and robust error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: target.language,
        version: target.version,
        files: [{ content: code }]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const result = await response.json();

    if (result.message) {
      // Piston returned an error message (e.g., "language not found")
      return NextResponse.json({ output: `Engine Error: ${result.message}\nTry checking your syntax or language settings.` });
    }

    if (result.run) {
      // Prioritize stderr if stdout is empty to show actual compilation/runtime errors
      const output = result.run.stdout || result.run.stderr || 'Execution finished with no output.';
      return NextResponse.json({ output });
    }

    return NextResponse.json({ output: 'Technical Fault: Execution node did not return a valid result.' });

  } catch (error: any) {
    console.error('Compiler Fault:', error);
    const message = error.name === 'AbortError' ? 'Execution Timed Out' : 'Compiler service unavailable';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
