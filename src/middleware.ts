import { jwtVerify, SignJWT } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = request.cookies.get('session')?.value;
  const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);

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
    const { payload } = await jwtVerify(session, secret);
    const newToken = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role,
    };
    // create refreshed token
    const alg = 'HS256';
    const newSession: string = await new SignJWT(newToken)
      .setProtectedHeader({ alg })
      .setExpirationTime('1h')
      .sign(secret);

    // if logged user is accessing a public resource, redirect to the main app resource and refresh session
    if (isPublicPath) {
      const response = NextResponse.redirect(
        new URL('/profile', request.nextUrl),
      );

      // manually set the 'Set-Cookie' header for the redirect response
      response.headers.append(
        'Set-Cookie',
        `session=${newSession}; HttpOnly; SameSite=Strict; Max-Age=3600; Secure`,
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
        maxAge: 3600, // 1 hour
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
