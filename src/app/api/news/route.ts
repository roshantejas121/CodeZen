import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch real news from a public Tech news RSS feed converted to JSON
    // Using a reliable open API that aggregates dev news
    const response = await fetch('https://dev.to/api/articles?per_page=5&top=7');
    const articles = await response.json();

    const formattedNews = articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      source: article.user.name,
      time: new Date(article.published_at).toLocaleDateString(),
      category: article.tag_list[0]?.toUpperCase() || 'TECH',
      url: article.url
    }));
    
    return NextResponse.json(formattedNews);
  } catch (error) {
    // Fallback if API fails
    return NextResponse.json([
      { id: 1, title: 'Next.js 15: The Future of Server Components', source: 'Vercel Blog', time: '1h ago', category: 'Frameworks' },
      { id: 2, title: 'TypeScript 5.7 Beta Released', source: 'Microsoft Dev', time: '5h ago', category: 'Languages' },
    ]);
  }
}
