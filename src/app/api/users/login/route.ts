import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { object, string } from 'yup';

import { connect } from '@/db/db-config';
import type { UserInt } from '@/models/user';
import User from '@/models/user';

interface ReqBody {
  email: string;
  password: string;
}

const inputSchema = object({
  email: string().email().lowercase().trim().min(4).max(254).required(),
  password: string().trim().min(6).max(256).required(),
});

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = (await request.json()) as ReqBody;

    // validate and sanitize user data
    const { email, password } = await inputSchema.validate(reqBody);

    // check if user exists
    const user: UserInt | null = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    // typing check for password
    if (typeof user.password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid password format' },
        { status: 500 },
      );
    }

    // check if password is correct
    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      return Response.json({ error: 'Wrong password' }, { status: 400 });
    }

    // create a token for authenticating the user
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const secret: string = process.env.TOKEN_SECRET!;
    const token: string = sign(tokenData, secret, {
      expiresIn: '1h',
    });
    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
    });
    response.cookies.set('token', token, { httpOnly: true });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
