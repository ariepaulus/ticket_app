import UserForm from '@/components/UserForm';
import DataTableSimple from './data-table-simple';
import prisma from '@/prisma/db';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';

const Users = async () => {
  const session = await getServerSession(options);
  console.log('session?.user [/app/users/page.tsx] => ', session?.user);
  console.log('session?.user?.role [/app/users/page.tsx] => ', session?.user?.role);

  if (session?.user?.role !== 'ADMIN') {
    return <p className='text-destructive'>Admin access required!</p>;
  }

  const users = await prisma.user.findMany();

  return (
    <div>
      <UserForm />
      <DataTableSimple users={users} />
    </div>
  );
};

export default Users;
