import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch: ${response.status}` }, { status: response.status });
    }

    const html = await response.text();

    let title = null;
    
    // 1. Try to find og:title
    const ogMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["'][^>]*>/i);
    
    if (ogMatch && ogMatch[1]) {
      title = ogMatch[1];
    } else {
      // 2. Fallback to <title>
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }
    }

    if (title) {
      // Basic HTML entity decoding
      title = title
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&#x27;/g, "'");
    }

    return NextResponse.json({ title });
  } catch (error) {
    console.error("Link preview error:", error);
    return NextResponse.json({ error: 'Failed to extract link preview' }, { status: 500 });
  }
}
