import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

// this is a reference. when needed, build appropriate API routes

const secret = process.env.TOKEN_SECRET!;

export function compareId(request: NextRequest, paramId: string) {
  try {
    const session = request.cookies.get('session')?.value || '';
    const decodedSession = jwt.verify(session, secret);
    let idFromSession = '';
    if (typeof decodedSession !== 'string' && 'id' in decodedSession) {
      idFromSession = decodedSession.id;
    }
    if (idFromSession !== paramId) {
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
    const session = request.cookies.get('session')?.value || '';
    const decodedSession = jwt.verify(session, secret);
    let roleFromToken = '';
    if (typeof decodedSession !== 'string' && 'role' in decodedSession) {
      roleFromToken = decodedSession.role;
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
