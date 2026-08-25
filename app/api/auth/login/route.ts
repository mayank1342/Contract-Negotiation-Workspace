import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { createSession, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
