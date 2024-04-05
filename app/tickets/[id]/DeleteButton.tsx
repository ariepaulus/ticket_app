'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import Error from 'next/error';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DeleteButton = ({ ticketId }: { ticketId: number }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTicket = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error({
          message: 'Something went wrong!',
          statusCode: 500,
        });
      }

      router.push('/tickets');
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
      setError('Unknown error occurred!');
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          className={buttonVariants({
            variant: 'destructive',
          })}
          disabled={isDeleting}
        >
          Delete Ticket
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your ticket and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={buttonVariants({
                variant: 'default',
              })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({
                variant: 'destructive',
              })}
              disabled={isDeleting}
              onClick={deleteTicket}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className='text-destructive'>{error}</p>
    </>
  );
};

export default DeleteButton;
