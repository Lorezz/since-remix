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
    <div className="auth-container">
      <div className="page-header">
        <h1>Login</h1>
      </div>

      <div className="page-content">
        <form method="POST">
          <fieldset>
            <legend>Login or Register</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === 'login'
                }
              />{' '}
              Login
            </label>

            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === 'register'}
              />{' '}
              Register
            </label>
          </fieldset>
          <div className="form-control">
            <label htmlFor="email">email</label>
            <input
              type="text"
              name="email"
              id="email"
              defaultValue={actionData?.fields?.email}
            />
            <div className="error">
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

          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={actionData?.fields?.password}
            />
            <div className="error">
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

          <button className="btn btn-block" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
