import { redirect } from 'remix';
import { logout } from '~/lib/session.server';

export const action = async ({ request }) => {
  return logout(request);
};

export const loader = async () => {
  return redirect('/');
};
