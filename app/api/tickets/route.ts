import { ticketSchema } from '@/ValidationSchemas/ticket';
import prisma from '@/prisma/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import options from '../auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  console.log('session?.user [/app/api/tickets/route.ts] => ', session?.user);
  console.log('session?.user?.role [/app/api/tickets/route.ts] => ', session?.user?.role);

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated!' }, { status: 401 });
  }

  const body = await req.json();
  const validation = ticketSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const newTicket = await prisma.ticket.create({
    data: { ...body },
  });

  return NextResponse.json(newTicket, { status: 201 });
}
