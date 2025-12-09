import { NextResponse } from 'next/server';
import { refineEmail } from '@/actions/email/refine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await refineEmail({
      email: body.email,
      instruction: body.instruction,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
