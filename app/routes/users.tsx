import { json, useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import type { User } from '@prisma/client';
import { db } from '~/lib/db.server';

type LoaderData = { users: Array<User> };
export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    users: await db.user.findMany(),
  };
  return data;
};

export default function Users() {
  const data = useLoaderData<LoaderData>();
  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>
          {user.nick} - {user.email}
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </li>
      ))}
    </ul>
  );
}
