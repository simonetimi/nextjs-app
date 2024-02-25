import { genSalt, hash } from 'bcrypt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { object, string } from 'yup';

import { connect } from '@/db/db-config';
import { sendEmail } from '@/helpers/mailer';
import type { UserInt } from '@/models/user';
import User from '@/models/user';

interface ReqBody {
  username: string;
  email: string;
  password: string;
}

const specialCharRegex = /[^A-Za-z0-9]/; // Matches special characters
const numberRegex = /\d/; // Matches numbers
const lowercaseRegex = /[a-z]/; // Matches lowercase letters
const uppercaseRegex = /[A-Z]/; // Matches uppercase letters

const inputSchema = object({
  email: string().email().lowercase().trim().min(4).max(254).required(),
  password: string()
    .trim()
    .min(6)
    .max(256)
    .matches(
      specialCharRegex,
      'Password must contain at least one special character',
    )
    .matches(numberRegex, 'Password must contain at least one number')
    .matches(
      lowercaseRegex,
      'Password must contain at least one lowercase letter',
    )
    .matches(
      uppercaseRegex,
      'Password must contain at least one uppercase letter',
    )
    .required(),
  username: string().min(3).max(32).required(),
});

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = (await request.json()) as ReqBody;

    // validate and sanitize user data
    const { username, email, password } = await inputSchema.validate(reqBody);

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

    // send verification email
    await sendEmail(savedUser.email, 'verify', savedUser._id);

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
