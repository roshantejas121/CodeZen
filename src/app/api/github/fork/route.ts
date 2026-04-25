import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { owner, repo } = await request.json();
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json({ 
        error: "Missing GITHUB_TOKEN. Please add your GitHub Personal Access Token to the .env file to enable the Forking feature." 
      }, { status: 401 });
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/forks`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ 
      success: true, 
      fork_url: data.html_url,
      full_name: data.full_name 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to initiate fork' }, { status: 500 });
  }
}
