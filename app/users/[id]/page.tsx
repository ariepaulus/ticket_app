import prisma from '@/prisma/db';
import UserForm from '@/components/UserForm';
import { getServerSession } from 'next-auth';
import options from '@/app/api/auth/[...nextauth]/options';

interface Props {
  params: { id: string };
}

const EditUser = async ({ params }: Props) => {
  const session = await getServerSession(options);
  console.log('session?.user [/app/users/[id]/page.tsx] => ', session?.user);
  console.log('session?.user?.role [/app/users/[id]/page.tsx] => ', session?.user?.role);

  if (session?.user.role !== 'ADMIN') {
    return <p className='text-destructive'>Admin access required!</p>;
  }

  const user = await prisma?.user.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!user) {
    return <p className='text-destructive'>User not found!</p>;
  }

  user.password = '';

  return <UserForm user={user} />;
};

export default EditUser;
