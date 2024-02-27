import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.TOKEN_SECRET!;

export function updateSession(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Session not found. Log in first' },
        { status: 401 },
      );
    }
    const decodedToken = jwt.verify(token, secret) as JwtPayload;
    const newToken = {
      id: decodedToken.id,
      username: decodedToken.username,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    const updatedToken = jwt.sign(newToken, secret, { expiresIn: '1h' });
    const response = NextResponse.json({
      message: 'Session updated',
      success: true,
    });
    response.cookies.set('session', updatedToken, {
      httpOnly: true,
      sameSite: 'strict',
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

export function compareId(request: NextRequest, paramId: string) {
  try {
    const token = request.cookies.get('session')?.value || '';
    const decodedToken = jwt.verify(token, secret);
    let idFromToken = '';
    if (typeof decodedToken !== 'string' && 'id' in decodedToken) {
      idFromToken = decodedToken.id;
    }
    if (idFromToken !== paramId) {
      return NextResponse.json(
        { error: 'User not authorized' },
        { status: 403 },
      );
    }
    const response = NextResponse.json({
      message: 'The ID matches with the token. User authorized',
      success: true,
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export function checkRole(request: NextRequest, paramRole: string) {
  try {
    const token = request.cookies.get('session')?.value || '';
    const decodedToken = jwt.verify(token, secret);
    let roleFromToken = '';
    if (typeof decodedToken !== 'string' && 'role' in decodedToken) {
      roleFromToken = decodedToken.role;
    }
    if (roleFromToken !== paramRole) {
      return NextResponse.json(
        { error: 'User not authorized' },
        { status: 403 },
      );
    }
    const response = NextResponse.json({
      message: 'The role matches with the token. User authorized',
      success: true,
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
