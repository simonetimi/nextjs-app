import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { genSalt, hash } from 'bcrypt';
import { connect } from '@/db/db-config';
import type { UserInt } from '@/models/user';
import User from '@/models/user';

interface ReqBody {
  username: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = (await request.json()) as ReqBody;
    const { username, email, password } = reqBody;

    // check if user exists
    const user = await User.findOne({
      $or: [{ username }, { email }],
    }).exec();

    if (user) {
      // Determine the type of error based on what matched
      const errorField = user.username === username ? 'Username' : 'Email';
      return NextResponse.json(
        { error: `${errorField} already in use` },
        { status: 400 },
      );
    }

    // hash & salt password
    const salt = await genSalt(12);
    const hashedPassword = await hash(password, salt);

    //create new user
    const newUser = (await new User({
      username,
      email,
      password: hashedPassword,
    })) as UserInt;
    const savedUser = await newUser.save();
    return NextResponse.json({
      message: 'User created successfully',
      success: true,
      savedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
