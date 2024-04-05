import prisma from '@/prisma/db';
import TicketDetail from './TicketDetail';

interface Props {
  params: { id: string };
}

const ViewTicket = async ({ params }: Props) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!ticket) {
      return <p className='text-destructive'>Ticket not found!</p>;
    }

    return <TicketDetail ticket={ticket} />;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return <p className='text-destructive'>Error fetching ticket! Please try again later.</p>;
  }
};

export default ViewTicket;
