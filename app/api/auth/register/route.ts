import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { createSession, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!name || !email || password.length < 8) {
    return NextResponse.json({ error: 'Name, email, and a password of at least 8 characters are required.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      role: body.role || 'Freelancer',
      experience: body.experience || 'Intermediate',
      preferredStyle: body.preferredStyle || 'Professional',
      mainGoal: body.mainGoal || 'Better contract value & lower risk',
    },
  });

  await createSession(user.id);
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
}
