'use client';

import { Ticket, User } from '@prisma/client';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Props {
  ticket: Ticket;
  users: User[];
}

const AssignTicket = ({ ticket, users }: Props) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState('');

  const assignTicket = async (userId: string) => {
    setError('');
    setIsAssigning(true);

    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToUserId: userId === '0' ? null : userId }),
      });

      if (!res.ok) {
        throw new Error('Unable to assign ticket');
      }
      setIsAssigning(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <>
      <Select
        defaultValue={ticket.assignedToUserId?.toString() || '0'}
        onValueChange={assignTicket}
        disabled={isAssigning}
      >
        <SelectTrigger>
          <SelectValue placeholder='Select user...' defaultValue={ticket.assignedToUserId?.toString() || '0'} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='0'>Unassign</SelectItem>
          {users?.map(user => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className='text-destructive'>{error}</p>
    </>
  );
};

export default AssignTicket;
