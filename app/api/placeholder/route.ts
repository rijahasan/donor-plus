import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const width = searchParams.get('width') || '200';
    const height = searchParams.get('height') || '200';

    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f1f5f9"/>
      <circle cx="${parseInt(width) / 2}" cy="${parseInt(height) / 2}" r="${Math.min(parseInt(width), parseInt(height)) / 4}" fill="#e11d48"/>
      <path d="M${parseInt(width) / 2 - 20},${parseInt(height) / 2 + 15} L${parseInt(width) / 2},${parseInt(height) / 2 - 15} L${parseInt(width) / 2 + 20},${parseInt(height) / 2 + 15} Z" fill="white"/>
    </svg>
  `;

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}
