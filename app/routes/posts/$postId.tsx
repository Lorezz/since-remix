import { Link, redirect, useLoaderData } from 'remix';
import { db } from '~/lib/db.server';
import { getUser } from '~/lib/session.server';

import type { User, Post, Prisma } from '@prisma/client';
import type { ActionFunction, MetaFunction, LoaderFunction } from 'remix';

type PostWithUser = Prisma.PostGetPayload<{
  include: {
    user: {
      select: {
        nick: true;
      };
    };
  };
}>;

type LoaderData = { user: User | null; post: PostWithUser };
export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);

  const post = await db.post.findUnique({
    where: { id: params.postId },
    include: {
      user: { select: { nick: true } },
    },
  });

  if (!post) throw new Error('Post not found');

  const data: LoaderData = { user, post };
  return data;
};

export let meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: 'No joke',
      description: 'No joke found',
    };
  }
  return {
    title: `"${data.post.title}" post`,
    description: `Enjoy the "${data.post.title}" post`,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get('_method') === 'delete') {
    const user = await getUser(request);

    const post = await db.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) throw new Error('Post not found');

    if (user && post.userId === user.id) {
      await db.post.delete({ where: { id: params.postId } });
    }

    return redirect('/posts');
  }
};

function Post() {
  const { post, user } = useLoaderData<LoaderData>();

  return (
    <div className="container">
      <nav className="page-header">
        <Link
          to="/posts"
          className="items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-gray-900 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Back
        </Link>
      </nav>
      <div className="prose p-5">
        <h2 className="uppercase">{post.title}</h2>
        <div className="h6">Author: {post.user.nick}</div>
        <div className="h6">
          Publish on: {new Date(post.createdAt).toLocaleString()}
        </div>
        <div className="text-gray-800 py-10 px-2">{post.body}</div>
      </div>
      <div>
        {user && user.id === post.userId && (
          <form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button className="items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Delete
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Post;
