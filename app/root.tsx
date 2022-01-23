import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'remix';
import { getUser } from '~/lib/session.server';
import type { MetaFunction, LoaderFunction, LinksFunction } from 'remix';

import styles from './tailwind.css';
import Layout from './components/Layout';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
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

export function ErrorBoundary({ error }: { error: Error }) {
  console.log('ERROR', error);
  return (
    <Layout data={null}>
      <div>
        <h1 className="text-red-500 text-lg">Error</h1>
        <p>{error.message}</p>
      </div>
    </Layout>
  );
}
