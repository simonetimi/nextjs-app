import { NextRequest, NextResponse } from 'next/server';

import { connect } from '@/db/db-config';

export default async function POST(request: NextRequest) {
  try {
    await connect();
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
