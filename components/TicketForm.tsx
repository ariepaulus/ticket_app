'use client';

import { ticketSchema } from '@/ValidationSchemas/ticket';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket } from '@prisma/client';

type TicketFormData = z.infer<typeof ticketSchema>;

interface Props {
  ticket?: Ticket;
}

const TicketForm = ({ ticket }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    try {
      setIsSubmitting(true);
      setError(null);

      if (ticket) {
        // Send PATCH request to /api/tickets/:id
        const response = await fetch(`/api/tickets/${ticket.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to update ticket!');
        }
      } else {
        // Send POST request to /api/tickets
        const response = await fetch('/api/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to submit ticket!');
        }
      }

      setIsSubmitting(false);
      router.push('/tickets');
      router.refresh();
    } catch (error) {
      // console.log(error);
      setError('Unauthorized! You are not authenticated. Please login to continue.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className='rounded-md border w-full p-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <FormField
            control={form.control}
            name='title'
            defaultValue={ticket?.title || ''}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Title</FormLabel>
                <FormControl>
                  <Input placeholder='Ticket Title...' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Controller
            name='description'
            defaultValue={ticket?.description}
            control={form.control}
            render={({ field }) => <SimpleMDE placeholder='Description' {...field} />}
          />
          <div className='flex w-full space-x-4'>
            <FormField
              control={form.control}
              name='status'
              defaultValue={ticket?.status}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Status...' defaultValue={ticket?.status} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='OPEN'>Open</SelectItem>
                      <SelectItem value='STARTED'>Started</SelectItem>
                      <SelectItem value='CLOSED'>Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='priority'
              defaultValue={ticket?.priority}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Priority...' defaultValue={ticket?.priority} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='LOW'>Low</SelectItem>
                      <SelectItem value='MEDIUM'>Medium</SelectItem>
                      <SelectItem value='HIGH'>High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' disabled={isSubmitting}>
            {ticket ? 'Update Ticket' : 'Create Ticket '}
          </Button>
        </form>
      </Form>
      {error && <p className='text-red-500 text-sm mt-4'>{error}</p>}
    </div>
  );
};

export default TicketForm;
