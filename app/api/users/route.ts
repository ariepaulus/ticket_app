import { userSchema } from '@/ValidationSchemas/users';
import prisma from '@/prisma/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import options from '../auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  console.log('session?.user [/app/api/users/route.ts]', session?.user);
  console.log('session?.user?.role [/app/api/users/route.ts]', session?.user?.role);

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated!' }, { status: 401 });
  }

  if (session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not Admin!' }, { status: 401 });
  }

  const body = await req.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const duplicate = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });

  if (duplicate) {
    return NextResponse.json({ message: 'Duplicate username! Please choose another one.' }, { status: 409 });
  }

  const hashPassword = await bcrypt.hash(body.password, 10);
  body.password = hashPassword;

  const newUser = await prisma.user.create({
    data: { ...body },
  });

  // console.log(newUser);

  return NextResponse.json(newUser, { status: 201 });
}
