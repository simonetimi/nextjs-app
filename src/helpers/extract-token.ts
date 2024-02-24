import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function extractToken(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || '';
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!);
    if (typeof decodedToken !== 'string' && 'id' in decodedToken) {
      return decodedToken.id;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}
