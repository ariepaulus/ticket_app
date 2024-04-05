import TicketPriority from '@/components/TicketPriority';
import TicketStatusBadge from '@/components/TicketStatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Ticket } from '@prisma/client';
import Link from 'next/link';
import { SearchParams } from './page';
import { ArrowDown } from 'lucide-react';
interface Props {
  tickets: Ticket[];
  searchParams: SearchParams;
}

const DataTable = ({ tickets, searchParams }: Props) => {
  // console.log('Hello from DataTable');

  return (
    <div className='w-full mt-5'>
      <div className='rounded-md sm:border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Link href={{ query: { ...searchParams, orderBy: 'title' } }}>Title</Link>
                {'title' === searchParams.orderBy && <ArrowDown className='inline p-1' />}
              </TableHead>
              <TableHead>
                <div className='flex justify-center'>
                  <Link href={{ query: { ...searchParams, orderBy: 'status' } }}>Status</Link>
                  {'status' === searchParams.orderBy && <ArrowDown className='inline p-1' />}
                </div>
              </TableHead>

              <TableHead>
                <div className='flex justify-center'>
                  <Link href={{ query: { ...searchParams, orderBy: 'priority' } }}>Priority</Link>
                  {'priority' === searchParams.orderBy && <ArrowDown className='inline p-1' />}
                </div>
              </TableHead>

              <TableHead>
                <Link href={{ query: { ...searchParams, orderBy: 'createdAt' } }}>Created At</Link>
                {'createdAt' === searchParams.orderBy && <ArrowDown className='inline p-1' />}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets
              ? tickets.map(ticket => (
                  <TableRow key={ticket.id} data-href='/'>
                    <TableCell>
                      <Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <TicketStatusBadge status={ticket.status} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-center'>
                        <TicketPriority priority={ticket.priority} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {ticket.updatedAt.toLocaleDateString('en-ZA', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
