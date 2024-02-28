import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const secret = process.env.TOKEN_SECRET!;

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = request.cookies.get('session')?.value;

  // check if user is logged in or not (has token) and redirect to appropriate paths
  const publicPaths = [
    '/login',
    '/signup',
    '/verify-email',
    '/password-reset',
    '/request-password-reset',
  ];
  const isPublicPath = publicPaths.includes(path);

  // anonymous (not logged) user should be redirected to login if trying to access app resources
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (session) {
    // decode token
    const decodedSession = jwt.verify(session, secret) as JwtPayload;
    const newToken = {
      id: decodedSession.id,
      username: decodedSession.username,
      email: decodedSession.email,
      role: decodedSession.role,
    };
    // create refreshed token
    const newSession = jwt.sign(newToken, secret, { expiresIn: '1h' });

    // if logged user is accessing a public resource, redirect to the main app resource and refresh session
    if (isPublicPath) {
      const url = new URL('/profile', request.nextUrl).toString();
      const response = NextResponse.redirect(url);

      // manually set the 'Set-Cookie' header for the redirect response
      response.headers.append(
        'Set-Cookie',
        `session=${newSession}; HttpOnly; SameSite=Strict; Max-Age=5; Secure`,
      );
      return response;
    }

    // if logged user is accessing a private resource, simply update the session without redirect
    if (!isPublicPath) {
      const response = NextResponse.json({
        message: 'Session updated',
        success: true,
      });

      // set the cookie using response
      response.cookies.set('session', newSession, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 5, // 1 hour
        secure: true,
      });

      return response;
    }
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
