import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function extractId(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value || '';
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
