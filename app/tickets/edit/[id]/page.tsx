import prisma from '@/prisma/db';
import dynamic from 'next/dynamic';

interface Props {
  params: { id: string };
}

const TicketForm = dynamic(() => import('@/components/TicketForm'), { ssr: false });

const EditTicket = async ({ params }: Props) => {
  try {
    const ticket = await prisma?.ticket.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!ticket) {
      return <p className='text-destructive'>Ticket not found!</p>;
    }

    return <TicketForm ticket={ticket} />;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return <p className='text-destructive'>Error fetching ticket! Please try again later.</p>;
  }
};

export default EditTicket;
