import { Link, redirect, useLoaderData } from 'remix';
import { db } from '~/lib/db.server';
import { getUser } from '~/lib/session.server';

import type { User, Post } from '@prisma/client';
import type { ActionFunction, MetaFunction, LoaderFunction } from 'remix';

type LoaderData = { user: User | null; post: Post };
export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);

  const post = await db.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) throw new Error('Post not found');

  const data: LoaderData = { post, user };
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
    <div>
      <div className="page-header">
        <h1>{post.title}</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">{post.body}</div>

      <div className="page-footer">
        {user && user.id === post.userId && (
          <form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button className="btn btn-delete">Delete</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Post;
