import { Link, useLoaderData } from 'remix';
import { db } from '~/lib/db.server';
import type { Post } from '@prisma/client';
import { getUser } from '~/lib/session.server';
import type { LoaderFunction } from 'remix';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const data = {
    posts: await db.post.findMany({
      take: 50,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    user,
  };

  return data;
};

function PostItems() {
  const { posts, user } = useLoaderData();

  return (
    <>
      <div className="header prose">
        <h2>Posts</h2>
      </div>
      <div className="my-10 w-full flex flex-row justify-end">
        <div className=" self-end">
          <Link to={user ? '/posts/new' : '/auth/login'}>
            <span className="items-center px-4 py-2 border border-transparent text-md font-medium rounded-md text-white bg-gray-900 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              + New Post
            </span>
          </Link>
        </div>
      </div>
      <div className="container mb-20">
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
        >
          {posts.map((post: Post) => (
            <li key={post.id} className="relative">
              <Link to={post.id}>
                <>
                  <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-green:ring-green-500 overflow-hidden">
                    <img
                      src={'https://placehold.co/600x400'}
                      alt=""
                      className="object-cover pointer-events-none group-hover:opacity-75"
                    />
                  </div>
                  <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                    {post.title}
                  </p>
                  <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default PostItems;
