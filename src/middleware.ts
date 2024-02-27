import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // check if user is logged in or not (has token) and redirect to appropriate paths
  const publicPaths = [
    '/login',
    '/signup',
    '/verify-email',
    '/password-reset',
    '/request-password-reset',
  ];
  const isPublicPath = publicPaths.includes(path);
  const token = request.cookies.get('session');
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/profile/:id*',
    '/verify-email',
    '/password-reset',
    '/request-password-reset',
  ],
};
