import { NextRequest, NextResponse } from 'next/server';

import { connect } from '@/db/db-config';
import { extractId } from '@/helpers/extract-id';
import User from '@/models/user';

export async function GET(request: NextRequest) {
  try {
    connect();
    const userId = await extractId(request);
    const user = await User.findById({ _id: userId }).select('-password');
    return NextResponse.json(
      { message: 'User found', user: user },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
