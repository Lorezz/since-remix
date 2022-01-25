import {
  Link,
  redirect,
  useActionData,
  json,
  useParams,
  useCatch,
} from 'remix';
import { db } from '~/lib/db.server';
import { getUser } from '~/lib/session.server';
import type { ActionFunction } from 'remix';
import type { Prisma, Post } from '@prisma/client';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    title: string | undefined;
    body: string | undefined;
  };
  fields?: {
    title: string;
    body: string;
  };
};

function validateField(name: string, size: number = 2) {
  if (name.length < size) {
    return `Content too short`;
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const title = form.get('title');
  const body = form.get('body');
  const user = await getUser(request);

  if (typeof title !== 'string' || typeof body !== 'string') {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }
  const fieldErrors = {
    title: validateField(title),
    body: validateField(body),
  };
  const fields = { title, body };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const userId = user?.id;
  if (!userId) {
    return;
  }
  const data: Prisma.PostUncheckedCreateInput = { ...fields, userId };
  const post: Post = await db.post.create({ data });
  return redirect(`/posts/${post.id}`);
};

function NewPost() {
  const actionData = useActionData();
  return (
    <>
      <div className="header prose">
        <h1>New Post</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="container  px-2 mt-10">
        <form method="POST">
          <div className=" ">
            <div>
              <label htmlFor="title">Title</label>
            </div>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={actionData?.fields?.title}
            />
            <div className="error">
              {actionData?.fieldErrors?.title ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="title-error"
                >
                  {actionData.fieldErrors.title}
                </p>
              ) : null}
            </div>
          </div>
          <div className="">
            <div>
              <label htmlFor="body">Post Body</label>
            </div>
            <textarea
              name="body"
              id="body"
              defaultValue={actionData?.fields?.body}
            />
            <div className="error">
              {actionData?.fieldErrors?.body ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="body-error"
                >
                  {actionData.fieldErrors.body}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="submit"
            className="items-center px-4 py-2 border border-transparent text-md font-medium rounded-md text-white bg-gray-900 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Add Post
          </button>
        </form>
      </div>
    </>
  );
}

export default NewPost;

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  switch (caught.status) {
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.jokeId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.jokeId} is not your joke.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}
