import { useActionData, redirect, json } from 'remix';
import { db } from '~/lib/db.server';
import { createUserSession, login, register } from '~/lib/session.server';

function validateemail(email) {
  if (typeof email !== 'string' || email.length < 3) {
    return 'email must be at least 3 characters';
  }
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters';
  }
}

function badRequest(data) {
  return json(data, { status: 400 });
}

export const action = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get('loginType');
  const email = form.get('email');
  const password = form.get('password');
  const fields = { loginType, email, password };
  const fieldErrors = {
    email: validateemail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case 'login': {
      // Find user
      const user = await login({ email, password });

      // Check user
      if (!user) {
        return badRequest({
          fields,
          fieldErrors: { email: 'Invalid credentials' },
        });
      }

      // Create Session
      return createUserSession(user.id, '/posts');
    }
    case 'register': {
      // Check if user exists
      const userExists = await db.user.findFirst({
        where: {
          email,
        },
      });
      if (userExists) {
        return badRequest({
          fields,
          fieldErrors: { email: `User ${email} already exists` },
        });
      }

      // Create user
      const nick = email.split('@')[0];
      const user = await register({ nick, email, password });
      if (!user) {
        return badRequest({
          fields,
          formError: 'Something went wrong',
        });
      }

      // Create session
      return createUserSession(user.id, '/posts');
    }
    default: {
      return badRequest({
        fields,
        formError: 'Login type is invalid',
      });
    }
  }

  return redirect('/posts');
};

function Login() {
  const actionData = useActionData();

  return (
    <div className="container my-10 flex flex-col justify-center items-center">
      <div className="header prose">
        <h2>Login</h2>
      </div>

      <div className="mt-5 border border-gray-100 bg-gray-50 rounded-md mx-auto p-5 w-11/12 sm:w-3/4 lg:w-2/5  flex flex-col items-center">
        <form method="POST" className="w-full">
          <div className="flex items-center">
            <input
              type="radio"
              name="loginType"
              value="login"
              defaultChecked={
                !actionData?.fields?.loginType ||
                actionData?.fields?.loginType === 'login'
              }
            />
            <label className="px-2">Login</label>
            <input
              type="radio"
              name="loginType"
              value="register"
              defaultChecked={actionData?.fields?.loginType === 'register'}
            />
            <label className="px-2">Register</label>
          </div>
          <div className="my-5">
            <div>
              <label htmlFor="email">email</label>
            </div>
            <input
              className="rounded w-full"
              type="text"
              name="email"
              id="email"
              defaultValue={actionData?.fields?.email}
            />
            <div className="text-red-500 uppercase text-xs pt-2">
              {actionData?.fieldErrors?.email ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="email-error"
                >
                  {actionData.fieldErrors.email}
                </p>
              ) : null}
            </div>
          </div>

          <div className="my-5">
            <div>
              <label htmlFor="password">Password</label>
            </div>
            <input
              className="rounded w-full"
              type="password"
              name="password"
              id="password"
              defaultValue={actionData?.fields?.password}
            />
            <div className="text-red-500 uppercase text-xs pt-2">
              {actionData?.fieldErrors?.password ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="password-error"
                >
                  {actionData.fieldErrors.password}
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="items-center px-4 py-2 border border-transparent text-md font-medium rounded-md text-white bg-gray-900 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
