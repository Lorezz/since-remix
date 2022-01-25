import { Link } from 'remix';
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
export default function NavBar({ user }) {
  return (
    <Disclosure as="nav" className="shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="font-bold text-lg">
                    Remix
                  </Link>
                </div>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                  to="/posts"
                >
                  Posts
                </Link>
                <Link
                  className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                  to="/posts"
                >
                  Posts
                </Link>
                <Link
                  className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                  to="/posts"
                >
                  Posts
                </Link>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {user ? (
                    <form action="/auth/logout" method="POST">
                      <button
                        type="submit"
                        className="relative inline-flex items-center px-4 py-2 border border-transparent text-xs font-small rounded-md text-white bg-gray-900 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <span>Logout {user?.nick}</span>
                      </button>
                    </form>
                  ) : (
                    <Link to="/auth/login">Login</Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Disclosure.Button
                as="a"
                href="#"
                className="block pl-3 pr-4 py-2 text-base font-medium sm:pl-5 sm:pr-6"
              >
                <Link to="/posts">Posts</Link>
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
