import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useCatch,
} from 'remix';
import { getUser } from '~/lib/session.server';
import type { MetaFunction, LoaderFunction, LinksFunction } from 'remix';

import twCss from './tailwind.css';
import appCss from './styles/app.css';
import Layout from './components/Layout';

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: twCss },
    { rel: 'stylesheet', href: appCss },
  ];
};

export const meta: MetaFunction = () => {
  return { title: 'New Remix App' };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return user ? { user } : null;
};

export default function App() {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <title>{'Remix Blog'}</title>
      </head>
      <body>
        <Layout data={data}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  switch (caught.status) {
    case 404: {
      return (
        <div className="prose container">
          <h1 className="uppercase">404 not found</h1>
        </div>
      );
    }
    case 401: {
      return (
        <div className="prose container">
          <h1 className="uppercase">Sorry, but you have to sign-in before</h1>
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}
export function ErrorBoundary({ error }: { error: Error }) {
  console.log('ERROR', error);
  return (
    <Layout data={null}>
      <div className="prose container">
        <h1 className="uppercase">Error</h1>
        <p>{error.message}</p>
      </div>
    </Layout>
  );
}
