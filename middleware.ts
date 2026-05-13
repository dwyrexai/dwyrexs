import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika
const RATE_LIMIT_MAX = 30; // max 30 istek/dakika

const rateLimitMap = new Map<string, { count: number; start: number }>();

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Sadece API rotalarını koru
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') || 'unknown';

  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(key, { count: 1, start: now });
    return NextResponse.next();
  }

  record.count++;

  if (record.count > RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: 'Çok fazla istek. Lütfen 1 dakika bekleyin.', code: 'RATE_LIMIT_EXCEEDED' },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil((record.start + RATE_LIMIT_WINDOW) / 1000)),
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
  response.headers.set('X-RateLimit-Remaining', String(RATE_LIMIT_MAX - record.count));
  return response;
}

export const config = {
  matcher: '/api/:path*',
};