import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should be protected by authentication
const protectedPaths = [
  '/marketplace/my-agents',
  '/marketplace/settings',
  '/marketplace/usage-analytics',
  '/marketplace/developer-analytics',
  '/marketplace/my-published-agents',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // Check if the path is protected and user is not authenticated
  if (protectedPaths.some(path => pathname.startsWith(path)) && !token) {
    // Instead of redirecting to login, we'll redirect to marketplace
    // The Dynamic widget will handle the authentication
    const url = new URL('/marketplace', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/marketplace/:path*',
  ],
}; 