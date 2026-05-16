import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map<string, { count: number; start: number }>();

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
      { error: 'Cok fazla istek. Lutfen 1 dakika bekleyin.', code: 'RATE_LIMIT_EXCEEDED' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};