import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    // Map internal language IDs to Piston API IDs
    const langMap: Record<string, any> = {
      'javascript': { language: 'js', version: '18.15.0' },
      'python': { language: 'python', version: '3.10.0' },
      'cpp': { language: 'cpp', version: '10.2.0' },
      'java': { language: 'java', version: '15.0.2' },
      'rust': { language: 'rust', version: '1.68.2' },
      'sql': { language: 'sqlite3', version: '3.36.0' },
      'go': { language: 'go', version: '1.16.2' }
    };

    const target = langMap[language];

    if (!target) {
      // For HTML/CSS, the frontend handles preview, but we return a success status
      return NextResponse.json({ output: 'Code processed successfully.' });
    }

    // Call the Piston API for genuine execution
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: target.language,
        version: target.version,
        files: [{ content: code }]
      })
    });

    const data = await response.json();
    
    if (data.run) {
      return NextResponse.json({
        output: data.run.output,
        stdout: data.run.stdout,
        stderr: data.run.stderr,
        code: data.run.code
      });
    }

    return NextResponse.json({ error: "Compilation failed" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Compiler service unavailable' }, { status: 500 });
  }
}
