import { Link } from 'remix';
import * as React from 'react';

export default function Layout({
  data,
  children,
}: {
  data: any;
  children: React.ReactElement;
}) {
  const user = data?.user;

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>

        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method="POST">
                <button type="submit" className="btn">
                  Logout {user?.nick}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="container">{children}</div>
    </>
  );
}
