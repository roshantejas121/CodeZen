import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, repoName, description, files } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'GitHub Personal Access Token is required.' }, { status: 401 });
    }
    if (!repoName) {
      return NextResponse.json({ error: 'Repository name is required.' }, { status: 400 });
    }

    // 1. Verify the token and get the authenticated user
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      const err = await userRes.json();
      return NextResponse.json({ error: `GitHub Auth Failed: ${err.message}` }, { status: 401 });
    }

    const githubUser = await userRes.json();

    // 2. Create the repository on GitHub
    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        description: description || 'Created with CodeZen',
        private: false,
        auto_init: true, // Creates with a default README so we can push files
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      return NextResponse.json({ error: err.message }, { status: createRes.status });
    }

    const repo = await createRes.json();

    // 3. Push scaffold files if provided
    if (files && files.length > 0) {
      for (const file of files) {
        const content = Buffer.from(file.content).toString('base64');
        await fetch(`https://api.github.com/repos/${githubUser.login}/${repoName}/contents/${file.path}`, {
          method: 'PUT',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `feat: add ${file.path} [CodeZen scaffold]`,
            content,
          }),
        });
      }
    }

    return NextResponse.json({
      success: true,
      repoUrl:  repo.html_url,
      cloneUrl: repo.clone_url,
      owner:    githubUser.login,
      repoName: repo.name,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create repository' }, { status: 500 });
  }
}
