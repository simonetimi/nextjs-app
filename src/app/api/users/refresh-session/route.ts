import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.TOKEN_SECRET!;

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found. Log in first' },
        { status: 401 },
      );
    }
    const decodedSession = jwt.verify(session, secret) as JwtPayload;
    const newSession = {
      id: decodedSession.id,
      username: decodedSession.username,
      email: decodedSession.email,
      role: decodedSession.role,
    };
    const updatedSession = jwt.sign(newSession, secret, { expiresIn: '1h' });
    const response = NextResponse.json({
      message: 'Session updated',
      success: true,
    });
    response.cookies.set('session', updatedSession, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 3, // 1 hour
      secure: true,
    });
    return response;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid session token. Log in again.' },
        { status: 401 },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
